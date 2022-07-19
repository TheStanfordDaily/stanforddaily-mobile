import React, { useEffect, useReducer, useState } from "react";
import { View, ScrollView, Dimensions, StyleSheet, Image, FlatList } from "react-native";
import { Sections } from "../constants";
import { getHomeAsync, getCategoryAsync, getHomeMoreAsync } from "../helpers/wpapi";
import LightboxGallery from "../components/LightboxGallery";
import { getThumbnailURL, formatDate } from "../helpers/format";
import { Card, Divider, Layout, List, ListItem, Text } from "@ui-kitten/components";
import moment from "moment";
import Duet from "../components/Duet";
import Mark from "../components/Mark";
import Culture from "../components/Culture";
import Shelf from "../components/Shelf"; // Could probably have an index file with all the sections and import all of them on one line.
import Featured from "../components/Featured";
import Model from "../Model";

const dummyData = require("../dummy.json")

const thumbnailImage = (details) => {
  console.log(details.sizes.thumbnail)
}

const homeMember = (article, section) => {
  if (section.id === Sections.FEATURED.id) {
    return article.categories.includes(Sections.FEATURED.id)
  }
  return article.categories.includes(section.id) && !article.categories.includes(Sections.FEATURED.id)
}

function reducer(prev, curr) {
  return { ...prev, [curr.slug]: curr }
}

export default function Home({ navigation }) {
    const [articles, setArticles] = useState({}) // or just append to articles like before or useReducer
    const [pageNumber, setPageNumber] = useState(0)
    useEffect(() => {
      Model.posts().perPage(100).get().then(posts => {
        /*for (let key of Object.keys(Sections)) {
          setArticles(...articles, ...{key: posts})
          console.log("new articles", articles)
          //console.log(key, {...articles, ...{"news": posts}})
          //setArticles({...articles, ...{"news": posts}})
        }*/
        //dispatchArticles({"news": posts})
        //dispatchArticles({"opinions": posts})
        for (let value of Object.values(Sections)) {
          setArticles(articles => ({
            ...articles,
            [value.slug]: posts.filter(items => homeMember(items, value))
          }))
        }
        
        
        console.log("new articles", articles["sports"])
        // console.log(Sections.SPORTS)
      })
    }, [pageNumber]) // Runs once at the beginning, and anytime pageNumber changes thereafter.

    return (
      <Layout style={styles.container}>
        <ScrollView>
          {/* <Featured articles={articles.filter(article => article.categories.includes(Sections.FEATURED.id))}/> */}
          <Mark category={Sections.NEWS} navigation={navigation}/>
          <Duet articles={articles[Sections.NEWS.slug]}/>
          <Divider marginTop={8}/>
          <Mark category={Sections.OPINIONS} navigation={navigation}/>
          <Shelf articles={articles[Sections.OPINIONS.slug]}/>
          <Mark category={Sections.SPORTS} navigation={navigation}/>
          <Duet articles={articles[Sections.SPORTS.slug]}/>
          <Divider marginTop={8}/>
          {/* <Culture articles={articles.filter(article => article.categories.includes(Sections.THE_GRIND.id) || article.categories.includes(Sections.ARTS_LIFE.id))}/> */}
          <Divider/>
          <Mark category={Sections.HUMOR} navigation={navigation} alternate/>
          <Shelf articles={articles[Sections.HUMOR.slug]} alternate/>
          {/* Infinite scroll/wildcard will go here, with cell similar to the ones in `Culture` component. */}
        </ScrollView>
      </Layout>
    )
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})