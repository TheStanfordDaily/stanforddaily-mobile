import React, { useEffect, useState } from "react";
import { View, Dimensions, Share, StatusBar, StyleSheet, Platform } from "react-native";
import { Button, Text, useTheme, withStyles } from "@ui-kitten/components";
import { ImageHeaderScrollView, TriggeringView } from "react-native-image-header-scroll-view";
import { Spacing } from "../constants";
import Content, { defaultSystemFonts } from "react-native-render-html";
import { FontSizes } from "../constants";
import WebView from "react-native-webview";
import { decode } from "html-entities";
import IframeRenderer, { iframeModel } from "@native-html/iframe-plugin";
import { itemize, formatDate } from "../helpers/format";
import Byline from "./Byline";
import { minion } from "../custom-fonts";
import Model from "../Model"

const { width, height } = Dimensions.get("window");
const systemFonts = [
    ...Object.keys(minion).map(key => String(key)),
    ...defaultSystemFonts
];

export default function Post({ route, navigation }) {
    const { article } = route.params
    const featuredMedia = article["jetpack_featured_media_url"]
    const theme = useTheme()
    const dateInstance = new Date(article.date)
    const authors = article.parsely.meta.creator.reduce((object, name, index) => ({...object, [name]: article.coauthors[index]}), {})
    const [displayCategory, setDisplayCategory] = useState({})

    const renderers = {
      iframe: IframeRenderer,
      em: (props) => <Text {...props} style={{ fontFamily: "MinionProIt", fontSize: props?.tnode?.styles?.nativeTextFlow?.fontSize }}>{props?.tnode?.init?.textNode?.data}</Text>,
      strong: (props) => <Text {...props} style={{ fontFamily: "MinionProBold", fontSize: props?.tnode?.styles?.nativeTextFlow?.fontSize }}>{props?.tnode?.init?.textNode?.data}</Text>,
      // h4: (props) => <Text {...props} category="h4">{props.tnode.children[0].children[0].init.textNode.data}</Text>,
    };
    
    const customHTMLElementModels = {
      iframe: iframeModel
    };

    const Foreground = () => (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text category="h4" style={styles.hoveringText}>{decode(article.title.rendered)}</Text>
      </View>
    )

    useEffect(() => {
      Promise.all(article.categories.map(category => Model.categories().id(category).get())).then(p => {
        const resolvedCategory = p.filter(q => q.name === article.parsely.meta.articleSection)[0]
        setDisplayCategory(resolvedCategory)
      })
    }, [article])

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
        <View style={{ flex: 1, marginHorizontal: 14 }}>
          <TriggeringView>
            {article["wps_subtitle"] !== "" && <Text style={{ paddingTop: 8 }} category="s1">{article["wps_subtitle"]}</Text>}
            {/* Byline will go here */}
            <Byline authors={authors} section={article.parsely.meta.articleSection} category={displayCategory} date={formatDate(dateInstance, true)} navigation={navigation} />
            
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
