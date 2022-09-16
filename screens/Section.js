import { useTheme } from "@react-navigation/native"
import { Button, Icon, Input, Layout, List, Text } from "@ui-kitten/components"
import React, { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Dimensions, View, StatusBar } from "react-native"
import Wlidcard from "../components/Wildcard"
import Model from "../Model"
import { ThemeContext } from "../theme-context"
import * as Device from "expo-device"
import { Spacing } from "../constants"

const { width, height } = Dimensions.get("window")

export default function Section({ route, navigation }) {
    const { category, seed, search } = route.params
    const [articlesLoading, setArticlesLoading] = useState(false)
    const [selection, setSelection] = useState(0)
    const [pageNumber, setPageNumber] = useState(seed.length === 0 ? 1 : 2)
    const themeContext = useContext(ThemeContext)
    const [articles, setArticles] = useState(seed)
    const [possiblyReachedEnd, setPossiblyReachedEnd] = useState(false)
    const perPageNumber = 16
    const basePageCount = Math.max(0, Math.floor(seed.length/perPageNumber) - 1)
    const { deviceType, toggleTheme, theme } = useContext(ThemeContext)
    const columnCount = deviceType === Device.DeviceType.PHONE ? 1 : 2
    const [layoutLoaded, setLayoutLoaded] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [tags, setTags] = useState([])

    const performSearch = () => {
      Model.posts().search(searchText).then((posts) => {
        setArticles(posts)
      })
    }

    if (search) {
      navigation.setOptions({
        headerBackTitleVisible: false,
        headerTitle: () =>  (
          
          <Input
            value={searchText}
            onSubmitEditing={() => {
              performSearch()
            }}
            placeholder='Search'
            // accessoryRight={ <Icon height={20} width={20} name='close-circle' fill={"grey here"} />}
            // secureTextEntry={secureTextEntry}
            onChangeText={setSearchText}
            style={{ marginBottom: Spacing.medium, width: width - 2*Spacing.extraLarge }}
          />
)
        
      })
      Model.tags().order("desc").orderby("count").get().then((tags) => setTags(tags))
    }

    useEffect(() => {

      if (!search) {
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


    return articles?.length > 0 ? (
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
                ListFooterComponent={() => (!possiblyReachedEnd || articlesLoading) && <ActivityIndicator />}
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
                ListFooterComponent={() => (!possiblyReachedEnd || articlesLoading) && <ActivityIndicator />}
            />
        </View>
      )
    ) : <Layout style={{ alignItems: "center", justifyContent: "space-evenly", flex: 1, paddingVertical: Spacing.extraLarge }}>
      {tags.map((tag, index) => <Button key={index} appearance='ghost' status='primary' onPress={() => {
        setSearchText(tag.name)
        performSearch()
        }}>{tag.name.toUpperCase()}</Button>)}
    </Layout>
}
