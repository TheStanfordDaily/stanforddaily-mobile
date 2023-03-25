import React from "react"
import { StyleSheet, View, TouchableOpacity } from "react-native"
import { Text, useTheme } from "@ui-kitten/components"

export default function Mark({ navigation, alternate, seed, category }) {
    const theme = useTheme()

    return (
        <TouchableOpacity
            activeOpacity={alternate ? 0.8 : 0.5}
            onPress={() => navigation.navigate("Section", { category: category, seed: seed })}
            style={[styles.container, { backgroundColor: theme[alternate ? "color-primary-600" : "background-color-basic-1"] }]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ opacity: 0 }}>{"  \u276f"}</Text>
                    <Text style={{ color: alternate ? "white" : theme["text-basic-color"] }} category={"h4"}>{category.name.toUpperCase()}</Text>
                    <Text style={{ color: alternate ? "white" : theme["text-basic-color"] }}>{"  \u276f"}</Text>
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