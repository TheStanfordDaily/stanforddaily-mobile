import { Button, Card, Text } from "@ui-kitten/components";
import { decode } from "html-entities";
import React from "react";
import { Dimensions, Image, PixelRatio, StyleSheet, View } from "react-native";

import { Spacing } from "../../utils/constants";
import { formatDate, itemize } from "../../utils/format";

const { width, height } = Dimensions.get("window");
const pixelRatio = PixelRatio.get();

/**
 * `Header` is a sub-component of `Wildcard` that displays the article title, date, and image.
 * @component
 * @param {string} props.title - The title of the article.
 * @param {boolean} props.verbose - A flag indicating whether to include the excerpt in the card.
 * @param {string} props.date - The publication date.
 * @param {string} props.uri - The URI for the feature image of the article.
 */
const Header = ({ title, verbose, date, media }) => (
  <>
    <View>
      <Text style={styles.header} category="h6">
        {title}
      </Text>
      {verbose && (
        <Text category="p2" style={styles.date}>
          {formatDate(new Date(date))}
        </Text>
      )}
    </View>
    <Image
      source={{ uri: `${media?.["source_url"]}?w=${width * pixelRatio}` }}
      style={{ flex: 1, height: 192 }}
      alt={media?.["alt_text"]}
    />
  </>
);

/**
 * `Footer` is a sub-component of `Wildcard` that displays the article byline and section.
 * @component
 * @param {string} props.byline - The author's name(s) in a displayable format.
 * @param {string} props.section - The name of the section to which the article belongs.
 */
const Footer = ({ byline, section }) => (
  <View style={styles.footer}>
    <Text style={{ textAlign: "left", flex: 0.95 }} category="label">
      {byline}
    </Text>
    <Button size="tiny" status="basic">
      {decode(section).replace("'", "\u{2019}")}
    </Button>
  </View>
);

export default function Wildcard({ navigation, articles, random, verbose, title, item, index }) {
  return item.title && (
    <Card
      style={styles.card}
      accessibilityLabel={`Article titled ${decode(item.title.rendered)}`}
      accessibilityHint="Navigates to a view with full text for article"
      header={
        <Header
          verbose={verbose}
          title={decode(item.title.rendered)}
          date={item.date}
          media={item["_embedded"]?.["wp:featuredmedia"]?.[0]}
        />
      }
      footer={
        <Footer
          byline={itemize(item.parsely?.meta?.creator?.map((name) => name.toUpperCase()))}
          section={item.parsely?.meta?.articleSection}
        />
      }
      onPress={() => navigation.push("Post", { article: item, sourceName: title })}
    >
      <Text style={{ marginHorizontal: -4 }}>{decode(item.excerpt.rendered.slice(3, -5))}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  date: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 10,
    fontFamily: undefined,
    fontWeight: "bold",
  },
  card: {
    flex: 1,
    marginHorizontal: Spacing.medium,
    marginVertical: 4,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.medium,
    paddingVertical: 4,
  },
});
