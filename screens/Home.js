import React, { useContext, useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native"
import { Divider, Layout } from "@ui-kitten/components"
import Canvas from "../components/Canvas"
import Carousel from "../components/Carousel"
import Diptych from "../components/Diptych"
import Mark from "../components/Mark"
import Shelf from "../components/Shelf"
import Wildcard from "../components/Wildcard"
import Model from "../Model"
import { Sections, Spacing } from "../constants"
import _ from "lodash"
import * as Device from "expo-device"
import { ThemeContext } from "../theme-context"

// There are too few recent opinions at time of writing.
const localOpinions = require("../opinions.json")

// There are too few recent humor articles at time of writing.
const localHumor = require("../humor.json")

export default function Home({ navigation }) {
    const [articles, setArticles] = useState({})
    const [seeds, setSeeds] = useState({})
    const [pageNumber, setPageNumber] = useState(1)
    const [articlesLoading, setArticlesLoading] = useState(false)
    const [layoutLoaded, setLayoutLoaded] = useState(false)
    const opinions = localOpinions.filter(item => !item.categories.includes(Sections.FEATURED.id))
    const humor = localHumor.filter(item => !item.categories.includes(Sections.FEATURED.id))
    const { deviceType } = useContext(ThemeContext)
    const groupSize = deviceType === Device.DeviceType.PHONE ? 1 : 2

    const homeMember = (article, section) => {
      if (section.id === Sections.FEATURED.id) {
        return article.categories.includes(Sections.FEATURED.id)
      }
    
      return article.categories.includes(section.id) && !article.categories.includes(Sections.FEATURED.id)
    }
    
    const checkBottom = (e) => {
      let paddingToBottom = 10
      paddingToBottom += e.nativeEvent.layoutMeasurement.height
      if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
        setPageNumber(pageNumber + 1)
      }
    }

    const assignPosts = (posts, appendItems) => {
      

      for (let value of Object.values(Sections)) {
const homeMembers = posts.filter(items => homeMember(items, value))
      const homeSeeds = posts.filter(items => items.categories.includes(value.id))
        setArticles(articles => ({
          ...articles,
          [value.slug]: (value.slug in articles && appendItems) ? [...articles[value.slug], ...homeMembers] : homeMembers
        }))
        
        setSeeds(articles => ({
          ...articles,
          [value.slug]: (value.slug in articles && appendItems) ? [...articles[value.slug], ...homeSeeds] : homeSeeds
        }))      
      }
      const cultureMembers = _.shuffle(posts.filter(items => items.categories.includes(Sections.THE_GRIND.id) || items.categories.includes(Sections.ARTS_LIFE.id))).slice(0, 4)



      setArticles(articles => ({
        ...articles,
        "culture": ("culture" in articles && appendItems) ? [...articles["culture"], ...cultureMembers] : cultureMembers
      }))
    }

    useEffect(() => {
      setArticlesLoading(true)
      if (pageNumber == 1) {
        // Retrieve only the posts that would be immediately visible.
        Model.posts().perPage(16).get().then(posts => {
          assignPosts(posts)
        }).catch(error => {
          console.trace(error)
        }).finally(() => {
          setLayoutLoaded(true)
        })

        Model.posts().perPage(16).page(2).get().then(posts => {
          assignPosts(posts, true)
        })
      }

      Model.posts().perPage(16).page(pageNumber + 2).get().then(posts => {
        if ("wildcard" in articles) {
          setArticles(articles => ({...articles, "wildcard": [...articles["wildcard"], ...posts]}))
        } else {
          setArticles(articles => ({...articles, "wildcard": posts}))
        }
      })
      setArticlesLoading(false)
    }, [pageNumber]) // Runs once at the beginning, and anytime pageNumber changes thereafter.

    
    return layoutLoaded && (
      <Layout style={styles.container}>
        <ScrollView onScroll={checkBottom} scrollEventThrottle={0}>
          <Carousel articles={articles[Sections.FEATURED.slug]} navigation={navigation} />
          <Mark category={Sections.NEWS} seed={seeds[Sections.NEWS.slug]} navigation={navigation} />
          <Diptych articles={articles[Sections.NEWS.slug]} navigation={navigation} />
          <Divider marginTop={Spacing.medium} />
          <Mark category={Sections.OPINIONS} seed={seeds[Sections.OPINIONS.slug]} navigation={navigation} />
          <Shelf articles={articles[Sections.OPINIONS.slug].length >= 3 ? articles[Sections.OPINIONS.slug] : opinions} navigation={navigation} />
          <Mark category={Sections.SPORTS} seed={seeds[Sections.SPORTS.slug]} navigation={navigation} />
          <Diptych articles={articles[Sections.SPORTS.slug]} navigation={navigation} />
          <Divider marginTop={Spacing.medium} />
          {_.chunk(articles.culture, groupSize)?.map((group, outerIndex) => (
            <View style={{ flex: 1/groupSize, flexDirection: "row" }}>
              {group.map((item, index) =>  <Wildcard item={item} index={outerIndex*index + index} key={item.id.toString()} navigation={navigation} />)}
            </View>
          ))}
          <Divider />
          <Mark category={Sections.HUMOR} seed={seeds[Sections.HUMOR.slug]} alternate navigation={navigation} />
          <Shelf articles={articles[Sections.HUMOR.slug].length >= 3 ? articles[Sections.HUMOR.slug] : humor} alternate navigation={navigation} />
          <Divider />
          {/* <Canvas articles={articles[Sections.CARTOONS.slug]} /> */}
          <Divider />
          {_.chunk(articles.wildcard, groupSize)?.map((group, outerIndex) => (
            <View>
              <View style={{ flex: 1/groupSize, flexDirection: "row" }}>
                {group.map((item, index) =>  <Wildcard item={item} index={index * (outerIndex + 1)} key={item.id.toString()} navigation={navigation} verbose />)}
              </View>
              {outerIndex === articles.wildcard.length - 1 && <ActivityIndicator />}
            </View>
          ))}
          <ActivityIndicator style={{ marginBottom: Spacing.medium }} />
        </ScrollView>
      </Layout>
    )
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})