import { Divider, Layout, Text } from "@ui-kitten/components";
import { DeviceType } from "expo-device";
import { StatusBar } from "expo-status-bar";
import _ from "lodash";
import React, { useContext, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import { Carousel, Mark, Polyptych, Shelf, Wildcard } from "..";
import { useWordPress } from "../../hooks/useWordPress";
import { ThemeContext } from "../../theme-context";
import { Sections, Spacing } from "../../utils/constants";

const FirstPage = React.memo(
  /**
   * The `FirstPage` React component displays everything before the wildcard articles.
   * It is memoized to prevent unnecessary re-renders.
   *
   * @component
   * @property {Record<string, Array<import("../../utils/model").WordPressPost>} articles - The list of articles to display, grouped by category.
   * @property {Record<string, Array<import("../../utils/model").WordPressPost>} data - Articles from same initial API call, but without any filters applied.
   * @property {Object} navigation - The navigation object used by React Navigation.
   * @property {DeviceType} deviceType - An enumeration with the type of device on which the app is running. Used to determine layout.
   */
  ({ data, articles, navigation, deviceType }) => {
    const groupSize = deviceType === DeviceType.PHONE ? 1 : 2;

    return (
      <>
        <Carousel articles={articles[Sections.FEATURED.slug] ?? []} navigation={navigation} />
        <Mark category={Sections.NEWS} navigation={navigation} seed={data[Sections.NEWS.slug] ?? []} />
        <Polyptych articles={articles[Sections.NEWS.slug] ?? []} navigation={navigation} />
        <Divider marginTop={Spacing.medium} />
        <Mark category={Sections.OPINIONS} navigation={navigation} seed={data[Sections.OPINIONS.slug]} />
        <Shelf articles={articles[Sections.OPINIONS.slug] ?? []} navigation={navigation} />
        <Mark category={Sections.SPORTS} navigation={navigation} seed={data[Sections.SPORTS.slug] ?? []} />
        <Polyptych articles={articles[Sections.SPORTS.slug] ?? []} navigation={navigation} />
        <Divider marginTop={Spacing.medium} />
        {_.chunk(articles?.culture?.slice(0, 4 * groupSize), groupSize)?.map((group, outerIndex) => (
          <View key={outerIndex} style={{ flex: 1 / groupSize, flexDirection: "row" }}>
            {group.map((item, index) => (
              <Wildcard
                key={item.id.toString()}
                index={outerIndex * index + index}
                item={item}
                navigation={navigation}
              />
            ))}
          </View>
        ))}
        <Divider />
        <Mark alternate category={Sections.HUMOR} navigation={navigation} seed={data[Sections.HUMOR.slug] ?? []} />
        <Shelf alternate articles={articles[Sections.HUMOR.slug] ?? []} navigation={navigation} />
        <Divider />
      </>
    );
  }
);

/**
 * The `Home` component is what you first see when opening the application.
 * It fetches data from WordPress using a React hook, then passes it to the `FirstPage` component for rendering.
 * It also contains pagination logic to fetch new data when the end of the list is reached.
 *
 * @component
 * @property {Object} navigation - The navigation object used by React Navigation.
 * @exports Home
 */
export default function Home({ navigation }) {
  const [pageNumber, setPageNumber] = useState(1);
  const { data, articles, desks, error, loading } = useWordPress(pageNumber);
  const { theme, deviceType } = useContext(ThemeContext);
  // Ensure that no culture posts simultaneously appear in wildcard.
  const wildcard = data?.wildcard?.filter((item) => !articles?.culture?.find((article) => article.id === item.id));

  const Header = useMemo(() => {
    return <FirstPage articles={articles} data={data} deviceType={deviceType} navigation={navigation} />;
  }, [articles, data, navigation, deviceType]);

  return articles ? (
    <Layout style={styles.container}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <FlatList
        data={wildcard}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={() => <ActivityIndicator style={{ marginBottom: Spacing.large }} />}
        ListHeaderComponent={Header}
        onEndReached={() => setPageNumber(pageNumber + 1)}
        onEndReachedThreshold={0.25}
        renderItem={(post, index) => (
          <Wildcard key={post.item.id.toString()} index={index} item={post.item} navigation={navigation} verbose />
        )}
      />
    </Layout>
  ) : (
    <Layout style={styles.empty}>
      {loading ? <ActivityIndicator /> : <Text>Something went wrong.{`\n${JSON.stringify(error)}`}</Text>}
    </Layout>
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
