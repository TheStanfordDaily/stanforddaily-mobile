import React from "react";
import { View, Dimensions, StatusBar, StyleSheet, Platform } from "react-native";
import { Button, Text, useTheme, withStyles } from "@ui-kitten/components";
import { getPostByIdAsync } from "../helpers/wpapi";
import { ImageHeaderScrollView, TriggeringView } from "react-native-image-header-scroll-view";
import { Spacing } from "../constants";
import Content, { defaultSystemFonts } from "react-native-render-html";
import { FontSizes } from "../constants";
import WebView from "react-native-webview";
import { decode } from "html-entities";
import IframeRenderer, { iframeModel } from "@native-html/iframe-plugin";
import { itemize, formatDate } from "../helpers/format";
import Byline from "./Byline";

const { width, height } = Dimensions.get("window");
const systemFonts = [...defaultSystemFonts, "MinionProDisp", "MinionProBoldDisp", "MinionProRegular", "MinionProItDisp"];

export default function Post({ route, navigation }) {
    const { article } = route.params
    // if no articles, make API call
    const featuredMedia = article["jetpack_featured_media_url"]
    const theme = useTheme()
    const dateInstance = new Date(article.date)
    const authors = article.parsely.meta.creator.reduce((object, name, index) => ({...object, [name]: article.coauthors[index]}), {})
    
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
            <Byline authors={authors} section={article.parsely.meta.articleSection} date={formatDate(dateInstance, true)} navigation={navigation} />
            
          </TriggeringView>
          <Content
            source={{ html: article.content.rendered + "<br/>" }}
            defaultTextProps={{ selectable: true }}
            customHTMLElementModels={customHTMLElementModels}
            systemFonts={systemFonts}
            contentWidth={width}
            baseStyle={{ fontFamily: "MinionProRegular", fontSize: 18, color: theme["text-basic-color"], backgroundColor: theme["background-basic-color-1"] }}
            renderers={renderers}
            WebView={WebView}
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
    textShadowOffset: {
      width: 1,
      height: 1
    },
    textAlign: "center"
  }
})
