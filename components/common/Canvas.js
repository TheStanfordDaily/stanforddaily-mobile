import React from "react"
import { Dimensions, Image, PixelRatio, StyleSheet, Text, View } from "react-native"
import Carousel from "react-native-snap-carousel"

const { width, height } = Dimensions.get("window")
const pixelRatio = PixelRatio.get()

export default function Canvas({ navigation, articles }) {
    // No recent cartoons at the moment.
    const staticCartoons = [
        `https://stanforddaily.com/wp-content/uploads/2022/01/sunflower_chris_cross.jpeg?w=${2*width}`,
        `https://stanforddaily.com/wp-content/uploads/2022/01/IMG_0505.jpg?w=${2*width}`,
        `https://stanforddaily.com/wp-content/uploads/2022/01/IMG_0503.jpg?w=${2*width}`
    ]

    return (
        <View style={{ height: width }}>
            <Carousel
              data={articles}
              renderItem={({ item, index }) => <Image style={{ flex: 1 }} source={{ uri: `${item["jetpack_featured_media_url"]}?w=${pixelRatio*width}` }} />}
              sliderWidth={width}
              itemWidth={width}
              layout="tinder"
            />
        </View>
    )
}
