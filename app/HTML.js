import React from "react";
import HTML from 'react-native-render-html';
import {Linking} from 'react-native';
import {FONTS} from './assets/constants';

let onLinkPress = (event, href, htmlAttributes) => {
    Linking.openURL(href);
}

export default (props) => {
  return <HTML
    containerStyle={props.containerStyle || {}}
    baseFontStyle={{fontFamily: FONTS.PT_SERIF, ...(props.baseFontStyle || {})}}
    html={props.html}
    onLinkPress={(a, b, c) => onLinkPress(a, b, c)} />;
}

