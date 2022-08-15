import { useTheme } from "@react-navigation/native";
import { Layout } from "@ui-kitten/components";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ScrollView, StatusBar } from "react-native";
import Wlidcard from "../components/Wildcard";
import Model from "../Model"
import { ThemeContext } from "../theme-context";

export default function Section({ route, navigation }) {
    const { category, seed } = route.params
    const [articlesLoading, setArticlesLoading] = useState(false)
    const [selection, setSelection] = useState(0)
    const [pageNumber, setPageNumber] = useState(seed.length === 0 ? 1 : 2)
    const themeContext = useContext(ThemeContext)
    const [articles, setArticles] = useState(seed)

    const checkBottom = (e) => {
        let paddingToBottom = 10;
        paddingToBottom += e.nativeEvent.layoutMeasurement.height
        if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom && !articlesLoading) {
          setArticlesLoading(true)
          setPageNumber(pageNumber + 1)
        }
    }

    useEffect(() => {
      Model.posts().categories(category.id).perPage(seed.length >= 10 ? seed.length : seed.length + 10).page(pageNumber).get().then(posts => {
        setArticles([...articles, ...posts])
      }).catch(error => {
        console.log(error)
      })
      setArticlesLoading(false)
    }, [pageNumber])


    return (
      themeContext.theme === "dark" ? (
      <Layout>
        <ScrollView scrollEventThrottle={160} onScroll={checkBottom}>
          <Wlidcard articles={articles} navigation={navigation} title={category.name} verbose />
          <ActivityIndicator />
        </ScrollView>
      </Layout>
      ) : (
      <View>
        <ScrollView scrollEventThrottle={160} onScroll={checkBottom}>
          <Wlidcard articles={articles} navigation={navigation} title={category.name} verbose />
          <ActivityIndicator />
        </ScrollView>
      </View>
      )
    )
}
