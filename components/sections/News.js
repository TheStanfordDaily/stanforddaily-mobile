import React from "react"
import { Card, Layout, Text } from "@ui-kitten/components"
import { Image, View, StyleSheet } from "react-native"
import PagerView from "react-native-pager-view"
import moment from "moment"
import _ from "lodash"
import { decode } from "html-entities"
import { Sections } from "../../constants"

export const News = (props) => {

    const newsArticles = props.articles.length % 2 == 0 ? props.articles : props.articles.slice(0, -1)
    const Header = (props) => (
      <React.Fragment>
        <Image
          source={{ uri: props.source }}
          style={{ flex: 1, height: 192 }}
        />
      </React.Fragment>
    )
      
    const Footer = (props) => (
      <View style={styles.headerTextContainer}>
        <Text category="h6">{moment(new Date(props.date)).fromNow().toUpperCase()}</Text>
      </View>
    )

    const largestImageAvailable = (details) => {
      return _.maxBy(details.media_details.sizes, "width").source_url
    }

    return (
        <PagerView
            style={styles.container}
            initialPage={0}>
            {_.chunk(newsArticles, 2).map((duet, index) => {
                const former = duet[0]
                const latter = duet[1]
                return (
                  <View collapsable={false} style={{ flex: 1, flexDirection: "row" }} key={index}>
                      <Card
                          style={{ flex: 1, height: 300, marginHorizontal: 5 }}
                          header={<Header source={former["_embedded"]["wp:featuredmedia"][0]["media_details"].sizes.thumbnail["source_url"]} />}
                          footer={<Footer date={former.date} />}>
                          <Text>{decode(former.title.rendered)}</Text>
                      </Card>

                      <Card
                          style={{ flex: 1, height: 300, marginHorizontal: 5 }}
                          header={<Header source={latter["_embedded"]["wp:featuredmedia"][0]["media_details"].sizes.thumbnail["source_url"]} />}
                          footer={<Footer date={latter.date} />}>
                          <Text>{decode(latter.title.rendered)}</Text>
                      </Card>
                      
                  </View>
                )})}
        </PagerView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: 300,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    tab: {
        height: 192,
        alignItems: "center",
        justifyContent: "center",
      },
      card: {
        flex: 1,
        margin: 2
      },
      headerTextContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10
      },
      headerImage: {
        width: 300,
        height: 200,
      },
      footerContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingVertical: 20,
      },
      footerControl: {
        marginHorizontal: 4,
      },
})