import { useTheme } from "@react-navigation/native";
import { Layout, List, Text } from "@ui-kitten/components";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { deviceType } from "../App";
import Wlidcard from "../components/Wildcard";
import Model from "../Model"
import { ThemeContext } from "../theme-context";
import * as Device from "expo-device"

export default function Section({ route, navigation }) {
    const { category, seed } = route.params
    const [articlesLoading, setArticlesLoading] = useState(false)
    const [selection, setSelection] = useState(0)
    const [pageNumber, setPageNumber] = useState(seed.length === 0 ? 1 : 2)
    const themeContext = useContext(ThemeContext)
    const [articles, setArticles] = useState(seed)
    const [possiblyReachedEnd, setPossiblyReachedEnd] = useState(false)
    const perPageNumber = 16
    const basePageCount = Math.max(0, Math.floor(seed.length/perPageNumber) - 1)
    const columnCount = deviceType() === Device.DeviceType.PHONE ? 1 : 2
    const [layoutLoaded, setLayoutLoaded] = useState(false)

    useEffect(() => {
      Model.posts().categories(category.id).perPage(perPageNumber).page(basePageCount + pageNumber).get().then(posts => {
        setArticles([...articles, ...posts])
      }).catch(error => {
        console.log(error)
        if (error.data?.status === 400) {
          setPossiblyReachedEnd(true)
        }
      })
      setLayoutLoaded(true)
      setArticlesLoading(false)
    }, [pageNumber])


    return (
      themeContext.theme === "dark" ? (
        <Layout>
            <List
                data={articles}
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
                ListFooterComponent={() => (!possiblyReachedEnd || articlesLoading) && <ActivityIndicator />}
            />
        </Layout>
      ) : (
        <View>
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
                ListFooterComponent={() => (!possiblyReachedEnd || articlesLoading) && <ActivityIndicator />}
            />
        </View>
      )
    )
}
