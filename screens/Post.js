import React, { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Appearance, Dimensions, LayoutAnimation, PixelRatio, Platform, StatusBar, StyleSheet, useColorScheme, View, UIManager } from "react-native"
import { Icon, Text, useTheme } from "@ui-kitten/components"
import { ImageHeaderScrollView, TriggeringView } from "react-native-image-header-scroll-view"
import { Spacing } from "../constants"
import Content, { defaultSystemFonts } from "react-native-render-html"
import WebView from "react-native-webview"
import { decode } from "html-entities"
import IframeRenderer, { iframeModel } from "@native-html/iframe-plugin"
import { formatDate, generateSlug } from "../helpers/format"
import Byline from "../components/Byline"
import { minion } from "../custom-fonts"
import Model from "../Model"
import { ThemeContext } from "../theme-context"
import { useHeaderHeight } from "@react-navigation/elements"
import * as Device from "expo-device"

const { width, height } = Dimensions.get("window")
const pixelRatio = PixelRatio.get()
const systemFonts = [
    ...Object.keys(minion).map(key => String(key)),
    ...defaultSystemFonts
]

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function Post({ route, navigation }) {
    const { article, sourceName } = route.params
    const featuredMedia = `${article["jetpack_featured_media_url"]}?w=${pixelRatio*width}`
    const colorScheme = useColorScheme()
    const theme = useTheme()
    const dateInstance = new Date(article.date)
    const authors = article.parsely?.meta?.creator?.reduce((object, name, index) => ({...object, [name]: article.coauthors[index]}), {})
    const [displayCategory, setDisplayCategory] = useState({})
    const [caption, setCaption] = useState("")
    const { deviceType } = useContext(ThemeContext)
    const headerHeight = useHeaderHeight()
    const contentEdgeInset = deviceType === Device.DeviceType.PHONE ? 14 : 56

    const renderers = {
      // Note: Chrome URL protocol causes a crash with the renderer below.
      // iframe: IframeRenderer,
      em: (props) => <Text {...props} style={{ fontFamily: "MinionProIt", fontSize: props?.tnode?.styles?.nativeTextFlow?.fontSize }}>{props?.tnode?.init?.textNode?.data}</Text>,
      strong: (props) => <Text {...props} style={{ fontFamily: "MinionProBold", fontSize: props?.tnode?.styles?.nativeTextFlow?.fontSize }}>{props?.tnode?.init?.textNode?.data}</Text>,
      // h4: (props) => <Text {...props} category="h4">{props.tnode.children[0].children[0].init.textNode.data}</Text>,
    }
    
    const customHTMLElementModels = {
      iframe: iframeModel
    }

    const Foreground = () => (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text category={deviceType === Device.DeviceType.PHONE ? "h4" : "h2"} style={{...styles.hoveringText, paddingHorizontal: deviceType === Device.DeviceType.PHONE ? 20 : 60}}>{decode(article.title.rendered)}</Text>
        {article["wps_subtitle"]?.length > 0 && <Text category="s1" style={{ ...styles.hoveringText, fontFamily: "MinionProBoldIt", marginTop: 10, paddingHorizontal: deviceType === Device.DeviceType.PHONE ? 20 : 60 }}>{article["wps_subtitle"]}</Text>}
      </View>
    )

    useEffect(() => {
      Promise.all(article.categories.map(category => Model.categories().id(category).get())).then(p => {
        const resolvedCategory = p.filter(q => q.name === article.parsely.meta.articleSection)[0]
        setDisplayCategory(resolvedCategory)
      })

      // Maybe we can get the captions in the initial home screen API call in the future.
      // Hoping there is a better way than using the `_embed` query parameter.
      // That would vastly increase loading time when so many posts are being fetched at once,
      // most of which are not going to be tapped on anyway.

      Model.media().id(article["featured_media"]).get().then(media => {
        setCaption(decode(media.caption?.rendered).slice(3, -5))
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
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
      <React.Fragment>
        <ImageHeaderScrollView
          headerImage={{ uri: featuredMedia }}
          renderForeground={Foreground}
          maxOverlayOpacity={0.75}
          minOverlayOpacity={0.6}
          minHeight={headerHeight}
          maxHeight={headerHeight + featuredMedia ? 270 : 0}
          fadeOutForeground
          scrollViewBackgroundColor={theme["background-basic-color-1"]}>
          <View style={{ flex: 1, marginHorizontal: contentEdgeInset, paddingTop: deviceType === Device.DeviceType.PHONE ? undefined : Spacing.large, paddingBottom: Spacing.large }}>
            <TriggeringView>
              {caption !== "" && <Text style={{ paddingTop: Spacing.medium }} category="s1">{caption}</Text>}
              <Byline authors={authors} section={article.parsely.meta.articleSection} sourceName={sourceName} category={displayCategory} date={formatDate(dateInstance, true)} navigation={navigation} />
            </TriggeringView>
            <Content
              source={{ html: article.content.rendered }}
              defaultTextProps={{ selectable: true }}
              customHTMLElementModels={customHTMLElementModels}
              systemFonts={systemFonts}
              contentWidth={width}
              baseStyle={{ fontFamily: "MinionProRegular", fontSize: deviceType === Device.DeviceType.PHONE ? 18 : 22, color: theme["text-basic-color"], backgroundColor: theme["background-basic-color-1"] }} // TODO: Replace with PixelRatio.
              tagsStyles={{ a: { color: theme["color-primary-500"], textDecorationLine: "none" } }} // The font color is slightly off in Dark Mode.
              renderers={renderers}
              WebView={WebView}
              backgroundColor={theme["background-color-basic-2"]}
              enableExperimentalMarginCollapsing
            />
          </View>
        </ImageHeaderScrollView>
      </React.Fragment>
    )
}

const styles = StyleSheet.create({
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
