import React from "react"
import { Button, Dimensions, Image, StyleSheet, Text, View } from "react-native"
import Carousel from "react-native-snap-carousel"

const { width, height } = Dimensions.get("window")
// This file imports vanilla React Native Text.

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
              data={staticCartoons}
              renderItem={({ item, index }) => <Image style={{ flex: 1 }} source={{ uri: item }} />}
              sliderWidth={width}
              itemWidth={width}
              layout="tinder"
            />
        </View>
    )
}
