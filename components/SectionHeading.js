import React from "react"
import { Text, useTheme } from "@ui-kitten/components"
import { Platform, StyleSheet, View, TouchableOpacity } from "react-native"
import { Button, Icon } from "@ui-kitten/components"


export default function SectionHeading(props) {
    const arrow = Platform.OS === "ios" ? "arrow-ios-forward-outline" : "chevron-right-outline"
    const theme = useTheme()
    return (
        <TouchableOpacity style={styles.container}>
                <Text category={"h4"}>{props.title.toUpperCase()}</Text>
                <Icon width={42} height={42} name={arrow} style={{ marginRight: -42, tintColor: theme["text-basic-color"] }} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        padding: 14,
        width: "100%",
        height: 70,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    }
})