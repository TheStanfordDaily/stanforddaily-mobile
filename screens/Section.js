import { List } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Wlidcard from "../components/Wildcard";
import { Margins } from "../constants";
import { getCategoryPageAsync } from "../helpers/wpapi";
import Model from "../Model"
import { Layout } from "@ui-kitten/components";

export default function Section({ route, navigation }) {
    const { category, seed } = route.params
    const [articlesLoading, setArticlesLoading] = useState(true)
    // const [articles, setArticles] = useState(seed)
    const [pageNumber, setPageNumber] = useState(0)
    useEffect(() => {
      // Model.posts().categories(category.id).perPage(20).get().then(posts => console.log(posts))
    }, [pageNumber])
  
    /*const fetchNextPage = () => {
      setIsLoading(true)
      getCategoryPageAsync(id, page + 1).then(result => {
        setArticles(articles => [...articles, ...result])
        setPage(page + 1)
      })
      setArticlesLoading(false)
    }*/

    // const [articles, setArticles] = useState(seed)

    return (
      <Layout style={styles.container}>
        <ScrollView>
          <Wlidcard articles={seed} navigation={navigation} />
        </ScrollView>
        {/* <List onEndReached={() => console.log("Time to load next page.")} /> */}
      </Layout>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})