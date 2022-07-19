import React, { Component } from 'react';
import { View, Dimensions, Text, StatusBar, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { getThumbnailURL, formatDate, normalize } from '../helpers/format';
import { getPostByIdAsync } from '../helpers/wpapi';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import { Margins, Strings } from '../constants';
import Content, { defaultSystemFonts } from 'react-native-render-html';
import { FontSizes } from '../constants';
import { WebView } from 'react-native-webview';
import iframe from '@native-html/iframe-plugin';
import Byline from '../components/Byline';
import { decode } from 'html-entities';

const renderers = { iframe }
const { width, height } = Dimensions.get('window');
const systemFonts = [...defaultSystemFonts, 'MinionProDisp', 'MinionProBoldDisp', 'MinionProRegular', 'MinionProItDisp'];

export default function Post(props) {

    // A function that triggers going back to headlines
    const goBack = () => {
        props.navigation.goBack();
    }

    const createMarkup = (text) => {
        return text;
        // todo: HTML purify this if needed.
    }


        return (
        <View style={{ flex: 1 }}>
          
        </View>
        )
    
}

const styles = StyleSheet.create({
  copy: {
    // marginHorizontal: Margins.articleSides,
    fontFamily: "LibreFranklinRegular",
    fontSize: FontSizes.small,
    // color: THEME.LABEL
  },
  caption: {
    // marginHorizontal: Margins.articleSides,
    fontFamily: "MinionProItDisp",
    fontSize: FontSizes.small,
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

const tagStyles = {
  body: {
    whiteSpace: 'normal',
    fontSize: FontSizes.smallMedium,
    fontFamily: "MinionProRegular"
  },
  a: {
    color: '#8c1515',
    textDecorationColor: '#8c1515'
    // need to change the underline offset somehow
  }
}