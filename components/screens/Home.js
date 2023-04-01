import React, { useContext, useState, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View, PixelRatio, FlatList } from "react-native";
import { Divider, Layout, Text } from "@ui-kitten/components";
import { Carousel, Diptych, Mark, Shelf, Wildcard } from "../";
import { useWordPress } from "../../hooks/useWordPress";
import { Sections, Spacing } from "../../utils/constants";
import _ from "lodash";
import { DeviceType } from "expo-device";
import { ThemeContext } from "../../theme-context";
import { StatusBar } from "expo-status-bar";

const FirstPage = React.memo(({ articles, data, navigation, deviceType }) => {
  const groupSize = deviceType === DeviceType.PHONE ? 1 : 2;

  return (
    <React.Fragment>
      <Carousel
        articles={articles[Sections.FEATURED.slug] ?? []}
        navigation={navigation}
      />
      <Mark
        category={Sections.NEWS}
        seed={data[Sections.NEWS.slug] ?? []}
        navigation={navigation}
      />
      <Diptych
        articles={articles[Sections.NEWS.slug] ?? []}
        navigation={navigation}
      />
      <Divider marginTop={Spacing.medium} />
      <Mark
        category={Sections.OPINIONS}
        seed={data[Sections.OPINIONS.slug]}
        navigation={navigation}
      />
      <Shelf
        articles={articles[Sections.OPINIONS.slug] ?? []}
        navigation={navigation}
      />
      <Mark
        category={Sections.SPORTS}
        seed={data[Sections.SPORTS.slug] ?? []}
        navigation={navigation}
      />
      <Diptych
        articles={articles[Sections.SPORTS.slug] ?? []}
        navigation={navigation}
      />
      <Divider marginTop={Spacing.medium} />
      {_.chunk(articles?.culture?.slice(0, 4 * groupSize), groupSize)?.map(
        (group, outerIndex) => (
          <View
            style={{ flex: 1 / groupSize, flexDirection: "row" }}
            key={outerIndex}
          >
            {group.map((item, index) => (
              <Wildcard
                item={item}
                index={outerIndex * index + index}
                key={item.id.toString()}
                navigation={navigation}
              />
            ))}
          </View>
        )
      )}
      <Divider />
      <Mark
        category={Sections.HUMOR}
        seed={data[Sections.HUMOR.slug] ?? []}
        alternate
        navigation={navigation}
      />
      <Shelf
        articles={articles[Sections.HUMOR.slug] ?? []}
        alternate
        navigation={navigation}
      />
      <Divider />
    </React.Fragment>
  );
});

export default function Home({ navigation, route }) {
  const [pageNumber, setPageNumber] = useState(1);
  const { data, articles, error, loading } = useWordPress(pageNumber);
  const { theme, deviceType } = useContext(ThemeContext);

  const firstPageComponent = useMemo(() => {
    return (
      <FirstPage
        articles={articles}
        data={data}
        navigation={navigation}
        deviceType={deviceType}
      />
    );
  }, [articles, data, navigation, deviceType]);

  return articles ? (
    <Layout style={styles.container}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <FlatList
        ListHeaderComponent={firstPageComponent}
        data={data?.wildcard ?? []}
        renderItem={(post, index) => (
          <Wildcard
            item={post.item}
            index={index}
            key={post.item.id.toString()}
            navigation={navigation}
            verbose
          />
        )}
        onEndReached={() => setPageNumber(pageNumber + 1)}
        onEndReachedThreshold={0.25}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={() => <ActivityIndicator style={{ marginBottom: Spacing.large }} />}
      />
    </Layout>
  ) : (
    <Layout style={styles.empty}>
      {loading ? <ActivityIndicator /> : (<Text>Something went wrong.{`\n${JSON.stringify(error)}`}</Text>)}
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