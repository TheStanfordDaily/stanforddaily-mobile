import { Button, Card, Text, useTheme } from "@ui-kitten/components";
import { DeviceType } from "expo-device";
import { Image } from "expo-image";
import { decode } from "html-entities";
import moment from "moment";
import React, { useContext } from "react";
import { Dimensions, PixelRatio, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";

import { ThemeContext } from "../../theme-context";
import { Spacing } from "../../utils/constants";
import { itemize } from "../../utils/format";

const { width } = Dimensions.get("window");
const pixelRatio = PixelRatio.get();

/**
 * The `Carousel` component displays a horizontal scrollable list of articles, chiefly featured ones.
 * Its content panels are `Card` components that display a large image and details like title, date and image below.
 *
 * @component
 * @property {Object} navigation - The navigation object from React Navigation.
 * @property {Array} articles - An array of articles to be displayed in the carousel.
 *
 * @example
 * <Carousel navigation={navigation} articles={articles} />
 */
function Carousel({ navigation, articles }) {
  const { theme, deviceType } = useContext(ThemeContext);
  const carouselHeight = deviceType === DeviceType.PHONE ? 300 : 350;
  const accentColor = useTheme()["color-primary-600"];
  const borderColor = theme === "light" ? "#E7EBF3" : "transparent";

  const Header = ({ media }) => (
    <Image
      source={{ uri: `${media?.["source_url"]}?w=${width * pixelRatio}` }}
      style={{ flex: 1, height: 192, borderTopLeftRadius: 3, borderTopRightRadius: 3 }}
      alt={media?.["alt_text"]}
    />
  );

  const Footer = ({ authors, section }) => (
    <View style={styles.footer}>
      <Text style={{ flex: 0.95 }} category="label">
        {itemize(Object.keys(authors).map((name) => name.toUpperCase()))}
      </Text>
      <Button size="tiny" status="basic">
        {decode(section)}
      </Button>
    </View>
  );

  return (
    <PagerView style={{ ...styles.container, height: carouselHeight }} initialPage={0} overdrag>
      {articles?.map((item, index) => (
        <View collapsable={false} style={{ flex: 1, flexDirection: "row" }} key={index}>
          <Card
            style={{ flex: 1, height: carouselHeight, marginHorizontal: 5, borderColor }}
            header={<Header media={item["_embedded"]?.["wp:featuredmedia"]?.[0]} />}
            footer={
              <Footer
                authors={item.parsely?.meta?.creator?.reduce((o, name, index) => {
                  return { ...o, [name]: item.coauthors[index] };
                }, {})}
                section={item.parsely?.meta?.articleSection}
              />
            }
            onPress={() => navigation.navigate("Post", { article: item })}
          >
            <Text style={{ marginHorizontal: -10, marginTop: -5 }} category="h4">
              {decode(item.title.rendered).replace("'", "\u{2019}")}
            </Text>
            <Text style={{ marginHorizontal: -10, marginBottom: -5, color: accentColor }} category="s2">
              {moment(new Date(item["date"])).fromNow().toUpperCase()}
            </Text>
          </Card>
        </View>
      ))}
    </PagerView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
    paddingHorizontal: Spacing.medium,
    paddingVertical: 4,
    marginTop: Spacing.medium,
  },
  tab: {
    height: 192,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    margin: 2,
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default React.memo(Carousel);
