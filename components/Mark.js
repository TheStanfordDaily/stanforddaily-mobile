import React from "react"
import { StyleSheet, View, TouchableOpacity } from "react-native"
import { Text, useTheme } from "@ui-kitten/components"

export default function Mark({ navigation, alternate, seed, category }) {
    const theme = useTheme()

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("Section", { category: category, seed: seed })}
            style={[styles.container, { backgroundColor: alternate ? theme["color-primary-100"] : theme["background-color-basic-1"] }]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ opacity: 0 }}>{"  \u276f"}</Text>
                    <Text category={"h4"}>{category.name.toUpperCase()}</Text>
                    <Text>{"  \u276f"}</Text>
                </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        padding: 5,
        width: "100%",
        height: 42,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    }
})