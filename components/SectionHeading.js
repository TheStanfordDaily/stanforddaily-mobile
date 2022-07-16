import React from "react"
import { Text, useTheme } from "@ui-kitten/components"
import { Platform, StyleSheet, View, TouchableOpacity } from "react-native"
import { Button, Icon } from "@ui-kitten/components"


export default function SectionHeading(props) {
    const arrow = Platform.OS === "ios" ? "arrow-ios-forward-outline" : "chevron-right-outline"
    const theme = useTheme()
    return (
        <TouchableOpacity style={styles.container}>
                <Text category={"h2"}>{props.title.toUpperCase()}</Text>
                <Icon width={50} height={50} name={arrow} style={{ marginRight: -50, tintColor: theme["text-basic-color"] }} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        padding: 14,
        width: "100%",
        height: 72,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    icon: {
        marginRight: -50,
        // tintColor: theme["color-primary-500"]
    }
})