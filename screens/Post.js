import React, { Component } from "react";
import { View, Dimensions, StatusBar, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Image, Platform } from "react-native";
import { Text, useTheme, withStyles } from "@ui-kitten/components";
import { formatDate } from "../helpers/format";
import { getPostByIdAsync } from "../helpers/wpapi";
import { ImageHeaderScrollView, TriggeringView } from "react-native-image-header-scroll-view";
import { Margins, Strings } from "../constants";
import Content, { defaultSystemFonts } from "react-native-render-html";
import { FontSizes } from "../constants";
import WebView from "react-native-webview";
import iframe from "@native-html/iframe-plugin";
import Byline from "../components/Byline";
import { decode } from "html-entities";
import { PropsService } from "@ui-kitten/components/devsupport";
import IframeRenderer, { iframeModel } from "@native-html/iframe-plugin";
import { Layout } from "@ui-kitten/components";

// const renderers = { iframe }
const { width, height } = Dimensions.get("window");
const systemFonts = [...defaultSystemFonts, "MinionProDisp", "MinionProBoldDisp", "MinionProRegular", "MinionProItDisp"];

export default function Post({ route, navigation }) {
    const { article } = route.params
    // if no articles, make API call
    const featuredMedia = article["jetpack_featured_media_url"]
    const theme = useTheme()
    const dateInstance = new Date(article.date)
    const renderers = {
      iframe: IframeRenderer
    };
    
    const customHTMLElementModels = {
      iframe: iframeModel
    };

    const Foreground = () => (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
        <Text category="h4" style={styles.hoveringText}>{decode(article.title.rendered)}</Text>
      </View>
    )

    return (
      <ImageHeaderScrollView
        headerImage={{ uri: featuredMedia }}
        renderForeground={Foreground}
        maxOverlayOpacity={0.75}
        minOverlayOpacity={0.6}
        minHeight={91 + 19*(Platform.OS === "android")}
        maxHeight={featuredMedia ? 270 : 0}
        fadeOutForeground
        scrollViewBackgroundColor={theme["background-basic-color-1"]}>
        {/* Could change this to `Layout` and work with theming that way as well. */}
        {/* Need to add back the `TriggeringView` so that the image scales when user pulls. */}
        <View style={{ flex: 1, marginHorizontal: 14 }}>
          <TriggeringView>
            {article["wps_subtitle"] !== "" && <Text style={{ paddingTop: 8 }} category="s1">{article["wps_subtitle"]}</Text>}
            {/* Byline will go here */}
            <Text category="label">{formatDate(dateInstance)}</Text>
          </TriggeringView>
          <Content
            source={{html: article.content.rendered}}
            WebView={WebView}
            customHTMLElementModels={customHTMLElementModels}
            systemFonts={systemFonts}
            contentWidth={width}
            baseStyle={{ fontFamily: "MinionProRegular", fontSize: 18, color: theme["text-basic-color"], backgroundColor: theme["background-basic-color-1"] }}
            renderers={renderers}
            backgroundColor={theme["background-color-basic-2"]}
            enableExperimentalMarginCollapsing
          />
        </View>
      </ImageHeaderScrollView>
    )
    
}

const styles = StyleSheet.create({
  body: {
    fontFamily: "MinionProDisp"
  },
  copy: {
    // marginHorizontal: Margins.articleSides,
    fontFamily: "LibreFranklinRegular",
    fontSize: FontSizes.small,
    // color: THEME.LABEL
  },
  hoveringText: {
    color: "white",
    paddingHorizontal: 20,
    marginTop: 20,
    textShadowColor: "black",
    textShadowRadius: 1,
    textShadowOffset: {width: 1, height: 1},
    textAlign: "center"
  },
  caption: {
    // marginHorizontal: Margins.articleSides,
    fontFamily: "MinionProItDisp",
    // fontSize: FontSizes.small,
    // fontStyle: "italic"
    // color: THEME.LABEL
  },
  byline: {
    marginTop: Margins.defaultSmall,
    // marginLeft: Margins.articleSides,
    fontFamily: "LibreFranklinRegular", // Looking for semibold option. Ditto for category button.
    fontSize: FontSizes.default,
  },
  author: {
    marginTop: Margins.defaultSmall,
    // marginHorizontal: Margins.articleSides,
    fontFamily: "LibreFranklinBold",
    fontSize: FontSizes.default,
    color: "#8c1515",
    fontWeight: "600"
    // color: THEME.LABEL
  },
  category: {
    marginTop: Margins.defaultSmall,
    // marginHorizontal: Margins.articleSides,
    fontFamily: "MinionProDisp",
    fontSize: FontSizes.default,
    fontWeight: "600",
    color: "black",
    backgroundColor: "#D8D8D8",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    // color: THEME.LABEL
  },
})
