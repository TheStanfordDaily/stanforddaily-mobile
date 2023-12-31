import { Layout, List, Tab, TabBar, Text } from "@ui-kitten/components";
import { DeviceType } from "expo-device";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";

import { ThemeContext } from "../../theme-context";
import { Spacing } from "../../utils/constants";
import { throttle } from "../../utils/format";
import Model from "../../utils/model";
import Wildcard from "../common/Wildcard";

const BATCH_SIZE = 16;

/**
 * The `Section` screen displays a list of articles from a specific category.
 *
 * The component maintains several pieces of state:
 * - `articlesLoading`: A Boolean indicating whether the articles are currently being fetched.
 * - `selection`: An integer representing the currently selected article.
 * - `pageNumber`: The current page number for fetching articles. It starts from `1` if no seed data is provided, otherwise it starts from `2`.
 * - `articles`: An array of articles. It starts with the seed data and gets appended with more articles as they are fetched.
 * - `possiblyReachedEnd`: A Boolean indicating whether all possible articles from the WordPress category have been fetched.
 *
 * @component
 * @property {Object} route The route prop passed by the navigation. It includes the category and seed data.
 * @property {{ category: import("../../utils/constants").Category, seed: Array<import("../../utils/model").WordPressPost> }} route.params The parameters passed by the navigation. It includes the category and seed data.
 * @property {Object} navigation From React Navigation.
 * @exports Section
 */
export default function Section({ route, navigation }) {
  const { category, seed } = route.params;
  // const [articlesLoading, setArticlesLoading] = useState(false);
  const [selection, setSelection] = useState(0);
  const [allArticles, setAllArticles] = useState(seed);
  // The `theme` and `deviceType` are used to determine the number of columns in the list of articles.
  const { theme, deviceType } = useContext(ThemeContext);
  const columnCount = deviceType === DeviceType.PHONE ? 1 : 2;

  const Container = theme === "dark" ? Layout : View;
  const pagerViewRef = React.useRef(null);

  // Might try memoizing this down the line.

  /**
   * @component
   * @property {Array<import("../../utils/model").WordPressPost>} sectionArticles
   * @property {number} basePageCount Before loading more articles, we calculate the number of pages we can skip when calling the API.
   * @property {number} sectionId
   * @property {import("../../utils/constants").Category} subcategory
   */
  const CategoryContainer = React.memo(({ sectionArticles, basePageCount, subcategory }) => {
    const [possiblyReachedEnd, setPossiblyReachedEnd] = useState(false);
    const [articlesLoading, setArticlesLoading] = useState(false);
    const [articles, setArticles] = useState(sectionArticles);
    // Since there might already be a chronology of several articles passed in from the seed data, there's no need to fetch them again.
    // Right now the page numbers are a little out of sync, so that needs to be fixed ASAP.
    const [pageNumber, setPageNumber] = useState(basePageCount);

    const fetchResults = async () => {
      setArticlesLoading(true);
      try {
        const posts = await Model.posts()
          .categories(subcategory.id)
          .perPage(BATCH_SIZE)
          .page(basePageCount + pageNumber)
          .get();
        // TODO: Update the "all" list of articles, too.
        setArticles((prev) => [...prev, ...posts]);
      } catch (error) {
        console.log(error);
        if (error.data?.status === 400) {
          setPossiblyReachedEnd(true);
        }
      } finally {
        setArticlesLoading(false);
        // setAllArticles((prev) => [...prev, ...articles.filter((item) => !prev.find((article) => article.id === item.id))]);
      }
    };

    const throttledFetch = useCallback(throttle(fetchResults, 3000), []);

    useEffect(() => {
      throttledFetch();
    }, [pageNumber]);

    return (
      <Container>
        <List
          data={articles}
          style={{ backgroundColor: "transparent" }}
          numColumns={columnCount}
          scrollEventThrottle={BATCH_SIZE}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={1}
          onEndReached={() => {
            if (!possiblyReachedEnd && !articlesLoading) {
              setPageNumber(pageNumber + 1);
            }
          }}
          renderItem={({ item, index }) => (
            <Wildcard key={`${subcategory.id}-${item.id}`} item={item} index={index} navigation={navigation} verbose />
          )}
          ListFooterComponent={() => {
            // if (!possiblyReachedEnd || articlesLoading) {
            //   return <ActivityIndicator />;
            // }
          }}
        />
      </Container>
    );
  });

  return (
    <>
      {category.desks && (
        // TODO: Make sure this is accessible using VoiceOver.
        <TabBar
          selectedIndex={selection}
          onSelect={(index) => {
            setSelection(index);
            pagerViewRef.current.setPage(index);
          }}
          indicatorStyle={styles.indicator}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Tab
              onSelect={() => {
                setSelection(0);
                pagerViewRef.current.setPage(0);
              }}
              selected={selection === 0}
              style={styles.tab}
              title={`All ${category.name}`}
            />
            {Object.values(category.desks).map((section, index) => (
              <Tab
                onSelect={() => {
                  setSelection(index + 1);
                  pagerViewRef.current.setPage(index + 1);
                }}
                selected={selection === index + 1}
                style={styles.tab}
                title={section.name}
                key={index}
              />
            ))}
          </ScrollView>
        </TabBar>
      )}
      <PagerView
        ref={pagerViewRef}
        onPageSelected={(e) => {
          setSelection(e.nativeEvent.position);
        }}
        scrollEnabled={Object.keys(category.desks ?? {}).length > 0} // Disable swiping in `PagerView` if there are no desks.
        style={styles.container}
        initialPage={0}
        overdrag
      >
        {Object.entries({ ...{ category }, ...(category.desks ?? {}) }).map(([sectionId, sectionArticles], index) => {
          const numericId = category.desks ? (category.desks[sectionId] ?? category).id : category.id;
          const subcategory = category.desks?.[sectionId] ?? category;
          const filteredSeed = seed.filter((item) => item.categories.includes(numericId));

          return (
            <CategoryContainer
              key={index}
              sectionArticles={filteredSeed}
              basePageCount={Math.max(1, Math.floor(filteredSeed.length / BATCH_SIZE) - 1)}
              sectionId={sectionId}
              subcategory={subcategory}
            />
          );
        })}
      </PagerView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    opacity: 0,
  },
  tab: {
    marginHorizontal: Spacing.medium,
  },
});
