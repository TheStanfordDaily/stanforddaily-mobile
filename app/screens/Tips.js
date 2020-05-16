import React, { useRef } from "react";
import { View } from 'react-native';
import { Linking } from 'react-native';
import { WebView } from "react-native-webview";
import { STRINGS } from "../assets/constants";

/*
 * Tips page.
 * Embeds a Google Form whose URL is hardcoded in STRINGS.TIPS_FORM_URL.
 * This same Google Form also shows up at https://www.stanforddaily.com/tips/
 */
export default () => {
  const webview = useRef();
  return (<View style={{ flex: 1}}><WebView
    ref={webview}
    source={{ uri: STRINGS.TIPS_FORM_URL }}
    onNavigationStateChange={(event) => {
      // Open all links in a new window, except for the "Submit another response" link:
      if (!event.url.startsWith(STRINGS.TIPS_FORM_URL_PREFIX)) {
        webview.current.stopLoading();
        Linking.openURL(event.url);
      }
    }}
  />
  </View>);
}