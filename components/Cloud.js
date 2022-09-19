import React from "react"
import { View, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Button } from "@ui-kitten/components"
import { Spacing } from "../constants"

export default function Cloud({ navigation, tags }) {
  return (
    <View style={styles.container}>
      {tags.map((tag, index) => (
        <React.Fragment>
          <Button onPress={() => console.log("go to search and fill search bar")} style={{ borderRadius: 100, marginTop: Spacing.small, flexGrow: 1/2 }}>{tag.name}</Button>
          <View style={{ width: Spacing.small }}></View>
        </React.Fragment>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginRight: -Spacing.small,
    marginTop: Spacing.large
  }
})