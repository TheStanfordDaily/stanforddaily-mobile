import { List } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { Margins } from "../constants";
import { getCategoryPageAsync } from "../helpers/wpapi";
import Model from "../Model"

export default function Section({ navigation }) {
    const [articlesLoading, setArticlesLoading] = useState(true)
    // const [articles, setArticles] = useState(seed)
    const [pageNumber, setPageNumber] = useState(0)
    useEffect(() => {
      // Model.posts().categories(category.id).perPage(20).get().then(posts => console.log(posts))
    }, [pageNumber])
  
    const fetchNextPage = () => {
      setIsLoading(true)
      getCategoryPageAsync(id, page + 1).then(result => {
        setArticles(articles => [...articles, ...result])
        setPage(page + 1)
      })
      setArticlesLoading(false)
    }

    return (
      <View style={styles.container}>
        <List onEndReached={() => console.log("Time to load next page.")} />
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
})