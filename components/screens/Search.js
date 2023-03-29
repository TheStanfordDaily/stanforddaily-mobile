import { useTheme } from "@react-navigation/native"
import { Icon, Input, Layout, List, Text } from "@ui-kitten/components"
import React, { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Dimensions, View, StatusBar, TouchableOpacity, StyleSheet, TextInput, Button } from "react-native"
import Wlidcard from "../common/Wildcard"
import Model from "../../utils/model"
import { ThemeContext } from "../../theme-context"
import { DeviceType } from "expo-device"
import { Spacing, Strings } from "../../utils/constants"
import Fuse from "fuse.js"
import { Keyboard } from "react-native"
import { DailyBread as bread } from "../../theme"

const BATCH_SIZE = 24
const { width, height } = Dimensions.get("window")

export default function Search({ route, navigation }) {
  const [articlesLoading, setArticlesLoading] = useState(false)
  const [articles, setArticles] = useState([])
  const { deviceType, theme } = useContext(ThemeContext)
  const columnCount = deviceType === DeviceType.PHONE ? 1 : 2
  const [possiblyReachedEnd, setPossiblyReachedEnd] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [emptyResults, setEmptyResults] = useState(false)
  const tintColor = theme === "dark" ? "white" : bread[theme]["color-primary-500"]
  const textColor = theme === "dark" ? "white" : bread[theme]["text-basic-color"]

  async function handleSearch(query, shouldClear) {
    Keyboard.dismiss()
    if (query.match(/^\s*$/)) {
      setSearchQuery("")
      return
    }
    
    setSearching(shouldClear)
    setArticlesLoading(!shouldClear)
    let posts
    try {
      posts = await Model.posts().search(query).orderby("relevance").perPage(BATCH_SIZE).page(shouldClear ? 1 : (pageNumber)).get()
      if (shouldClear) {
        setArticles(posts)
      } else {
        setArticles([...articles, ...posts])
      }
    } catch (error) {
      console.log(error)
      if (error.data?.status === 400) {
        setPossiblyReachedEnd(true)
      }
    } finally {
      if (posts.length === 0 && shouldClear) {
        setEmptyResults(true)
      }
      setSearching(false)
    }
  }

  function handleCancel() {
    setSearchQuery("")
    Keyboard.dismiss()
  }

  useEffect(() => {
    setEmptyResults(false)
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: () =>  (
        <View style={styles.searchContainer}>
                  {/*<TextInput
          style={{ width: width - 2*Spacing.extraLarge, height: 34, backgroundColor: theme === "dark" ? bread[theme]["color-primary-800"] : bread[theme]["color-primary-100"], borderRadius: 10, paddingLeft: 10, color: theme === "dark" ? "white" : bread[theme]["color-primary-500"] }}
          placeholder={Strings.search}
          placeholderTextColor={theme === "dark" ? "white" : bread[theme]["color-primary-500"]}
          onChangeText={setSearchQuery}
          onSubmitEditing={(e) => {
            setPageNumber(1)
            handleSearch(e.nativeEvent.text, true)
          }}
          returnKeyType="search"
          value={searchQuery}
          autoCorrect={false}
        />*/}
          <TextInput
            style={{ ...styles.searchInput, color: textColor }}
            onChangeText={setSearchQuery}
            value={searchQuery}
            placeholder="Search for articles or topics"
            returnKeyType="search"
            onSubmitEditing={(e) => {
              setPageNumber(1)
              handleSearch(e.nativeEvent.text, true)
            }}
            autoCorrect={false}
            autoFocus
          />
          <TouchableOpacity onPress={Keyboard.dismiss} style={styles.cancelButton} title="Cancel">
            <Text category="label" style={{ fontSize: 16, color: tintColor}}>Cancel</Text>
          </TouchableOpacity>
  </View>
      ),
      headerTintColor: tintColor
    })
  }, [searchQuery])
    
    
  return emptyResults ? (
    <Layout style={styles.empty}>
      <Text category="h6" style={{ color: theme === "dark" ? "white" : "black" }}>No results found for {`\u2018${searchQuery}.\u2019`}</Text>
    </Layout>
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
        onEndReachedThreshold={0.25}
        onEndReached={() => {
          if (possiblyReachedEnd && articlesLoading) {
            setPageNumber(pageNumber + 1)
            handleSearch(searchQuery)

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
          handleSearch(tag.name)
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.medium,
    paddingRight: Spacing.large,
    width: width - Spacing.extraLarge,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 5,
    paddingHorizontal: Spacing.medium,
    paddingVertical: 5,
    marginRight: Spacing.medium
  },
  cancelButton: {
    paddingHorizontal: Spacing.medium,
  }
})