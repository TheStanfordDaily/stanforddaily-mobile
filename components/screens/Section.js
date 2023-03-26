import { useTheme } from "@react-navigation/native"
import { Layout, List, Text } from "@ui-kitten/components"
import React, { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Dimensions, View } from "react-native"
import Wlidcard from "../common/Wildcard"
import Model from "../../utils/model"
import { ThemeContext } from "../../theme-context"
import { DeviceType } from "expo-device"
import { Spacing } from "../../utils/constants"

export default function Section({ route, navigation }) {
    const { category, seed, query } = route.params
    const [articlesLoading, setArticlesLoading] = useState(false)
    const [selection, setSelection] = useState(0)
    const [pageNumber, setPageNumber] = useState(seed.length === 0 ? 1 : 2)
    const themeContext = useContext(ThemeContext)
    const [articles, setArticles] = useState(seed)
    const [possiblyReachedEnd, setPossiblyReachedEnd] = useState(false)
    const perPageNumber = 16
    const basePageCount = Math.max(0, Math.floor(seed.length/perPageNumber) - 1)
    const { deviceType } = useContext(ThemeContext)
    const columnCount = deviceType === DeviceType.PHONE ? 1 : 2
    const [layoutLoaded, setLayoutLoaded] = useState(false)

    useEffect(() => {
      // use fuse.js to sort articles by relevance
      if (query) {
        console.log("Searching for " + query)
        Model.posts().search(query).orderby("relevance").perPage(perPageNumber).page(basePageCount + pageNumber).get().then(posts => {
          setArticles([...articles, ...posts])
        }).catch(error => {
          console.log(error)
          if (error.data?.status === 400) {
            setPossiblyReachedEnd(true)
          }
        })
      } else {
        Model.posts().categories(category.id).perPage(perPageNumber).page(basePageCount + pageNumber).get().then(posts => {
          setArticles([...articles, ...posts])
        }).catch(error => {
          console.log(error)
          if (error.data?.status === 400) {
            setPossiblyReachedEnd(true)
          }
        })
      }
      setLayoutLoaded(true)
      setArticlesLoading(false)
    }, [pageNumber])


    return (
      themeContext.theme === "dark" ? (
        <Layout style={{ flex: 1 }}>
            <List
                data={articles}
                style={{ backgroundColor: "transparent" }}
                numColumns={columnCount}
                key={columnCount}
                scrollEventThrottle={perPageNumber}
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
        </Layout>
      ) : (
        <View style={{ flex: 1 }}>
            <List
                data={articles}
                scrollEventThrottle={perPageNumber}
                numColumns={columnCount}
                key={columnCount}
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
        </View>
      )
    )
}