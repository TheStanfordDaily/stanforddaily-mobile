import { Layout, List, Text, Tab, TabBar } from "@ui-kitten/components";
import { DeviceType } from "expo-device";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";

import { ThemeContext } from "../../theme-context";
import { Spacing } from "../../utils/constants";
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
 * @param {Object} props
 * @param {Object} props.route The route prop passed by the navigation. It includes the category and seed data.
 * @param {{ category: import("../../utils/constants").Category, seed: Array<import("../../utils/model").WordPressPost> }} props.route.params The parameters passed by the navigation. It includes the category and seed data.
 * @param {Object} props.navigation From React Navigation.
 */
export default function Section({ route, navigation }) {
  const { category, seed } = route.params;
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [selection, setSelection] = useState(0);
  const [pageNumbers, setPageNumbers] = useState({ [category.slug]: seed.length === 0 ? 1 : 2 });
  const [articles, setArticles] = useState({ [category.slug]: seed });
  const [possiblyReachedEnd, setPossiblyReachedEnd] = useState(false);

  // Before loading more articles, we calculate the number of pages we can skip when calling the API.
  // Since there might already be a chronology of several articles passed in from the seed data, there's no need to fetch them again.
  const basePageCount = Math.max(0, Math.floor(seed.length / BATCH_SIZE) - 1);
  // The `theme` and `deviceType` are used to determine the number of columns in the list of articles.
  const { theme, deviceType } = useContext(ThemeContext);
  const columnCount = deviceType === DeviceType.PHONE ? 1 : 2;

  useEffect(() => {
    for (const desk of Object.values(category.desks)) {
      setArticles((prev) => ({
        ...prev,
        [desk.slug]: seed.filter((item) => item.categories.includes(desk.id)),
      }));
    }
  }, [seed]);

  const fetchResults = async (section) => {
    setArticlesLoading(true);
    try {
      return await Model.posts()
        .embed()
        .categories(section.id)
        .perPage(BATCH_SIZE)
        .page((section.slug === category.slug ? basePageCount : 0) + (pageNumbers[section.slug] || 1))
        .get();
    } catch (error) {
      console.log(error);
      if (error.data?.status === 400) {
        setPossiblyReachedEnd(true);
      }
    } finally {
      setArticlesLoading(false);
    }
  };

  const Container = theme === "dark" ? Layout : View;
  const pagerViewRef = React.useRef(null);

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
              style={{ marginHorizontal: Spacing.medium }}
              title={`All ${category.name}`}
            />
            {Object.values(category.desks).map((section, index) => (
              <Tab
                onSelect={() => {
                  setSelection(index + 1);
                  pagerViewRef.current.setPage(index + 1);
                }}
                selected={selection === index + 1}
                style={{ marginHorizontal: Spacing.medium }}
                title={section.name}
                key={index}
              />
            ))}
          </ScrollView>
        </TabBar>
      )}
      <PagerView
        ref={pagerViewRef}
        /*onPageScrollStateChanged={(e) => {
          console.log(e.nativeEvent.pageScrollState);
          console.log(e.nativeEvent.position);
          if (e.nativeEvent.pageScrollState === "idle") {
            setSelection(e.nativeEvent.position);
          }
        }}*/
        onPageSelected={(e) => {
          console.log("position", e.nativeEvent.position);
          setSelection(e.nativeEvent.position);
        }}
        scrollEnabled={Object.keys(category.desks ?? {}).length > 0} // Disable swiping in `PagerView` if there are no desks.
        style={styles.container}
        initialPage={0}
        overdrag
      >
        {Object.values(articles).map((sectionArticles, index) => (
          <Container>
            <List
              data={sectionArticles}
              style={{ backgroundColor: "transparent" }}
              numColumns={columnCount}
              key={index}
              scrollEventThrottle={BATCH_SIZE}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={1}
              onEndReached={() => {
                if (!articlesLoading) {
                  // setPageNumbers((prev) => ({ ...prev, [section.slug]: (prev[section.slug] || 0) + 1 }));
                }
              }}
              renderItem={({ item, index }) => (
                <Wildcard key={item.id} item={item} index={index} navigation={navigation} verbose />
              )}
              ListFooterComponent={() => {
                if (!possiblyReachedEnd || articlesLoading) {
                  return <ActivityIndicator />;
                }
              }}
            />
          </Container>
        ))}
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
});
