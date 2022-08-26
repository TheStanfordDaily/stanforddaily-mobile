import React, { useContext, useEffect, useState } from "react";
import { View, Dimensions, StatusBar, StyleSheet, PixelRatio, useColorScheme, Appearance } from "react-native";
import { Text, useTheme } from "@ui-kitten/components";
import { ImageHeaderScrollView, TriggeringView } from "react-native-image-header-scroll-view";
import { Spacing } from "../constants";
import Content, { defaultSystemFonts } from "react-native-render-html";
import { FontSizes } from "../constants";
import WebView from "react-native-webview";
import { decode } from "html-entities";
import IframeRenderer, { iframeModel } from "@native-html/iframe-plugin";
import { formatDate } from "../helpers/format";
import Byline from "./Byline";
import { minion } from "../custom-fonts";
import Model from "../Model"
import { ThemeContext } from "../theme-context";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Device from "expo-device";
import { deviceType } from "../App";

const { width, height } = Dimensions.get("window");
const pixelRatio = PixelRatio.get();
const systemFonts = [
    ...Object.keys(minion).map(key => String(key)),
    ...defaultSystemFonts
];

export default function Post({ route, navigation }) {
    const { article, sourceName } = route.params
    const featuredMedia = `${article["jetpack_featured_media_url"]}?w=${pixelRatio*width}`
    const colorScheme = useColorScheme()
    const theme = useTheme()
    const dateInstance = new Date(article.date)
    const authors = article.parsely?.meta?.creator?.reduce((object, name, index) => ({...object, [name]: article.coauthors[index]}), {})
    const [displayCategory, setDisplayCategory] = useState({})
    const [caption, setCaption] = useState('')
    const themeContext = useContext(ThemeContext)
    const headerHeight = useHeaderHeight()
    const contentEdgeInset = deviceType() === Device.DeviceType.PHONE ? 14 : 56

    const renderers = {
      // Note: Chrome URL protocol causes a crash with the renderer below.
      // iframe: IframeRenderer,
      em: (props) => <Text {...props} style={{ fontFamily: "MinionProIt", fontSize: props?.tnode?.styles?.nativeTextFlow?.fontSize }}>{props?.tnode?.init?.textNode?.data}</Text>,
      strong: (props) => <Text {...props} style={{ fontFamily: "MinionProBold", fontSize: props?.tnode?.styles?.nativeTextFlow?.fontSize }}>{props?.tnode?.init?.textNode?.data}</Text>,
      // h4: (props) => <Text {...props} category="h4">{props.tnode.children[0].children[0].init.textNode.data}</Text>,
    };
    
    const customHTMLElementModels = {
      iframe: iframeModel
    };

    const Foreground = () => (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text category={deviceType() === Device.DeviceType.PHONE ? "h4" : "h2"} style={{...styles.hoveringText, paddingHorizontal: deviceType() === Device.DeviceType.PHONE ? 20 : 60}}>{decode(article.title.rendered)}</Text>
      </View>
    )

    useEffect(() => {
      Promise.all(article.categories.map(category => Model.categories().id(category).get())).then(p => {
        const resolvedCategory = p.filter(q => q.name === article.parsely.meta.articleSection)[0]
        setDisplayCategory(resolvedCategory)
      })
        Model.media().id(article["featured_media"]).get().then(media => {
            setCaption(decode(media.caption?.rendered).slice(3, -5))
        })

      return () => {
        if (colorScheme === "light") {
          StatusBar.setBarStyle("dark-content", true)
        }
      }
    }, [article])

    Appearance.addChangeListener(listener => {
      if (listener.colorScheme === "light") {
        StatusBar.setBarStyle("light-content", true)
      }
    })


    return (
      <ImageHeaderScrollView
        headerImage={{ uri: featuredMedia }}
        renderForeground={Foreground}
        maxOverlayOpacity={0.75}
        minOverlayOpacity={0.6}
        minHeight={headerHeight}
        maxHeight={headerHeight + featuredMedia ? 270 : 0}
        fadeOutForeground
        scrollViewBackgroundColor={theme["background-basic-color-1"]}>
        <View style={{ flex: 1, marginHorizontal: contentEdgeInset, paddingTop: deviceType() === Device.DeviceType.PHONE ? undefined : Spacing.large, paddingBottom: Spacing.large }}>
          <TriggeringView>
              {caption !== "" && <Text style={{ paddingTop: 8 }} category="s1">{caption}</Text>}
            {article["wps_subtitle"] !== "" && <Text style={{ paddingTop: 8 }} category="s1">{article["wps_subtitle"]}</Text>}
            <Byline authors={authors} section={article.parsely.meta.articleSection} sourceName={sourceName} category={displayCategory} date={formatDate(dateInstance, true)} navigation={navigation} />
          </TriggeringView>
          <Content
            source={{ html: article.content.rendered }}
            defaultTextProps={{ selectable: true }}
            customHTMLElementModels={customHTMLElementModels}
            systemFonts={systemFonts}
            contentWidth={width}
            baseStyle={{ fontFamily: "MinionProRegular", fontSize: deviceType() === Device.DeviceType.PHONE ? 18 : 22, color: theme["text-basic-color"], backgroundColor: theme["background-basic-color-1"] }}
            tagsStyles={{ a: { color: theme["color-primary-500"], textDecorationLine: "none" } }}
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
    marginTop: 20,
    textShadowColor: "black",
    textShadowRadius: 1,
    textShadowOffset: {
      width: 1,
      height: 1
    },
    textAlign: "center",
    fontFamily: "MinionProBold",
  }
})
