import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View } from "react-native";
import { Card, Divider, Layout, List, Text } from "@ui-kitten/components";
import Canvas from "../components/Canvas";
import Carousel from "../components/Carousel";
import Diptych from "../components/Diptych";
import Mark from "../components/Mark";
import Shelf from "../components/Shelf";
import Wildcard from "../components/Wildcard";
import Model from "../Model";
import { Sections, Spacing } from "../constants";
import _ from "lodash";
import { decode } from "html-entities";
import { formatDate } from "../helpers/format";

// There are too few recent opinions at time of writing.
const staticOpinions = require("../opinions.json");

export default function Home({ navigation }) {
    const [articles, setArticles] = useState({})
    const [seeds, setSeeds] = useState({})
    const [pageNumber, setPageNumber] = useState(1)
    const [articlesLoading, setArticlesLoading] = useState(false)
    const [articlesLoaded, setArticlesLoaded] = useState(false)
    const opinions = staticOpinions.filter(item => !item.categories.includes(Sections.FEATURED.id));

    const homeMember = (article, section) => {
      if (section.id === Sections.FEATURED.id) {
        return article.categories.includes(Sections.FEATURED.id)
      }
    
      return article.categories.includes(section.id) && !article.categories.includes(Sections.FEATURED.id)
    }

    const checkBottom = (e) => {
      let paddingToBottom = 10;
      paddingToBottom += e.nativeEvent.layoutMeasurement.height
      if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
        setPageNumber(pageNumber + 1)
      }
    }
    
    const Header = () => {

 
      return (
      <Layout>
          <Carousel articles={articles[Sections.FEATURED.slug]} navigation={navigation} />
          <Mark category={Sections.NEWS} seed={seeds[Sections.NEWS.slug]} navigation={navigation} />
          <Diptych articles={articles[Sections.NEWS.slug]} navigation={navigation} />
          <Divider marginTop={Spacing.medium} />
          {articles[Sections.OPINIONS.slug].length >= 3 && (
            <React.Fragment>
              <Mark category={Sections.OPINIONS} seed={seeds[Sections.OPINIONS.slug]} navigation={navigation} />
              <Shelf articles={articles[Sections.OPINIONS.slug]} navigation={navigation} />
            </React.Fragment>
          )}
          <Mark category={Sections.SPORTS} seed={seeds[Sections.SPORTS.slug]} navigation={navigation} />
          <Diptych articles={articles[Sections.SPORTS.slug]} navigation={navigation} />
          <Divider marginTop={Spacing.medium} />
          {articles["culture"].map((item, index) => <Wildcard item={item} index={index} navigation={navigation} />)}
          <Divider />
          {articles[Sections.HUMOR.slug].length >= 3 && (
            <React.Fragment>
              <Mark category={Sections.HUMOR} seed={seeds[Sections.HUMOR.slug]} alternate navigation={navigation} />
              <Shelf articles={articles[Sections.HUMOR.slug]} alternate navigation={navigation} />
              <Divider />
            </React.Fragment>
          )}
          <Canvas articles={articles[Sections.CARTOONS.slug]} />
          {articles["wildcards"]?.length > 0 && <Divider />}
      </Layout>)
}

    useEffect(() => {

      if (pageNumber == 1) {
        Model.posts().perPage(48).get().then(posts => {
          for (let value of Object.values(Sections)) {
            setArticles(articles => ({
              ...articles,
              [value.slug]: posts.filter(items => homeMember(items, value))
            }))
            
            setSeeds(articles => ({
              ...articles,
              [value.slug]: posts.filter(items => items.categories.includes(value.id))
            }))
          }
          setArticles(articles => ({
            ...articles,
            "culture": _.shuffle(posts.filter(items => items.categories.includes(Sections.THE_GRIND.id) || items.categories.includes(Sections.ARTS_LIFE.id))).slice(0, 4),
          }))
        }).finally(() => setArticlesLoaded(true))
      }

        console.log("retree wildcards")
        Model.posts().perPage(16).page(pageNumber + 3).get().then(posts => {
          if ("wildcards" in articles) {
        setArticles(articles => ({...articles, "wildcards": [...articles["wildcards"], ...posts]}))
          } else {
            setArticles(articles => ({...articles, "wildcards": posts}))
          }
      })

    }, [pageNumber]) // Runs once at the beginning, and anytime pageNumber changes thereafter.

    return articlesLoaded && (
      <Layout style={styles.container}>
              <List
        keyExtractor={item => item.id}
        onEndReached={() => setPageNumber(pageNumber + 1)}
        ListHeaderComponent={Header}
        ListFooterComponent={<ActivityIndicator />}
        onEndReachedThreshold={1}
        style={{ flex: 1 }}
        data={articles["wildcards"]}
        renderItem={({item, index}) => (<Wildcard item={item} index={index} navigation={navigation} verbose />)}
      />
      </Layout>


    )
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})