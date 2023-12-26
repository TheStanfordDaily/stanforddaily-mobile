import { Card, Text } from "@ui-kitten/components";
import * as Device from "expo-device";
import { decode } from "html-entities";
import _ from "lodash";
import moment from "moment";
import React, { useContext, useState } from "react";
import { Dimensions, Image, View, StyleSheet, PixelRatio } from "react-native";
import PagerView from "react-native-pager-view";

import { ThemeContext } from "../../theme-context";
import { Labels, Spacing } from "../../utils/constants";

const { width } = Dimensions.get("window");
const pixelRatio = PixelRatio.get();

/**
 * Displays a set of articles in a paginated layout.
 *
 * `Polyptych` groups the articles into pages and displays each page as a row of cards.
 * Each card represents an article and includes an image, the article's title, and the date it was published.
 * The image is displayed at the top of the card, the title is displayed in the middle, and the date is displayed at the bottom.
 *
 * The number of cards in each row depends on the device type.
 * If the device is a phone, there are two cards per row.
 * If the device is a tablet or desktop, there are three cards per row.
 *
 * The user can navigate between pages by swiping left or right.
 * The currently selected page is stored in the `selection` state variable but is not used for anything yet in particular.
 * When a card is tapped, the component navigates to the `Post` screen and passes the corresponding article as a parameter.
 *
 * Canonically, a polyptych is an altarpiece of multiple panels that are joined by hinges. The name is a metaphor.
 *
 * @component
 * @property {Array<Object>} articles - The array of article objects to display. Expected to be non-null.
 * @property {Object} navigation - The navigation object used for navigating between screens.
 * @exports Polyptych
 *
 * @example
 * <Polyptych articles={articles[Section.SPORTS.slug]} navigation={navigation} />
 */
export default function Polyptych({ articles, navigation }) {
  const flushArticles = articles.length % 2 === 0 ? articles : articles.slice(0, -1);
  const [selection, setSelection] = useState(0);
  const { deviceType } = useContext(ThemeContext);
  const groupSize = deviceType === Device.DeviceType.PHONE ? 2 : 3;

  const Header = ({ media }) => (
    <Image
      source={{ uri: `${media?.["source_url"]}?w=${(pixelRatio * width) / 2}` }}
      style={{ flex: 1 }}
      accessibilityLabel={Labels.featureImage}
      alt={media?.["alt_text"]}
    />
  );

  const Footer = ({ date }) => (
    <View style={styles.headerTextContainer}>
      <Text category="label">{moment(new Date(date)).fromNow().toUpperCase()}</Text>
    </View>
  );

  return (
    articles.length >= groupSize && (
      <PagerView
        peekEnabled
        style={styles.container}
        initialPage={0}
        onPageSelected={(e) => setSelection(e.nativeEvent.position)}
        overdrag
      >
        {_.chunk(flushArticles, groupSize).map((group, outerIndex) => (
          <View collapsable={false} style={{ flex: 1, flexDirection: "row" }} key={outerIndex}>
            {group.map((item, index) => (
              <Card
                accessibilityLabel={`Article titled ${decode(item.title.rendered)}`}
                accessibilityHint={Labels.navigatesToFullTextArticle}
                style={styles.card}
                key={index}
                header={<Header media={item["_embedded"]?.["wp:featuredmedia"]?.[0]} />}
                footer={<Footer date={item["date"]} />}
                onPress={() => navigation.navigate("Post", { article: item })}
              >
                <Text category="p1">{decode(item.title.rendered)}</Text>
              </Card>
            ))}
          </View>
        ))}
      </PagerView>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 275, // Maybe use PixelRatio here?
    paddingHorizontal: Spacing.medium,
    paddingVertical: 4,
  },
  tab: {
    height: 192,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    height: 275, // Maybe use PixelRatio here?
    marginHorizontal: 5,
  },
  headerTextContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerImage: {
    width: 300,
    height: 200,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  footerControl: {
    marginHorizontal: 4,
  },
});
