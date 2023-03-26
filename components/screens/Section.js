import { useTheme } from "@react-navigation/native"
import { Layout, List, Text } from "@ui-kitten/components"
import React, { useContext, useEffect, useState } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import Wlidcard from "../common/Wildcard"
import Model from "../../utils/model"
import { ThemeContext } from "../../theme-context"
import { DeviceType } from "expo-device"
import { Spacing } from "../../utils/constants"

const BATCH_SIZE = 16

export default function Section({ route, navigation }) {
    const { category, seed, query } = route.params
    const [articlesLoading, setArticlesLoading] = useState(false)
    const [selection, setSelection] = useState(0)
    const [pageNumber, setPageNumber] = useState(seed.length === 0 ? 1 : 2)
    const [articles, setArticles] = useState(seed)
    const [possiblyReachedEnd, setPossiblyReachedEnd] = useState(false)
    const basePageCount = Math.max(0, Math.floor(seed.length/BATCH_SIZE) - 1)
    const { theme, deviceType } = useContext(ThemeContext)
    const columnCount = deviceType === DeviceType.PHONE ? 1 : 2
    const [layoutLoaded, setLayoutLoaded] = useState(false)

    const fetchResults = async () => {
      try {
        let posts
    
        if (query) {
          console.log("Searching for " + query)
          posts = await Model.posts().search(query).orderby("relevance").perPage(BATCH_SIZE).page(basePageCount + pageNumber).get()
        } else {
          posts = await Model.posts().categories(category.id).perPage(BATCH_SIZE).page(basePageCount + pageNumber).get()
        }
    
        setArticles([...articles, ...posts])
      } catch (error) {
        console.log(error)
        if (error.data?.status === 400) {
          setPossiblyReachedEnd(true)
        }
      } finally {
        setLayoutLoaded(true)
        setArticlesLoading(false)
      }
    }

    const Display = theme === "dark" ? Layout : View
    
    useEffect(() => {
      fetchResults()
    }, [pageNumber])


    return layoutLoaded && query && articles?.length === 0 ? (
      <Display style={styles.empty}>
        <Text category="h6" style={{ color: theme === "dark" ? "white" : "black" }}>No results found for {`\u2018${query}.\u2019`}</Text>
      </Display>
    ) : (
      <Display style={styles.container}>
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
                  setPageNumber(pageNumber + 1)
              }
          }}
          renderItem={({ item, index }) => (
              <Wlidcard key={item.id} item={item} index={index} navigation={navigation} verbose />
          )}
          ListFooterComponent={() => (!possiblyReachedEnd || articlesLoading) && <ActivityIndicator style={{ marginBottom: Spacing.large }} />}
        />
      </Display>
    )
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
})