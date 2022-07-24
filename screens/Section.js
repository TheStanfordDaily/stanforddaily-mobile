import { List } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Wlidcard from "../components/Wildcard";
import { Margins } from "../constants";
import { getCategoryPageAsync } from "../helpers/wpapi";
import Model from "../Model"
import { Tab, TabView } from "@ui-kitten/components";

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

    const [articles, setArticles] = useState(seed)

    return (category.desks ?
      <TabView selectedIndex={selection} onSelect={index => setSelection(index)}>
        <Tab title={category.name + "desk 1"}>
            <ScrollView>
              <Wlidcard articles={seed} navigation={navigation} verbose />
              {/* Going to use that verbose value and when true (as it is here), we'll display the date and a little bit more information. */}
            </ScrollView>
        </Tab>
        <Tab title="Two">
          <Text category="h3">Two</Text>
        </Tab>
        <Tab title="Three">
          <Text category="h3">Three</Text>
        </Tab>
      </TabView> :
      <View>
        <Text>fdsiudhui</Text>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})