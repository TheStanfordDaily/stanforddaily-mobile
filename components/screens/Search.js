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
    const perPageNumber = 50
    const [searchText, setSearchText] = useState("")
    const [searching, setSearching] = useState(false)
    const [tags, setTags] = useState([])
    const [pageNumber, setPageNumber] = useState(1)

    const performSearch = (query) => {
      setSearchText(query)
      Keyboard.dismiss()
      setSearching(true)
      //.posts().search(query).orderby("relevance").perPage(BATCH_SIZE).page(basePageCount + pageNumber).get()
      Model.posts().search(query).orderby("relevance").perPage(perPageNumber).get().then((posts) => {
        setArticles(posts)
        // const fuse = new Fuse(posts, { includeScore: true, findAllMatches: true, keys: ["content.rendered"] })
        // console.log(fuse.search("dragon"))
      }).finally(() => {
        
        setSearching(false)
      })
    }

    useEffect(() => {
      navigation.setOptions({
        headerBackTitleVisible: false,
        headerTitle: () =>  (
          <TextInput
            style={{ width: width - 2*Spacing.extraLarge, height: 40, backgroundColor: theme === "dark" ? bread[theme]["color-primary-800"] : bread[theme]["color-primary-100"], borderRadius: 10, paddingLeft: 10, color: theme === "dark" ? "white" : bread[theme]["color-primary-500"] }}
            placeholder="Search"
            placeholderTextColor={theme === "dark" ? "white" : bread[theme]["color-primary-500"]}
            onChangeText={setSearchText}
            value={searchText}
            onSubmitEditing={() => {
              performSearch(searchText)
            }}
          />

        ),
        headerTintColor: theme === "dark" ? "white" : bread[theme]["color-primary-500"],
    })}, [])
    
    
    return  (
        <Layout style={styles.container}>
          {articles.length === 0 && route.params?.tags?.map((tag, index) => (
          <TouchableOpacity key={index} onPress={() => {
            performSearch(tag.name)
          }}>
            <Text category="label">{tag.name.toUpperCase()}</Text>
          </TouchableOpacity>
          ))}
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
              ListFooterComponent={() => (!possiblyReachedEnd || articlesLoading) && <ActivityIndicator style={{ marginBottom: Spacing.extraLarge }} />}
          />
        </Layout>
    ) 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topics: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flex: 1
  }
})