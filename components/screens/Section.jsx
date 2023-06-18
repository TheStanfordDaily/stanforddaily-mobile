import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Layout, List } from "@ui-kitten/components";

import Wlidcard from "../common/Wildcard";
import Model from "../../utils/model";
import { ThemeContext } from "../../theme-context";
import { DeviceType } from "expo-device";
import { Spacing } from "../../utils/constants";

const BATCH_SIZE = 16;

export default function Section({ route, navigation }) {
  const { category, seed } = route.params;
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [selection, setSelection] = useState(0);
  const [pageNumber, setPageNumber] = useState(seed.length === 0 ? 1 : 2);
  const [articles, setArticles] = useState(seed);
  const [possiblyReachedEnd, setPossiblyReachedEnd] = useState(false);
  const basePageCount = Math.max(0, Math.floor(seed.length/BATCH_SIZE) - 1);
  const { theme, deviceType } = useContext(ThemeContext);
  const columnCount = deviceType === DeviceType.PHONE ? 1 : 2;
  const [layoutLoaded, setLayoutLoaded] = useState(false);

  const fetchResults = async () => {
    setArticlesLoading(true);
    try {
      const posts = await Model.posts().categories(category.id).perPage(BATCH_SIZE).page(basePageCount + pageNumber).get();
      setArticles([...articles, ...posts]);
    } catch (error) {
      console.log(error);
      if (error.data?.status === 400) {
        setPossiblyReachedEnd(true);
      }
    } finally {
      setLayoutLoaded(true);
      setArticlesLoading(false);
    }
  };

  const Container = theme === "dark" ? Layout : View;
    
  useEffect(() => {
    fetchResults();
  }, [pageNumber]);


  return (
    <Container style={styles.container}>
      <List
        data={articles}
        style={{ backgroundColor: "transparent" }}
        numColumns={columnCount}
        key={columnCount}
        scrollEventThrottle={BATCH_SIZE}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={1}
        onEndReached={() => {
          if (!articlesLoading) {
            setPageNumber(pageNumber + 1);
          }
        }}
        renderItem={({ item, index }) => (
          <Wlidcard key={item.id} item={item} index={index} navigation={navigation} verbose />
        )}
        ListFooterComponent={() => (!possiblyReachedEnd || articlesLoading) && <ActivityIndicator style={{ marginBottom: Spacing.large }} />}
      />
    </Container>
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