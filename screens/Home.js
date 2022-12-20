import React, { useContext, useEffect, useState } from "react"
import { ActivityIndicator, LayoutAnimation, ScrollView, StyleSheet, Text, View, ImageBackground, Modal, Image, PixelRatio, Dimensions, UIManager } from "react-native"
import { Divider, Icon, Layout } from "@ui-kitten/components"
import Canvas from "../components/Canvas"
import Carousel from "../components/Carousel"
import Diptych from "../components/Diptych"
import Mark from "../components/Mark"
import Shelf from "../components/Shelf"
import Wildcard from "../components/Wildcard"
import Model from "../Model"
import { Sections, Spacing } from "../constants"
import _ from "lodash"
import { DeviceType } from "expo-device"
import { ThemeContext } from "../theme-context"
import RSVP from "rsvp"
import Collapsible from "react-native-collapsible"

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

// TODO: Use `LayoutAnimation` so that loading new cards does not seem so abrupt.

export default function Home({ navigation }) {
    const [articles, setArticles] = useState({})
    const [seeds, setSeeds] = useState({})
    const [pageNumber, setPageNumber] = useState(1)
    const [layoutLoaded, setLayoutLoaded] = useState(false)
    const { theme, deviceType } = useContext(ThemeContext)
    const groupSize = deviceType === DeviceType.PHONE ? 1 : 2
    const batchSize = 12
    
    const checkBottom = (e) => {
      let paddingToBottom = 10
      paddingToBottom += e.nativeEvent.layoutMeasurement.height
      if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
        setPageNumber(pageNumber + 1)
      }
    }

    const categorizePosts = (posts) => {
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

    useEffect(() => {
      // At first, retrieve only the posts that would be immediately visible.
      if (pageNumber == 1) {
        Model.posts().perPage(24).page(pageNumber).param("categories", `${Sections.FEATURED.id},${Sections.NEWS.id},${Sections.OPINIONS.id}`).get().then(posts => {
          setArticles(articles => ({
            ...articles,
            [Sections.FEATURED.slug]: posts.filter(item => item.categories.includes(Sections.FEATURED.id)),
            [Sections.NEWS.slug]: posts.filter(item => item.categories.includes(Sections.NEWS.id) && !item.categories.includes(Sections.FEATURED.id)),
            [Sections.OPINIONS.slug]: [...articles[Sections.OPINIONS.slug] || [], ...posts.filter(item => item.categories.includes(Sections.OPINIONS.id) && !item.categories.includes(Sections.FEATURED.id))]
          }))
        }).catch(error => {
          console.trace(error)
        }).finally(() => setLayoutLoaded(true))

        RSVP.hash({
          opinions: Model.posts().perPage(6).page(pageNumber).categories(Sections.OPINIONS.id).get(),
          sports: Model.posts().perPage(8).page(pageNumber).categories(Sections.SPORTS.id).get(),
          humor: Model.posts().perPage(6).page(pageNumber).categories(Sections.HUMOR.id).get(),
          theGrind: Model.posts().perPage(4).page(pageNumber).categories(Sections.THE_GRIND.id).get(),
          artsLife: Model.posts().perPage(4).page(pageNumber).categories(Sections.ARTS_LIFE.id).get()
        }).then(posts => {
          categorizePosts(posts)
          setArticles(articles => ({
            ...articles,
            "culture": _.shuffle(posts.theGrind.concat(posts.artsLife)).slice(0, 4)
          }))
        }).catch(error => console.trace(error))
      }

      // Load another page.
      Model.posts().perPage(batchSize).page(pageNumber + 2).get().then(posts => {
        setArticles(articles => ({
          ...articles,
          "wildcard": "wildcard" in articles ? [...articles["wildcard"], ...posts] : posts
        }))
      })
    }, [pageNumber]) // Runs once at the beginning, and anytime pageNumber changes thereafter.
    
    
    return layoutLoaded ? (
      <Layout style={styles.container}>
        <ScrollView onScroll={checkBottom} scrollEventThrottle={0}>
          <Carousel articles={articles[Sections.FEATURED.slug]} navigation={navigation} />
          <Mark category={Sections.NEWS} seed={seeds[Sections.NEWS.slug]} navigation={navigation} />
          <Diptych articles={articles[Sections.NEWS.slug]} navigation={navigation} />
          <Divider marginTop={Spacing.medium} />
          <Mark category={Sections.OPINIONS} seed={seeds[Sections.OPINIONS.slug]} navigation={navigation} />
          <Shelf articles={articles[Sections.OPINIONS.slug] || []} navigation={navigation} />

          <Mark category={Sections.SPORTS} seed={seeds[Sections.SPORTS.slug] || []} navigation={navigation} />
          <Diptych articles={articles[Sections.SPORTS.slug] || []} navigation={navigation} />
          <Divider marginTop={Spacing.medium} />
          {_.chunk(articles?.culture, groupSize)?.map((group, outerIndex) => (
            <View style={{ flex: 1/groupSize, flexDirection: "row" }}>
              {group.map((item, index) => <Wildcard item={item} index={outerIndex*index + index} key={item.id.toString()} navigation={navigation} />)}
            </View>
          ))}
          <Divider />
          <Mark category={Sections.HUMOR} seed={seeds[Sections.HUMOR.slug] || []} alternate navigation={navigation} />
          <Shelf articles={articles[Sections.HUMOR.slug] || []} alternate navigation={navigation} />
          <Divider />
          {/*  <Canvas articles={articles[Sections.CARTOONS.slug]} /> <Divider /> */}
          {_.chunk(articles?.wildcard, groupSize)?.map((group, outerIndex) => (
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