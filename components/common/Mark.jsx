import { Text, useTheme } from "@ui-kitten/components";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * `Mark` is large section signpost in all caps.
 *
 * This component displays the name of a section and provides navigation to a screen with more articles from that section.
 * The `TouchableOpacity` makes the entire component tappable and changes its opacity as an indication of impression.
 *
 * The component's background color and text color may change depending on the `alternate` prop.
 * If set to `true`, the background takes on the accent color typically used for the Humor section on the website.
 *
 * @component
 * @param {Object} props.navigation - Passed from the `Home` screen, which automatically receives the navigation object from React Navigation.
 * @param {boolean} props.alternate - A flag indicating whether to use an accent color. Primarily intended for displaying Humor section.
 * @param {Array} props.seed - A collection of articles from the `Home` screen that can be immediately displayed upon navigation to the detail view.
 * @param {Object} props.category - The category object representing the section. It should have a `name` property like "News" or "The Grind."
 */
export default function Mark({ navigation, alternate, seed, category }) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={alternate ? 0.8 : 0.5}
      onPress={() => navigation?.navigate("Section", { category, seed })}
      style={[
        styles.container,
        { backgroundColor: theme[alternate ? "color-primary-600" : "background-color-basic-1"] },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ opacity: 0 }}>{"  \u276f"}</Text>
        <Text style={{ color: alternate ? "white" : theme["text-basic-color"] }} category="h4">
          {category.name.toUpperCase()}
        </Text>
        {navigation && <Text style={{ color: alternate ? "white" : theme["text-basic-color"] }}>{"  \u276f"}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 5,
    width: "100%",
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
