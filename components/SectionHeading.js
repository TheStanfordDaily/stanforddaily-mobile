import React from "react"
import { Text, useTheme } from "@ui-kitten/components"
import { Platform, StyleSheet, View, TouchableOpacity } from "react-native"
import { Button, Icon } from "@ui-kitten/components"

// Going to rename this to be Banner, Signpost, Mark or Placard. Leaning toward Mark.
export default function SectionHeading(props) {
    const arrow = Platform.OS === "ios" ? "arrow-ios-forward-outline" : "chevron-right-outline"
    const theme = useTheme()
    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: props.alternate ? theme["color-primary-100"] : theme["color-basic-100"] }]}>
                <Text category={"h4"}>{props.title.toUpperCase()}</Text>
                <Icon width={42} height={42} name={arrow} style={{ marginRight: -42, marginTop: 2, tintColor: theme["text-basic-color"] }} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        padding: 5,
        width: "100%",
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    }
})