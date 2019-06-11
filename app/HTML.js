import React from "react";
import HTML from 'react-native-render-html';
import { Linking } from 'react-native';
import { FONTS } from './assets/constants';
import { WebView, View, Dimensions } from 'react-native';

const onLinkPress = (event, href, htmlAttributes) => {
  Linking.openURL(href);
}

const renderers = {
  div: (htmlAttribs, children, convertedCSSStyles, passProps) => {
    if (htmlAttribs.class === "flourish-embed") {
      let uri = `https://public.flourish.studio/${htmlAttribs["data-src"]}/embed?auto=1`;
      let height = 450;
      if (htmlAttribs["data-width"] && htmlAttribs["data-height"]) {
        height = Dimensions.get('window').width / parseFloat(htmlAttribs["data-width"]) * parseFloat(htmlAttribs["data-height"]);
      }
      return (<WebView
        style={{ width: "100%", height: Math.ceil(height) + 50 }}
        // visualisation/198838
        source={{ uri: uri }}
        // Open links in a new page:
        onNavigationStateChange={(event) => {
          if (event.url !== uri) {
            this.webview.stopLoading();
            Linking.openURL(event.url);
          }
        }}
      />);
    }
    else {
      return <View />;
    }
  }
}

export default (props) => {
  return <HTML
    textSelectable={props.textSelectable}
    containerStyle={props.containerStyle || {}}
    baseFontStyle={{ fontFamily: FONTS.PT_SERIF, ...(props.baseFontStyle || {}) }}
    html={props.html}
    renderers={renderers}
    onLinkPress={(a, b, c) => onLinkPress(a, b, c)} />;
}

