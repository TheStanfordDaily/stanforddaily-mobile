import { Layout, List, Tab, TabBar } from "@ui-kitten/components";
import { DeviceType } from "expo-device";
import React, { useContext, useState, useRef, useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";

import { ThemeContext } from "../../theme-context";
import { Spacing } from "../../utils/constants";
import Model from "../../utils/model";
import Wildcard from "../common/Wildcard";

const BATCH_SIZE = 16;
const MemoizedWildcard = React.memo(Wildcard);

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
  const [selection, setSelection] = useState(0);
  const [pageScrollState, setPageScrollState] = useState("idle");

  const { theme, deviceType } = useContext(ThemeContext);
  const columnCount = deviceType === DeviceType.PHONE ? 1 : 2;
  const Container = theme === "dark" ? Layout : View;
  const pagerViewRef = useRef(null);
  const scrollViewRef = useRef(null);
  const tabWidths = useRef(new Array(category.desks?.length ?? 1).fill(0));

  // Measure the width of each tab.
  const measureTab = (index) => (event) => {
    const { width } = event.nativeEvent.layout;
    tabWidths.current[index] = width;
  };

  // Calculate the position of the tab.
  const getTabOffset = (index) => {
    return tabWidths.current.slice(0, index).reduce((acc, width) => acc + width, 0);
  };

  // Scroll to the selected tab if it is not currently visible.
  const scrollToSelectedTab = (index) => {
    const offset = getTabOffset(index);
    scrollViewRef?.current?.scrollTo({ x: offset, animated: true });
  };

  const fetchResults = async (subcategory, pageNumber) => {
    try {
      return await Model.posts().categories(subcategory.id).perPage(BATCH_SIZE).page(pageNumber).embed().get();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const CategoryContainer = useMemo(
    () =>
      React.memo(({ sectionArticles, basePageCount, subcategory }) => {
        const [articles, setArticles] = useState(sectionArticles);
        // Before loading more articles, we calculate the number of pages we can skip when calling the API.
        const [pageNumber, setPageNumber] = useState(basePageCount);
        const [articlesLoading, setArticlesLoading] = useState(false);
        const [possiblyReachedEnd, setPossiblyReachedEnd] = useState(false);

        const loadMoreArticles = async () => {
          if (possiblyReachedEnd || articlesLoading) return;

          setArticlesLoading(true);
          const newArticles = await fetchResults(subcategory, pageNumber + 1);
          if (newArticles.length === 0) {
            setPossiblyReachedEnd(true);
          } else {
            setArticles((prev) => [...prev, ...newArticles]);
            setPageNumber((prev) => prev + 1);
          }
          setArticlesLoading(false);
        };

        if (articles.length === 0) {
          loadMoreArticles();

          return (
            <Container>
              <ActivityIndicator />
            </Container>
          );
        }

        return (
          <Container>
            <List
              data={articles}
              style={{ backgroundColor: "transparent" }}
              numColumns={columnCount}
              scrollEventThrottle={BATCH_SIZE}
              showsVerticalScrollIndicator={false}
              onEndReached={loadMoreArticles}
              onEndReachedThreshold={0.5}
              renderItem={({ item, index }) => (
                <MemoizedWildcard
                  key={`${subcategory.id}-${item.id}`}
                  item={item}
                  index={index}
                  navigation={navigation}
                />
              )}
              ListFooterComponent={() => articlesLoading && <ActivityIndicator />}
            />
          </Container>
        );
      }),
    [theme, deviceType, navigation]
  );

  const renderTabs = () => {
    const tabs = [
      { name: `All ${category.name}`, id: "all" },
      ...Object.values(category.desks ?? {}).map((desk, index) => ({ ...desk, id: index + 1 })),
    ];

    return tabs.map((tab, index) => (
      <Tab
        key={tab.id}
        onSelect={() => {
          setSelection(index);
          pagerViewRef.current?.setPage(index);
          scrollToSelectedTab(index);
        }}
        onLayout={measureTab(index)}
        selected={selection === index}
        style={styles.tab}
        title={tab.name}
      />
    ));
  };

  const renderPagerView = () => {
    const sections = [{ ...category, id: "all" }, ...Object.values(category.desks ?? {})];

    return sections.map((section) => {
      const numericId = section.id === "all" ? category.id : section.id;
      const subcategory =
        section.id === "all"
          ? category
          : Object.values(category.desks).find((value) => value.id === section.id) ?? category;
      const filteredSeed = seed.filter((item) => item.categories.includes(numericId));

      return (
        <CategoryContainer
          key={section.id}
          sectionArticles={filteredSeed}
          basePageCount={Math.max(1, Math.floor(filteredSeed.length / BATCH_SIZE) - 1)}
          subcategory={subcategory}
        />
      );
    });
  };

  return (
    <>
      {category.desks && (
        <TabBar
          selectedIndex={selection}
          onSelect={(index) => {
            setSelection(index);
            pagerViewRef.current?.setPage(index);
          }}
          indicatorStyle={styles.indicator}
        >
          <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false}>
            {renderTabs()}
          </ScrollView>
        </TabBar>
      )}
      <PagerView
        ref={pagerViewRef}
        onPageSelected={(e) => {
          setSelection(e.nativeEvent.position);
          scrollToSelectedTab(e.nativeEvent.position);
        }}
        onPageScrollStateChanged={(e) => setPageScrollState(e.nativeEvent.pageScrollState)}
        scrollEnabled={Object.keys(category.desks ?? {}).length > 0}
        style={styles.container}
        initialPage={0}
        overdrag
      >
        {renderPagerView()}
      </PagerView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tab: {
    marginHorizontal: Spacing.medium,
  },
  indicator: {
    opacity: 0,
  },
});
