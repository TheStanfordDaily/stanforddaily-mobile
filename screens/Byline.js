import React from "react"
import { TouchableOpacity, StyleSheet, View } from "react-native"
import { Button, Text } from "@ui-kitten/components"
import { Spacing } from "../constants"

export default function Byline({ authors, section, date, navigation }) {

  const Name = ({ detail }) => (
    <TouchableOpacity onPress={() => console.log(detail[1])}>
      <Text category="label" status="primary">{detail[0]}</Text>
    </TouchableOpacity>
  )
  const entries = Object.entries(authors)

  return (
    <View style={styles.byline}>
      <View style={{ flex: 0.95 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Text category="label">By </Text>
          {entries.map(entry => <Name detail={entry} />).reduce((p, q, index) => [p, <Text category="label">{index < entries.length - 1 ? ", " : " and "}</Text>, q])}
        </View>
      <Text category="label">{date}</Text>
      </View>
      <Button style={{ maxHeight: 100 }} size="tiny" status="basic">{section}</Button>
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