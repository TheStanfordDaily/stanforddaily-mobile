import { Layout, List, Tab, TabBar, Text } from "@ui-kitten/components";
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
        <TabBar
          selectedIndex={selection}
          onSelect={(index) => {
            setSelection(index);
            pagerViewRef.current.setPage(index);
          }}
          indicatorStyle={{ opacity: 0 }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Tab
              title={() => (
                <Text
                  category="label"
                  selectionColor="info"
                  appearance={selection === 1 ? undefined : "hint"}
                  // style={{ marginHorizontal: Spacing.medium, color: selection === 0 ? "red" : undefined }}
                >
                  {category.name}
                </Text>
              )}
            />
            {Object.values(category.desks).map((section, index) => (
              <Tab
                title={() => (
                  <Text
                    category="label"
                    selectionColor="info"
                    // status="basic"
                    style={{ marginHorizontal: Spacing.medium }}
                  >
                    {section.name}
                  </Text>
                )}
              />
            ))}
          </ScrollView>
        </TabBar>
      )}
      <PagerView
        ref={pagerViewRef}
        onPageScrollStateChanged={(e) => {
          console.log(e.nativeEvent.pageScrollState);
          if (e.nativeEvent.pageScrollState === "idle") {
            setSelection(e.nativeEvent.position);
          }
        }}
        onPageSelected={(e) => {
          console.log(e.nativeEvent.position);
          setSelection(e.nativeEvent.position);
        }}
        scrollEnabled={Object.keys(category.desks ?? {}).length > 0} // Disable swiping in `PagerView` if there are no desks.
        style={{ flex: 1 }}
        initialPage={0}
        overdrag
      >
        {/*[...Object.values(category), ...(category.desks ? Object.values(category.desks) : [])].map(
          (section, index) => (*/}
        <Container>
          <List
            data={seed}
            style={{ backgroundColor: "transparent" }}
            numColumns={columnCount}
            // key={index}
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
        {/*)
        )}*/}
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
});
