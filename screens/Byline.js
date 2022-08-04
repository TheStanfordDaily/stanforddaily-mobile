import React from "react"
import { TouchableOpacity, StyleSheet, View } from "react-native"
import { Button, Text } from "@ui-kitten/components"
import { Spacing } from "../constants"
import { decode } from "html-entities"

export default function Byline({ authors, section, category, date, navigation }) {
  const entries = Object.entries(authors)
  const bylineFontSize = entries.length < 3 ? 16 : 14

  const Name = ({ detail }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Author", { name: detail[0], id: detail[1] })}>
      <Text category="label" status="primary" style={{ fontSize: bylineFontSize }}>{detail[0]}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.byline}>
      <View style={{ flex: 0.95 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {entries[0][1] != 16735 && (<Text category="label" style={{ fontSize: bylineFontSize }}>By </Text>)}
          {entries.map(entry => <Name detail={entry} />).reduce((p, q, index) => [p, <Text category="label" style={{ fontSize: bylineFontSize }}>{index < entries.length - 1 ? ", " : " and "}</Text>, q])}
        </View>
      <Text category="label">{date}</Text>
      </View>
      <Button onPress={() => {
        if (category) {
          category.name === section ? navigation.navigate("Section", { category: category, seed: [] }) : navigation.push("Section", { category: category, seed: [] })
        }
      }} style={{ maxHeight: 100 }} size="tiny" status="basic">{decode(section)}</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  byline: {
    flexDirection: "row",
    paddingTop: Spacing.medium,
    justifyContent: "space-between",
    alignItems: "center"
  }
})