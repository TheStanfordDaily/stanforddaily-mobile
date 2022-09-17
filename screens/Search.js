import { useTheme } from "@react-navigation/native"
import { Icon, Input, Layout, List, Text } from "@ui-kitten/components"
import React, { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Dimensions, View, StatusBar, TouchableOpacity } from "react-native"
import Wlidcard from "../components/Wildcard"
import Model from "../Model"
import { ThemeContext } from "../theme-context"
import { DeviceType } from "expo-device"
import { Spacing } from "../constants"
import Fuse from "fuse.js"

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

    const performSearch = () => {
      Model.posts().perPage(perPageNumber).search(searchText).get().then((posts) => {
        setArticles(posts)
        // const fuse = new Fuse(posts, { includeScore: true, findAllMatches: true, keys: ["content.rendered"] })
        // console.log(fuse.search("dragon"))
      }).finally(() => {
        
        setSearching(false)
      })
    }

    navigation.setOptions({
        headerBackTitleVisible: false,
        headerTitle: () =>  (
          <Input
            value={searchText}
            onSubmitEditing={performSearch}
            placeholder="Search"
            // accessoryRight={ <Icon height={20} width={20} name='close-circle' fill={"grey here"} />}
            onChangeText={setSearchText}
            style={{ marginBottom: Spacing.medium, width: width - 2*Spacing.extraLarge }}
          />
        )
    })
    
    Model.tags().order("desc").orderby("count").get().then((tags) => setTags(tags))
    
    return articles.length === 0 || searching ? (
        <Layout style={{ alignItems: "center", justifyContent: "space-evenly", flex: 1, paddingVertical: Spacing.extraLarge }}>
          {tags.map((tag, index) => (
          <TouchableOpacity key={index} onPress={() => {
            setSearchText(tag.name)
            setSearching(true)
            performSearch()
          }}>
            {tag.name.toUpperCase()}
          </TouchableOpacity>
          ))}
        </Layout>
    ) : (
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
              ListFooterComponent={() => (!possiblyReachedEnd || articlesLoading) && <ActivityIndicator />}
          />
        </Layout>
    )
}