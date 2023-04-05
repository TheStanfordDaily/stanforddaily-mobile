import React, { useEffect, useState } from "react"
import { TouchableOpacity, StyleSheet, View } from "react-native"
import { Button, Text, Icon, useTheme } from "@ui-kitten/components"
import { Spacing } from "../../utils/constants"
import { decode } from "html-entities"

export default function Byline({ authors, section, sourceName, category, date, navigation }) {
  const entries = Object.entries(authors)
  const bylineFontSize = entries.length < 3 ? 16 : 14
  const [sameCategory, setSameCategory] = useState(false)
  const theme = useTheme()


  const Name = ({ detail }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Author", { name: detail[0], id: detail[1] })}>
      <Text category="label" status="primary" style={{ fontSize: bylineFontSize }}>{detail[0]}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.byline}>
      <View style={{ flex: 0.95 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {entries[0][1] != 16735 && <Text category="label" style={{ fontSize: bylineFontSize }}>By </Text>}
          {entries.map((entry, index) => <Name detail={entry} key={entry[1]} />).reduce((p, q, index) => [p, <Text key={index} category="label" style={{ fontSize: bylineFontSize }}>{index < entries.length - 1 ? ", " : " and "}</Text>, q])}
        </View>
      <Text category="label">{date}</Text>

      </View>
      
      <Button onPress={() => {
        if (category) {
          category.name === sourceName ? navigation.navigate("Section", { category: category, seed: [] }) : navigation.push("Section", { category: category, seed: [] })
        }
      }} style={{ maxHeight: 100 }} size="tiny" status="basic">{decode(section).replace('\'', '\u{2019}')}</Button>
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