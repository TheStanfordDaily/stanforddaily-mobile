import { Layout, List } from "@ui-kitten/components";
import React, { useContext, useEffect, useState } from "react";
import { View, Button, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import Wlidcard from "../components/Wildcard";
import { Margins } from "../constants";
import { getCategoryPageAsync } from "../helpers/wpapi";
import Model from "../Model"
import { Tab, TabView, Text } from "@ui-kitten/components";
import { ThemeContext } from "../theme-context";

export default function Section({ route, navigation }) {
    const { category, seed } = route.params
    const [articlesLoading, setArticlesLoading] = useState(true)
    const [selection, setSelection] = useState(0)
    const [pageNumber, setPageNumber] = useState(seed.length == 0 ? 1 : 2)
    const themeContext = useContext(ThemeContext)
    useEffect(() => {
      setArticlesLoading(true)
      Model.posts().categories(category.id).perPage(seed.length >= 10 ? seed.length : seed.length + 10).page(pageNumber).get().then(posts => setArticles([...articles, ...posts]))
      setArticlesLoading(false)
    }, [pageNumber])

    const [articles, setArticles] = useState(seed)

    return (
      themeContext.theme === "dark" ? (
        <Layout>
        <ScrollView onScroll={(e) => {
          let paddingToBottom = 10;
          paddingToBottom += e.nativeEvent.layoutMeasurement.height;
          if(e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
            setPageNumber(pageNumber + 1)
          }
        }}>
          <Wlidcard articles={articles} navigation={navigation} verbose />
          <ActivityIndicator hidesWhenStopped isLoading={articlesLoading} />
        </ScrollView>
      </Layout>
      ) : (
      <View>
        <ScrollView onScroll={(e) => {
          let paddingToBottom = 10;
          paddingToBottom += e.nativeEvent.layoutMeasurement.height;
          if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
            setPageNumber(pageNumber + 1)
          }
        }}>
          <Wlidcard articles={articles} navigation={navigation} verbose />
          <ActivityIndicator hidesWhenStopped isLoading={articlesLoading} />
        </ScrollView>
      </View>
      )
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})