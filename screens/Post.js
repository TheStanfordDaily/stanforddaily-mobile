import React, { Component } from 'react';
import { View, Dimensions, StatusBar, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { Text, useTheme, withStyles } from '@ui-kitten/components';
import { getThumbnailURL, formatDate, normalize } from '../helpers/format';
import { getPostByIdAsync } from '../helpers/wpapi';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import { Margins, Strings } from '../constants';
import Content, { defaultSystemFonts } from 'react-native-render-html';
import { FontSizes } from '../constants';
import WebView from 'react-native-webview';
import iframe from '@native-html/iframe-plugin';
import Byline from '../components/Byline';
import { decode } from 'html-entities';
import { PropsService } from '@ui-kitten/components/devsupport';
import IframeRenderer, { iframeModel } from "@native-html/iframe-plugin";
import { Layout } from '@ui-kitten/components';

const renderers = { iframe }
const { width, height } = Dimensions.get('window');
const systemFonts = [...defaultSystemFonts, 'MinionProDisp', 'MinionProBoldDisp', 'MinionProRegular', 'MinionProItDisp'];
const MONTHS = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]

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
        <Text category={"h4"} style={styles.hoveringText}>{decode(article.title.rendered)}</Text>
      </View>
    )

    function captionRenderer({ TDefaultRenderer, ...props}) {
      return (
        <TDefaultRenderer {...props} />
      )
    }


    const formattedDate = () => {
      let formattedMonth = MONTHS[dateInstance.getMonth()]
      let formattedDay = dateInstance.getDate()
      let formattedYear = dateInstance.getFullYear()
      let formattedHours = dateInstance.getHours() % 12
      if (formattedHours == 0) {
        formattedHours = 12
      }
      let formattedMinutes = dateInstance.getMinutes()
      if (formattedMinutes < 10) {
        formattedMinutes = `0${formattedMinutes}`
      }
      let formattedMeridian = dateInstance.getUTCHours % 24 < 7 ? "a.m." : "p.m."
      return `${formattedMonth} ${formattedDay}, ${formattedYear}, ${formattedHours}:${formattedMinutes} ${formattedMeridian}`
    }

    

    return (
      <ImageHeaderScrollView
        headerImage={{ uri: featuredMedia }}
        renderForeground={Foreground}
        maxOverlayOpacity={0.75}
        minOverlayOpacity={0.6}
        minHeight={91 + 19*(Platform.OS === "android")}
        maxHeight={featuredMedia ? 270 : 0}
        fadeOutForeground>
        {/* Could change this to `Layout` and work with theming that way as well. */}
        <View style={{ flex: 1, marginHorizontal: 14 }}>
          {article["wps_subtitle"] !== "" && <Text style={{ paddingTop: 8 }} category={"s1"}>{article["wps_subtitle"]}</Text>}
          {/* Byline will go here */}
          <Text category="label">{formattedDate()}</Text>
          <Content
            source={{html: article.content.rendered}}
            WebView={WebView}
            customHTMLElementModels={customHTMLElementModels}
            systemFonts={systemFonts}
            contentWidth={width}
            baseStyle={{ fontFamily: "MinionProRegular", fontSize: 16 }}
            renderers={renderers}
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
    // fontStyle: 'italic'
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
