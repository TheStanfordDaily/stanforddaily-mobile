import React, { useContext, useState } from "react";
import { Dimensions, Image, View, StyleSheet, PixelRatio } from "react-native";
import { Card, Text } from "@ui-kitten/components";
import PagerView from "react-native-pager-view";
import moment from "moment";
import _ from "lodash";
import { decode } from "html-entities";
import * as Device from "expo-device";

import { Spacing } from "../../utils/constants";
import { ThemeContext } from "../../theme-context";

const { width, height } = Dimensions.get("window");
const pixelRatio = PixelRatio.get();

export default function Polyptych({ articles, navigation }) {
  const flushArticles = articles.length % 2 === 0 ? articles : articles.slice(0, -1);
  const [selection, setSelection] = useState(0);
  const { deviceType } = useContext(ThemeContext);
  const groupSize = deviceType === Device.DeviceType.PHONE ? 2 : 3;
  
  const Header = ({ source }) => (
    <React.Fragment>
      <Image source={{ uri: `${source}?w=${pixelRatio*width/2}` }} style={{ flex: 1 }} />
    </React.Fragment>
  );

  const Footer = ({ date }) => (
    <View style={styles.headerTextContainer}>
      <Text category="label">{moment(new Date(date)).fromNow().toUpperCase()}</Text>
    </View>
  );

  return (
    <PagerView peekEnabled style={styles.container} initialPage={0} onPageSelected={(e) => setSelection(e.nativeEvent.position)} overdrag>
      {_.chunk(flushArticles, groupSize).map((group, outerIndex) => (
        <View collapsable={false} style={{ flex: 1, flexDirection: "row" }} key={outerIndex}>
          {group.map((item, index) => (
            <Card
              style={styles.card}
              key={index}
              header={<Header source={item["jetpack_featured_media_url"]}/>}
              footer={<Footer date={item["date"]}/>}
              onPress={() => navigation.navigate("Post", { article: item })}>
              <Text category="p1">{decode(item.title.rendered)}</Text>
            </Card>
          ))}
        </View>
      ))}
    </PagerView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 275, // Maybe use PixelRatio here?
    paddingHorizontal: Spacing.medium,
    paddingVertical: 4
  },
  tab: {
    height: 192,
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    flex: 1,
    height: 275, // Maybe use PixelRatio here?
    marginHorizontal: 5
  },
  headerTextContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  headerImage: {
    width: 300,
    height: 200
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  footerControl: {
    marginHorizontal: 4
  }
});