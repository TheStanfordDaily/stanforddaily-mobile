import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Sections } from "../constants";
import { getHomeAsync, getCategoryAsync, getHomeMoreAsync } from "../helpers/wpapi";
import LightboxGallery from "../components/LightboxGallery";
import { getThumbnailURL, formatDate } from "../helpers/format";
import { Divider, Layout, Text } from "@ui-kitten/components";
import Diptych from "../components/Diptych";
import Mark from "../components/Mark";
import Wildcard from "../components/Wildcard";
import Shelf from "../components/Shelf"; // Could probably have an index file with all the sections and import all of them on one line.
import Carousel from "../components/Carousel";
import Model from "../Model";
import { post } from "superagent";

const dummyData = require("../dummy.json")

const thumbnailImage = (details) => {
  console.log(details.sizes.thumbnail)
}

const homeMember = (article, section) => {
  if (section.id === Sections.FEATURED.id) {
    return article.categories.includes(Sections.FEATURED.id)
  }
  /*if (section.id === Sections.THE_GRIND.id || section.id === Sections.ARTS_LIFE.id) {
    return article.categories.includes(Sections.THE_GRIND.id) || article.categories.includes(Sections.ARTS_LIFE.id)
  }*/
  return article.categories.includes(section.id) && !article.categories.includes(Sections.FEATURED.id)
}

export default function Home({ navigation }) {
    const [articles, setArticles] = useState({}) // or just append to articles like before or useReducer
    const [pageNumber, setPageNumber] = useState(0)
    const [articlesLoaded, setArticlesLoaded] = useState(false)
    useEffect(() => {
      Model.posts().perPage(50).get().then(posts => {
        for (let value of Object.values(Sections)) {
          setArticles(articles => ({
            ...articles,
            [value.slug]: posts.filter(items => homeMember(items, value)),
          }))
        }
        setArticles(articles => ({
          ...articles,
          "culture": posts.filter(items => items.categories.includes(Sections.THE_GRIND.id) || items.categories.includes(Sections.ARTS_LIFE.id)),
        }))
      }).finally(() => setArticlesLoaded(true))
    }, [pageNumber]) // Runs once at the beginning, and anytime pageNumber changes thereafter.

    return (articlesLoaded &&
      <Layout style={styles.container}>
        <ScrollView>
          <Carousel articles={articles[Sections.FEATURED.slug]} navigation={navigation} />
          <Mark category={Sections.NEWS} seed={articles[Sections.NEWS.slug]} navigation={navigation} />
          <Diptych articles={articles[Sections.NEWS.slug]} navigation={navigation} />
          <Divider marginTop={8}/>
          <Mark category={Sections.OPINIONS} seed={articles[Sections.OPINIONS.slug]} navigation={navigation} />
          <Shelf articles={articles[Sections.OPINIONS.slug]} navigation={navigation} />
          <Mark category={Sections.SPORTS} seed={articles[Sections.SPORTS.slug]} navigation={navigation} />
          <Diptych articles={articles[Sections.SPORTS.slug]} navigation={navigation} />
          <Divider marginTop={8}/>
          <Wildcard articles={articles["culture"]} navigation={navigation} random />
          <Divider/>
          {articles[Sections.HUMOR.slug].length >= 3 && (
            <React.Fragment>
              <Mark category={Sections.HUMOR} seed={articles[Sections.HUMOR.slug]} alternate navigation={navigation} />
              <Shelf articles={articles[Sections.HUMOR.slug]} alternate navigation={navigation}/>
            </React.Fragment>
          )}
          {/* Infinite scroll/wildcard will go here, with cell similar to the ones in `Wildcard` component. */}
        </ScrollView>
      </Layout>
    )
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})