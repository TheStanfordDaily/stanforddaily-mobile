import React from "react"
import { Card, Button, Layout, Text, useTheme } from "@ui-kitten/components"
import { Image, View, StyleSheet } from "react-native"
import PagerView from "react-native-pager-view"
import moment from "moment"
import _ from "lodash"
import { decode } from "html-entities"
import { itemize } from "../helpers/format"
import { Sections } from "../constants"

export default function Carousel(props) {
    const theme = useTheme()
    const { navigation, articles } = props

    const Header = (props) => (
      <React.Fragment>
        <Image
          source={{ uri: props.source + "?w=800" }}
          style={{ flex: 1, height: 192 }}
        />
      </React.Fragment>
    )
      
    const Footer = (props) => (
      <View style={styles.footer}>
        <Text style={{ flex: 0.95 }} category="label">{itemize(Object.keys(props.authors).map(name => name.toUpperCase()))}</Text>
        <Button size="tiny" status="basic">{props.section}</Button>
      </View>
    )

    const Slide = (props) => (
      <View></View>
    )

    const ObliqueSlide = (props) => (
      <View></View>
    )

    return (
        <PagerView style={styles.container} initialPage={0} overdrag>
            {articles.map((item, index) => {
                return (
                  <View collapsable={false} style={{ flex: 1, flexDirection: "row" }} key={index}>
                      <Card
                          style={{ flex: 1, height: 300, marginHorizontal: 5 }}
                          header={<Header source={item["jetpack_featured_media_url"]} />}
                          footer={<Footer authors={item.parsely.meta.creator.reduce((object, name, index) => ({...object, [name]: item.coauthors[index]}), {})} date={item.date} section={item.parsely.meta.articleSection} />}                            
                          {...{...props, onPress: () => navigation.navigate("Post", { article: item })}}>
                          <Text style={{ marginHorizontal: -10, marginTop: -5 }} category="h6">{decode(item.title.rendered)}</Text>
                          <Text style={{ marginHorizontal: -10, marginBottom: -5, color: theme["color-primary-600"] }} category="s2">
                            {moment(new Date(item.date)).fromNow().toUpperCase()}
                          </Text>
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
      marginTop: 8
    },
    tab: {
        height: 192,
        alignItems: "center",
        justifyContent: "center"
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
        height: 200
      },
      footerContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingVertical: 20
      },
      footerControl: {
        marginHorizontal: 4
      },
      footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5
      }
})