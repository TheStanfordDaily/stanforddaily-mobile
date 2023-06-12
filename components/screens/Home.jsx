import React, { useContext, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, PixelRatio, StyleSheet, View } from "react-native";
import { Divider, Layout, Text } from "@ui-kitten/components";
import _ from "lodash";
import { DeviceType } from "expo-device";
import { StatusBar } from "expo-status-bar";

import { Carousel, Mark, Polyptych, Shelf, Wildcard } from "..";
import { useWordPress } from "../../hooks/useWordPress";
import { Sections, Spacing } from "../../utils/constants";
import { ThemeContext } from "../../theme-context";

const FirstPage = React.memo(({ articles, data, navigation, deviceType }) => {
  const groupSize = deviceType === DeviceType.PHONE ? 1 : 2;

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
});

export default function Home({ navigation, route }) {
  const [pageNumber, setPageNumber] = useState(1);
  const { data, articles, error, loading } = useWordPress(pageNumber);
  const { theme, deviceType } = useContext(ThemeContext);
  // Ensure that no culture posts simultaneously appear in wildcard.
  const wildcard = data?.wildcard?.filter(item => !articles?.culture?.find(article => article.id === item.id));

  const Header = useMemo(() => (
    <FirstPage
      articles={articles}
      data={data}
      deviceType={deviceType}
      navigation={navigation}
    />
  ), [articles, data, navigation, deviceType]);

  return articles ? (
    <Layout style={styles.container}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <FlatList
        data={wildcard}
        keyExtractor={item => item.id.toString()}
        ListFooterComponent={() => <ActivityIndicator style={{ marginBottom: Spacing.large }} />}
        ListHeaderComponent={Header}
        onEndReached={() => setPageNumber(pageNumber + 1)}
        onEndReachedThreshold={0.25}
        renderItem={(post, index) => (
          <Wildcard
            key={post.item.id.toString()}
            index={index}
            item={post.item}
            navigation={navigation}
            verbose
          />
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
    flex: 1
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
