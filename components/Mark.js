import React from "react"
import { Platform, StyleSheet, View, TouchableOpacity } from "react-native"
import { Text, useTheme } from "@ui-kitten/components"
import { Button, Icon } from "@ui-kitten/components"
import { Sections } from "../constants"

export default function Mark({ navigation, alternate, seed, category }) {
    const arrow = Platform.OS === "ios" ? "arrow-ios-forward-outline" : "chevron-right-outline"
    const theme = useTheme()
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("Section", { category: category, seed: seed })}
            style={[styles.container, { backgroundColor: alternate ? theme["color-primary-100"] : theme["color-basic-100"] }]}>
                <Text category={"h4"}>{category.name.toUpperCase()}</Text>
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