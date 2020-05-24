import React from "react";
import HTML from 'react-native-render-html';
import { Linking } from 'react-native';
import { FONTS } from './assets/constants';
import { View, Dimensions, Text } from 'react-native';
import { WebView } from 'react-native-webview'

const onLinkPress = (event, href, htmlAttributes) => {
  Linking.openURL(href);
}

const renderers = {
  div: (htmlAttribs, children, convertedCSSStyles, passProps) => {
    if (typeof htmlAttribs.class !== 'undefined' && htmlAttribs.class.includes("flourish-embed")) {
      let uri = `https://public.flourish.studio/${htmlAttribs["data-src"]}/embed?auto=1`;
      let height = 450;
      if (htmlAttribs["data-width"] && htmlAttribs["data-height"]) {
        height = Dimensions.get('window').width / parseFloat(htmlAttribs["data-width"]) * parseFloat(htmlAttribs["data-height"]);
      }
      return (<WebView
        style={{ width: "100%", height: Math.ceil(height) + 50 }}

        source={{ uri: uri }}
      // Open links in a new page: (update: this.webview not defined)
      /*onNavigationStateChange={(event) => {
        if (event.url !== uri) {
          this.webview.stopLoading();
          Linking.openURL(event.url);
        }
      }}*/
      />);
    }
    else if (typeof htmlAttribs.class !== 'undefined' && htmlAttribs.class.includes("wp-block-embed__wrapper") && typeof passProps.rawChildren[0].attribs.title !== 'undefined' && passProps.rawChildren[0].attribs.title.includes("Spotify Embed")) { // hacky way of displaying Spotify players for podcasts
      let uri = passProps.rawChildren[0].attribs.src;
      return (
        <WebView source={{ uri: uri }} style={{ height: 200, marginBottom: -32, marginTop: 8 }} />
      )
    }
    else {
      return <View />;
    }
  },
  br: () => {
    return ""; // remove extra spacing between paragraphs 
  }
}

export default (props) => {
  return <HTML
    textSelectable={props.textSelectable}
    tagsStyles={props.tagsStyles}
    containerStyle={props.containerStyle || {}}
    baseFontStyle={{ fontFamily: FONTS.PT_SERIF, ...(props.baseFontStyle || {}) }}
    html={props.html}
    renderers={renderers}
    imagesMaxWidth={Dimensions.get('window').width}
    staticContentMaxWidth={Dimensions.get('window').width}
    onLinkPress={(a, b, c) => onLinkPress(a, b, c)}
  />;
}

