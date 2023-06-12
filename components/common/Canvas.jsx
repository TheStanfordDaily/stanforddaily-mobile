import React from "react"
import { Dimensions, Image, PixelRatio, StyleSheet, Text, View } from "react-native"
// import Carousel from "react-native-snap-carousel"

const { width, height } = Dimensions.get("window")
const pixelRatio = PixelRatio.get()

export default function Canvas({ navigation, articles }) {
    return (
        <View style={{ height: width }}>
            {/* <Carousel
              data={articles}
              renderItem={({ item, index }) => <Image style={{ flex: 1 }} source={{ uri: item["jetpack_featured_media_url"]}} />}
              sliderWidth={width}
              itemWidth={width}
              layout="tinder"
            /> */}
        </View>
    )
}
