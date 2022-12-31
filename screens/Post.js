import React, { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Appearance, Dimensions, LayoutAnimation, PixelRatio, Platform, StyleSheet, useColorScheme, View, UIManager, Linking } from "react-native"
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
import CircleSlider from "react-native-circle-slider"
import { FloatingAction } from "react-native-floating-action"
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av"
import { StatusBar } from "expo-status-bar"

const { width, height } = Dimensions.get("window")
const pixelRatio = PixelRatio.get()
const fontScale = PixelRatio.getFontScale()
const systemFonts = [
    ...Object.keys(minion).map(key => String(key)),
    ...defaultSystemFonts
]

const articleAudio = new Audio.Sound()

Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
  allowsRecordingIOS: false,
  staysActiveInBackground: false,
  interruptionModeIOS: InterruptionModeIOS.DoNotMix,
  interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
  shouldDuckAndroid: false,
  playThroughEarpieceAndroid: false
})

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
    const [audioURL, setAudioURL] = useState("")
    const [mostRecentPosition, setMostRecentPosition] = useState(0)
    const [trackStatus, setTrackStatus] = useState({
        isLoaded: false,
        isPlaying: false,
        isBuffering: false,
        didJustFinish: false,
        isLooping: false
    })
    const [spinning, setSpinning] = useState(false)
    const [caption, setCaption] = useState("")
    const { deviceType } = useContext(ThemeContext)
    const headerHeight = useHeaderHeight()
    const contentEdgeInset = deviceType === Device.DeviceType.PHONE ? 14 : 56
    const narrationEndpoint = "https://narrations.ad-auris.com/widget/the-stanford-daily/"
    // TODO: Add info icon for disclosure about Ad Auris and narration.
    const audioActions = [
      {
        position: 3,
        text: trackStatus.isLoaded ? "" : "Listen to this article", // if track is inactive it says this and otherwise will say play/pause icon and no text
        name: "play",
        icon: <Icon name={trackStatus.isPlaying ? "archive-outline" : "arrow-right"} width={30} height={30} fill="white" />,
        color: theme["color-primary-500"]
      },
      {
        position: 2,
        name: "stop",
        icon: <Icon name="square-outline" width={20} height={20} fill="white" />,
        color: theme["color-primary-500"]
      },
      {
        position: 0,
        // text: "Skip 15 seconds",
        name: "skip",
        icon: <Icon name="skip-forward" width={30} height={30} fill="#242c45" />,
        color: "#F0F4F4"
      },
      {
        position: 1,
        // text: "Rewind 15 seconds",
        name: "rewind",
        icon: <Icon name="skip-back" width={30} height={30} fill="#242c45" />,
        color: "#F0F4F4",
      }
    ]

    const toggleTrack = async () => {
      const playbackStatus = await articleAudio.getStatusAsync()
      if (playbackStatus.isPlaying) {
        // Pause track.
        setMostRecentPosition(playbackStatus.positionMillis)
        await articleAudio.pauseAsync()
        console.log("Paused: ", playbackStatus)
      } else {
        // Resume track.
        await articleAudio.playFromPositionAsync(mostRecentPosition)
      }
    }

    const startTrack = async () => {
      setSpinning(true)
      try {
        await articleAudio.loadAsync({ uri: encodeURI(audioURL) })
        await articleAudio.playAsync()
      } catch (error) {
        console.trace(error)
      }
      setSpinning(false)
    }

    const stopTrack = async () => {
      await articleAudio.stopAsync()
      await articleAudio.unloadAsync()
    }

    const skipTrack = async () => {
      console.log("skipping")
      articleAudio.setStatusAsync({ ...(await articleAudio.getStatusAsync()), positionMillis: mostRecentPosition + 15000 })
      
      // playbackStatus.positionMillis += 15000
    }

    const rewindTrack = () => {
      console.log("rewinding")
      // playbackStatus.positionMillis -= 15000
    }
    const [statusBarStyle, setStatusBarStyle] = useState("light")

    function openArticleIfPresent(url) {
      const pruned = url.slice(-1) === "/" ? url.slice(0, -1) : url
      const preSlug = pruned.split("/")
      const slug = (preSlug[preSlug.length - 1])
      
      // Hopefully this doesn't take too long to load. Might have to preload.

      if (url.match(/stanforddaily.com\/\d{4}\/\d{2}\/\d{2}\/(.*)/)) {        
        Model.posts().slug(slug).embed().then(result => {
          if (result.length > 0) {
            navigation.push("Post", { article: result[0], sourceName: "Stanford Daily" })
          }
        }).catch(error => console.trace(error))
      } else {
        Linking.openURL(url)
      }      
    }

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

    const AudioIcon = () => (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Icon name="headphones-outline" width={25} height={25} backgroundColor={"transparent"} fill="white" />
        <View style={{ alignItems: "center", alignContent: "center", position: "absolute" }}>
				  <CircleSlider dialRadius={28} value={trackStatus.isLoaded && 359 * trackStatus.positionMillis / trackStatus.durationMillis} btnRadius={trackStatus.isPlaying ? 2.5 : 0} strokeWidth={5} strokeColor="transparent" textColor="transparent" meterColor={theme["text-basic-color"]} />
        </View>
			</View>
    )

    useEffect(() => {
      Promise.all(article.categories.map(category => Model.categories().id(category).get())).then(p => {
        const resolvedCategory = p.filter(q => q.name === article.parsely.meta.articleSection)[0]
        setDisplayCategory(resolvedCategory)
      })

      navigation.addListener("focus", () => {
        setStatusBarStyle("light")
      })

      navigation.addListener("blur", () => {
        setStatusBarStyle(undefined)
      })

      // Maybe we can get the captions in the initial home screen API call in the future.
      // Hoping there is a better way than using the `_embed` query parameter.
      // That would vastly increase loading time when so many posts are being fetched at once,
      // most of which are not going to be tapped on anyway.

      Model.media().id(article["featured_media"]).get().then(media => {
        setCaption(decode(media.caption?.rendered).slice(3, -5))
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      })

      // Attempts to retrieve the remote narration file URL for the article.
      fetch(narrationEndpoint + article.slug).then(response => {
        const narrationPath = response.ok ? article.slug : generateSlug(decode(article.title.rendered))
        fetch(narrationEndpoint + narrationPath).then(response => response.text()).then(data => {
          var matches = data.match(/<meta.*?property="og:audio".*?content="(.*?)"/)
          if (matches) {
            let audioURL = matches[1]
            setAudioURL(audioURL)
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          }
        }).catch(error => console.log(error))
      })

      articleAudio.setOnPlaybackStatusUpdate(setTrackStatus)

      return () => {
        if (colorScheme === "light") {
          StatusBar.setBarStyle("dark-content", true)
        }
        if (articleAudio) {
          articleAudio.unloadAsync()
        }
      }
    }, [article])


    return (
      <React.Fragment>
        <StatusBar style={statusBarStyle} />
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
              baseStyle={{ fontFamily: "MinionProRegular", fontSize: 20*fontScale, color: theme["text-basic-color"], backgroundColor: theme["background-basic-color-1"] }}
              tagsStyles={{ a: { color: theme["color-primary-500"], textDecorationLine: "none" } }} // The font color is slightly off in Dark Mode.
              renderers={renderers}
              renderersProps={{ a: { onPress: (e, href) => openArticleIfPresent(href) } }}
              WebView={WebView}
              backgroundColor={theme["background-color-basic-2"]}
              enableExperimentalMarginCollapsing
            />
          </View>
        </ImageHeaderScrollView>
        {audioURL !== "" && (
            <FloatingAction
              color={theme["color-primary-500"]}
              distanceToEdge={Spacing.large}
              floatingIcon={spinning ? <ActivityIndicator /> : <AudioIcon />}
              actions={trackStatus.isLoaded ? audioActions : audioActions.slice(0, 1)}
              onPressItem={async (name) => {
                switch (name) {
                  case "play": (await articleAudio.getStatusAsync()).isLoaded ? toggleTrack() : startTrack()
                  case "stop": stopTrack()
                  case "skip": skipTrack()
                  case "rewind": rewindTrack()
                  default: break
                }
              }}
            />    
        )}
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
    fontFamily: "MinionProBold"
  }
})
