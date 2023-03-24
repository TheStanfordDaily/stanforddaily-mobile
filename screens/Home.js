import React, { useCallback, useContext, useEffect, useState } from "react"
import { ActivityIndicator, LayoutAnimation, ScrollView, StyleSheet, View, ImageBackground, Text, Modal, Image, PixelRatio, Platform, Dimensions, UIManager } from "react-native"
import { Divider, Icon, Layout, Input } from "@ui-kitten/components"
import Canvas from "../components/Canvas"
import Carousel from "../components/Carousel"
import Diptych from "../components/Diptych"
import Mark from "../components/Mark"
import Shelf from "../components/Shelf"
import Wildcard from "../components/Wildcard"
import Model, { useWordPress } from "../Model"
import { Sections, Spacing } from "../constants"
import _ from "lodash"
import { DeviceType } from "expo-device"
import { ThemeContext } from "../theme-context"
import RSVP from "rsvp"
import Collapsible from "react-native-collapsible"
import SearchBar from "../components/SearchBar"
import { withoutDuplicates } from "../helpers/format"

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

// TODO: Use `LayoutAnimation` so that loading new cards does not seem so abrupt.

export default function Home({ navigation, route }) {
    const [pageNumber, setPageNumber] = useState(1)
    const { data, error, loading } = useWordPress(pageNumber)
    const [articles, setArticles] = useState(data)
    const { theme, deviceType } = useContext(ThemeContext)
    const groupSize = deviceType === DeviceType.PHONE ? 1 : 2
    const batchSize = 12
    
    function peekBelow(e) {
      let paddingToBottom = 10
      paddingToBottom += e.nativeEvent.layoutMeasurement.height
      if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
        setPageNumber(pageNumber + 1)
      }
    }

    function collatePosts(posts) {
      const featuredPosts = posts.filter(item => item.categories.includes(Sections.FEATURED.id))
      for (let value of Sections) {
        setArticles(articles => ({
          ...articles,
          [value.slug]: value.slug === Sections.FEATURED.slug ? featuredPosts : posts.filter(item => item.categories.includes(value.id) && !item.categories.includes(Sections.FEATURED.id))
        }))
        setSeeds(articles => ({
          ...articles,
          [value.slug]: posts.filter(item => item.categories.includes(value.id))
        }))
      }
    }

    function categorizePosts(posts) {
      for (let key in posts) {
        setArticles(articles => ({
          ...articles,
          [key]: posts[key].filter(item => !item.categories.includes(Sections.FEATURED.id) || key === Sections.FEATURED.slug)
        }))
        setSeeds(articles => ({
          ...articles,
          [key]: posts[key]
        }))
      }
    }

    function fetchWildcardPosts() {
      Model.posts().perPage(batchSize).page(pageNumber + 2).get().then(posts => {
        setArticles(articles => ({
          ...articles,
          "wildcard": "wildcard" in articles ? [...articles["wildcard"], ...posts] : posts
        }))
      })
    }

    // const examplePosts = useWordPress(pageNumber, batchSize)
    // console.log(examplePosts)
    // const fetchedCategories = useWordPress(1)
    
    
    return data ? (
      <Layout style={styles.container}>
        <ScrollView onScroll={peekBelow} scrollEventThrottle={0} stickyHeaderIndices={route.params?.isSearching ? [0] : undefined}>
          {route.params?.isSearching && <SearchBar navigation={navigation} />}
          <Carousel articles={data[Sections.FEATURED.slug] ?? []} navigation={navigation} />
          <Mark category={Sections.NEWS} seed={data[Sections.NEWS.slug] ?? []} navigation={navigation} />
          <Diptych articles={withoutDuplicates(data[Sections.NEWS.slug]) ?? []} navigation={navigation} />
          <Divider marginTop={Spacing.medium} />
          <Mark category={Sections.OPINIONS} seed={data[Sections.OPINIONS.slug]} navigation={navigation} />
          <Shelf articles={data[Sections.OPINIONS.slug] ?? []} navigation={navigation} />

          <Mark category={Sections.SPORTS} seed={data[Sections.SPORTS.slug] ?? []} navigation={navigation} />
          <Diptych articles={data[Sections.SPORTS.slug] ?? []} navigation={navigation} />
          <Divider marginTop={Spacing.medium} />
          {_.chunk(articles?.culture, groupSize)?.map((group, outerIndex) => (
            <View style={{ flex: 1/groupSize, flexDirection: "row" }}>
              {group.map((item, index) => <Wildcard item={item} index={outerIndex*index + index} key={item.id.toString()} navigation={navigation} />)}
            </View>
          ))}
          <Divider />
          <Mark category={Sections.HUMOR} seed={data[Sections.HUMOR.slug] ?? []} alternate navigation={navigation} />
          <Shelf articles={data[Sections.HUMOR.slug] ?? []} alternate navigation={navigation} />
          <Divider />
          {/*  <Canvas articles={articles[Sections.CARTOONS.slug]} /> <Divider /> */}
          {_.chunk(data?.wildcard, groupSize)?.map((group, outerIndex) => (
            <View key={outerIndex}>
              <View style={{ flex: 1/groupSize, flexDirection: "row" }}>
                {group.map((item, index) => <Wildcard item={item} index={outerIndex*index + index} key={item.id.toString()} navigation={navigation} verbose />)}
              </View>
              {outerIndex === articles?.wildcard?.length - 1 && <ActivityIndicator style={{ marginBottom: Spacing.large }} />}
            </View>
          ))}
        </ScrollView>
      </Layout>
    ) : (
      <Layout style={styles.loading}>
        <ActivityIndicator />
      </Layout>
    )
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})