import { Button, Text } from "@ui-kitten/components";
import { decode } from "html-entities";
import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";

import { Spacing, Sections } from "../../utils/constants";

const includesDesks = (category) => {
  return category.desks && Object.keys(category.desks).length > 0;
};

export default function Byline({ authors, section, sourceName, category, date, navigation }) {
  const entries = Object.entries(authors);
  const bylineFontSize = entries.length < 3 ? 16 : 14;
  const richCategory = Object.values(Sections).find((value) => value.id === category.id) ?? category;
  const resolvedCategory = [3, 23, 25].includes(category.id) && includesDesks(richCategory) ? richCategory : category;

  const Name = ({ detail }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Author", { name: detail[0], id: detail[1] })}>
      <Text category="label" status="primary" style={{ fontSize: bylineFontSize }}>
        {detail[0]}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.byline}>
      <View style={{ flex: 0.95 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {entries[0][1] !== 16735 && (
            <Text category="label" style={{ fontSize: bylineFontSize }}>
              By{" "}
            </Text>
          )}
          {entries
            .map((entry, index) => <Name detail={entry} key={entry[1]} />)
            .reduce((p, q, index) => [
              p,
              <Text key={index} category="label" style={{ fontSize: bylineFontSize }}>
                {index < entries.length - 1 ? ", " : " and "}
              </Text>,
              q,
            ])}
        </View>
        <Text category="label">{date}</Text>
      </View>

      <Button
        onPress={() => {
          if (category.name === sourceName) {
            navigation.navigate("Section", { category: resolvedCategory, seed: [] });
          } else {
            navigation.push("Section", { category: resolvedCategory, seed: [] });
          }
        }}
        style={{ maxHeight: 100 }}
        size="tiny"
        status="basic"
      >
        {decode(section).replace("'", "\u{2019}")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  byline: {
    flexDirection: "row",
    paddingTop: Spacing.medium,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
