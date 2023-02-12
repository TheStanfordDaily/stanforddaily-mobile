import React, { useContext, useEffect, useRef, useState } from "react"
import { Card, Text } from "@ui-kitten/components"
import { Dimensions, Image, View, StyleSheet, Platform, PixelRatio } from "react-native"
import PagerView from "react-native-pager-view"
import moment from "moment"
import _ from "lodash"
import { decode } from "html-entities"
import { Spacing } from "../constants"
import { ref } from "firebase/database"
import { ThemeContext } from "../theme-context"
import * as Device from "expo-device"

const { width, height } = Dimensions.get("window")
const pixelRatio = PixelRatio.get()
// This file imports UI Kitten Text.

export default function Diptych(props) {
    const articles = props.articles.length % 2 === 0 ? props.articles : props.articles.slice(0, -1)
    const [selection, setSelection] = useState(0)
    const { deviceType } = useContext(ThemeContext)
    const groupSize  = deviceType === Device.DeviceType.PHONE ? 2 : 3
    
    const Header = (props) => (
      <React.Fragment>
        <Image source={{ uri: `${props.source}?w=${pixelRatio*width/2}` }} style={{ flex: 1 }} />
      </React.Fragment>
    )

    const Footer = (props) => (
      <View style={styles.headerTextContainer}>
        <Text category="label">{moment(new Date(props.date)).fromNow().toUpperCase()}</Text>
      </View>
    )

    return (
        <PagerView peekEnabled style={styles.container} initialPage={0} onPageSelected={e => setSelection(e.nativeEvent.position)} overdrag>
            {_.chunk(articles, groupSize).map((couplet, index) => (
              <View collapsable={false} style={{ flex: 1, flexDirection: "row" }} key={index}>
                {couplet.map((item) => (
                  <Card
                    style={styles.card}
                    header={<Header source={item["jetpack_featured_media_url"]}/>}
                    footer={<Footer date={item["date"]}/>}
                    {...{...props, onPress: () => props.navigation.navigate("Post", { article: item })}}>
                    <Text category={"p1"}>{decode(item.title.rendered)}</Text>
                  </Card>
                ))}
              </View>
            ))}
        </PagerView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: 275, // Maybe use PixelRatio here?
      paddingHorizontal: Spacing.medium,
      paddingVertical: 4
    },
    tab: {
      height: 192,
      alignItems: "center",
      justifyContent: "center"
    },
    card: {
      flex: 1,
      height: 275, // Maybe use PixelRatio here?
      marginHorizontal: 5
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
    }
})