import { useTheme } from "@react-navigation/native"
import { Icon, Input, Layout, List, Text } from "@ui-kitten/components"
import React, { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Dimensions, View, StatusBar, TouchableOpacity, StyleSheet, TextInput } from "react-native"
import Wlidcard from "../common/Wildcard"
import Model from "../../utils/model"
import { ThemeContext } from "../../theme-context"
import { DeviceType } from "expo-device"
import { Spacing } from "../../utils/constants"
import Fuse from "fuse.js"
import SearchBar from "../common/SearchBar"
import { Keyboard } from "react-native"
import { DailyBread as bread } from "../../theme"

const { width, height } = Dimensions.get("window")

export default function Search({ route, navigation }) {
    const [articlesLoading, setArticlesLoading] = useState(false)
    const [articles, setArticles] = useState([])
    const { deviceType, toggleTheme, theme } = useContext(ThemeContext)
    const columnCount = deviceType === DeviceType.PHONE ? 1 : 2
    const [possiblyReachedEnd, setPossiblyReachedEnd] = useState(false)
    const BATCH_SIZE = 24
    const [searchQuery, setSearchQuery] = useState("")
    const [searching, setSearching] = useState(false)
    const [tags, setTags] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [tagQuery, setTagQuery] = useState("")
    const [emptyResults, setEmptyResults] = useState(false)

    async function performSearch(query, clear) {
      
      Keyboard.dismiss()
      setSearching(true)
      //.posts().search(query).orderby("relevance").perPage(BATCH_SIZE).page(basePageCount + pageNumber).get()
      let posts
      try {
        posts = await Model.posts().search(query).orderby("relevance").perPage(BATCH_SIZE).page(pageNumber).get()
        if (clear) {setArticles(posts)} else {setArticles([...articles, ...posts])}
      } catch (error) {
        console.log(error)
        if (error.data?.status === 400) {
          setPossiblyReachedEnd(true)
        }
      } finally {
        if (articles.length === 0 && posts.length === 0) {
          setEmptyResults(true)
        }
        setSearching(false)
      }
    }

    useEffect(() => {
      setEmptyResults(false)
      navigation.setOptions({
        headerBackTitleVisible: false,
        headerTitle: () =>  (
          <TextInput
            style={{ width: width - 2*Spacing.extraLarge, height: 34, backgroundColor: theme === "dark" ? bread[theme]["color-primary-800"] : bread[theme]["color-primary-100"], borderRadius: 10, paddingLeft: 10, color: theme === "dark" ? "white" : bread[theme]["color-primary-500"] }}
            placeholder="Search"
            placeholderTextColor={theme === "dark" ? "white" : bread[theme]["color-primary-500"]}
            onChangeText={setSearchQuery}
            onSubmitEditing={(e) => {
              setPageNumber(1)
              performSearch(e.nativeEvent.text, true)
            }}
            returnKeyType="search"
            value={searchQuery}
          />
        ),
        headerTintColor: theme === "dark" ? "white" : bread[theme]["color-primary-500"]
    })}, [searchQuery])
    
    
    return emptyResults ? (
      <Text category="h6" style={{ color: theme === "dark" ? "white" : "black" }}>No results found for {`\u2018${searchQuery}.\u2019`}</Text>
    ) : searching ? (
      <Layout style={styles.empty}>
        <ActivityIndicator />
      </Layout>
    ) : articles.length > 0 ? (
        <Layout style={styles.container}>
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
              ListFooterComponent={() => (!possiblyReachedEnd || articlesLoading) && <ActivityIndicator style={{ marginBottom: Spacing.extraLarge }} />}
          />
        </Layout>
        ) : (
          <Layout style={styles.empty}>
            {articles.length === 0 && route.params?.tags?.map((tag, index) => (
          <TouchableOpacity key={index} onPress={() => {
            setSearchQuery(tag.name)
            performSearch(tag.name)
          }}>
            <Text category="label">{tag.name.toUpperCase()}</Text>
          </TouchableOpacity>
          ))}
          </Layout>
        )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flex: 1,
    paddingBottom: Spacing.large
  }
})