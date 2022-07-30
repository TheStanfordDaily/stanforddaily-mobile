import { List } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View, Button, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Wlidcard from "../components/Wildcard";
import { Margins } from "../constants";
import { getCategoryPageAsync } from "../helpers/wpapi";
import Model from "../Model"
import { Tab, TabView, Text } from "@ui-kitten/components";

export default function Section({ route, navigation }) {
    const { category, seed } = route.params
    const [articlesLoading, setArticlesLoading] = useState(true)
    // const [articles, setArticles] = useState(seed)
    const [selection, setSelection] = useState(0)
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

    var sortedArticles = {}
    if (category.desks) {
      Object.values(category.desks).forEach(desk => {
        sortedArticles[desk.name] = seed.filter(article => article.categories.includes(desk.id))
      })
    }
    console.log(sortedArticles)

    const [articles, setArticles] = useState(seed)

    return (category.desks ?
      <TabView selectedIndex={selection} onSelect={index => setSelection(index)}>
        <Tab title="All">
        <ScrollView>
              <Wlidcard articles={seed} navigation={navigation} verbose />
            </ScrollView>
        </Tab>
        {Object.values(category.desks).map(desk => (
          <Tab title={desk.name}>
            <ScrollView>
              <Wlidcard articles={sortedArticles[desk.name]} navigation={navigation} verbose />
            </ScrollView>
          </Tab>
        ))}
      </TabView> :
      <View>
        <ScrollView>
          <Wlidcard articles={seed} navigation={navigation} verbose />
        </ScrollView>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})