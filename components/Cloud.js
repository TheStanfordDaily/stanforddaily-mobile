import React from "react"
import { View, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Text } from "@ui-kitten/components"
import { Spacing } from "../constants"
import { decode } from "html-entities"

export default function Cloud({ navigation, tags }) {
  return (
    <View style={styles.container}>
      {tags.map((tag, index) => (
        <View style={{ paddingHorizontal: 1 }}>
          <TouchableOpacity key={index} onPress={() => console.log(`go to search and fill search bar with "${tag.name}"`)} style={{ marginTop: Spacing.small, }}>
              <Text category="label" status="primary">{decode(tag.name).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
        
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginTop: Spacing.large,
    marginHorizontal: Spacing.large
  }
})