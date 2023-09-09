import { Card, Layout, List, Text } from "@ui-kitten/components";
import { DeviceType } from "expo-device";
import { decode } from "html-entities";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ImageBackground, PixelRatio, StyleSheet } from "react-native";

import { ThemeContext } from "../../theme-context";
import { formatDate, stringMode } from "../../utils/format";
import Model from "../../utils/model";

const { width, height } = Dimensions.get("window");
const pixelRatio = PixelRatio.get();

const Header = ({ uri }) => (
  // There might be a better way to do this: https://reactnative.dev/docs/pixelratio
  <ImageBackground source={{ uri: `${uri}?w=${(width * pixelRatio) / 2}` }} style={{ height: 140 }} />
);

export default function Author({ route, navigation }) {
  const { name, id } = route.params;
  const [pageNumber, setPageNumber] = useState(1);
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [authorDetail, setAuthorDetail] = useState(null);
  const [possiblyReachedEnd, setPossiblyReachedEnd] = useState(false);
  const { deviceType } = useContext(ThemeContext);
  const groupSize = deviceType === DeviceType.PHONE ? 2 : 3;

  useEffect(() => {
    setArticlesLoading(true);

    if (!possiblyReachedEnd) {
      Model.posts()
        .param("coauthors", id)
        .page(pageNumber)
        .param("_embed", pageNumber === 1)
        .get()
        .then((posts) => {
          setArticles([...articles, ...posts]);
          setArticlesLoading(false);
          if (pageNumber === 1) {
            const descriptions = posts.map((post) =>
              post["_embedded"].author.map((a) => a.description).reduce((p, q) => p + q)
            );
            setAuthorDetail(stringMode(descriptions));
          }
        })
        .catch((error) => {
          console.log(error);
          setPossiblyReachedEnd(true);
        });
    }

    setArticlesLoading(false);

    // FIXME: Add clean-up function.
    // Not all of the asynchronous tasks are being canceled, leading to memory leaks.
  }, [pageNumber]);

  return (
    <Layout style={styles.container}>
      <List
        data={articles}
        numColumns={groupSize}
        key={groupSize}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={1}
        onEndReached={() => {
          if (!articlesLoading) {
            setPageNumber(pageNumber + 1);
          }
        }}
        renderItem={({ item }) => (
          <Card
            key={item.id}
            onPress={() => navigation.navigate("Post", { article: item })}
            style={{ flex: 1 / groupSize }}
            header={() => <Header uri={item["jetpack_featured_media_url"]} />}
          >
            <Text category="p1">{decode(item.title.rendered)}</Text>
            <Text category="label">{formatDate(new Date(item.date), false)}</Text>
          </Card>
        )}
        ListFooterComponent={() => possiblyReachedEnd || <ActivityIndicator />}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
