import React, { useContext, useState } from "react";
import { Dimensions, View, StyleSheet, Image, PixelRatio, LayoutAnimation } from "react-native";
import { Divider, ListItem, Text, useTheme } from "@ui-kitten/components";
import PagerView from "react-native-pager-view";
import { decode } from "html-entities";
import _ from "lodash";
import { DeviceType } from "expo-device";

import { formatDate, itemize } from "../../utils/format";
import { ThemeContext } from "../../theme-context";
import { Spacing, Strings } from "../../utils/constants";

const pixelRatio = PixelRatio.get();
const fontScale = PixelRatio.getFontScale();
const { width, height } = Dimensions.get("window");

export default function Shelf({ articles, alternate, navigation }) {
  const theme = useTheme();
  const inactiveColor = theme[alternate ? "color-primary-600" : "background-color-basic-2"];
  const { deviceType } = useContext(ThemeContext);
  const groupSize = deviceType === DeviceType.PHONE ? 1 : 2;

  const shelfArticles = articles;
  while (shelfArticles.length % (3 * groupSize) != 0) {
    shelfArticles.pop();
  }

  const Accessory = ({ uri }) => (
    <Image source={{ uri: `${uri}?w=${pixelRatio * width / 3}` }} style={styles.image} />
  );

  return (
    <PagerView initialPage={0} overdrag scrollEnabled={shelfArticles?.length > 3 * groupSize} style={[styles.container, { backgroundColor: inactiveColor }]}>
      {_.chunk(shelfArticles, 3 * groupSize).map((triplet, index) => (
        <View key={index} style={{ flex: 1, flexDirection: "row" }}>
          {_.chunk(triplet, 3).map((group, outerIndex) => (
            <View key={outerIndex} collapsable={false} style={{ flex: 1, flexDirection: "column" }}>
              {group.map((item, innerIndex) => (
                <React.Fragment key={innerIndex}>
                  <ListItem
                    accessoryRight={<Accessory uri={item.jetpack_featured_media_url} />}
                    activeOpacity={0.8}
                    description={() => <Text category="p2" style={{ paddingHorizontal: 4, fontSize: 18 * fontScale, color: alternate ? "white" : theme["text-basic-color"] }}>{itemize(item.parsely?.meta?.creator)} on {formatDate(new Date(item.date), false).split(",")[0]}</Text>}
                    onPress={() => navigation.navigate(Strings.post, { article: item })}
                    style={{ ...styles.item, backgroundColor: theme[alternate ? "color-primary-600" : "background-basic-color-1"] }}
                    title={() => <Text adjustsFontSizeToFit allowFontScaling category="p1" ellipsizeMode="tail" numberOfLines={4} style={{ ...styles.title, color: alternate ? "white" : theme["text-basic-color"] }}>{decode(item.title.rendered)}</Text>}
                  />
                  <Divider />
                </React.Fragment>
              ))}
            </View>
          ))}
        </View>
      ))}
    </PagerView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 300,
    paddingHorizontal: Spacing.medium,
    padddingVertical: 4
  },
  image: {
    flex: 1 / 3,
    width: 45,
    height: 60,
    borderRadius: 3,
    marginLeft: 4
  },
  // TODO: Improve spacing so that cells do not look smushed and can accommodate longer titles.
  item: {
    flex: 1 / 3,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  title: {
    paddingHorizontal: 4,
    fontSize: 20 * fontScale,
    flexGrow: 1
  }
});
