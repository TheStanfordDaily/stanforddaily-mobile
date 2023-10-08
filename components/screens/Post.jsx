import IframeRenderer, { iframeModel } from "@native-html/iframe-plugin";
import { useHeaderHeight } from "@react-navigation/elements";
import { Button, Text, useTheme } from "@ui-kitten/components";
import * as Device from "expo-device";
import { StatusBar } from "expo-status-bar";
import { decode } from "html-entities";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, Linking, PixelRatio, StyleSheet, View, useColorScheme } from "react-native";
import { ImageHeaderScrollView } from "react-native-image-header-scroll-view";
import Content, { defaultSystemFonts, useInternalRenderer } from "react-native-render-html";
import WebView from "react-native-webview";

import { ThemeContext } from "../../theme-context";
import { Fonts, Spacing } from "../../utils/constants";
import { formatDate } from "../../utils/format";
import Model from "../../utils/model";
import Byline from "../common/Byline";

const { width } = Dimensions.get("window");
const pixelRatio = PixelRatio.get();
const fontScale = PixelRatio.getFontScale();
const systemFonts = [...Object.keys(Fonts.minion).map((key) => String(key)), ...defaultSystemFonts];

/**
 * Displays a Stanford Daily article with rich text, recirculatory navigation and custom renderers.
 * It also allows for opening URLs from the article in a web view.
 * @component
 */
export default function Post({ route, navigation }) {
  const { article, sourceName } = route.params;
  const featuredMedia = `${article["jetpack_featured_media_url"]}?w=${pixelRatio * width}`;
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const publicationDate = new Date(article.date);
  const authors = article.parsely?.meta?.creator?.reduce((o, name, index) => {
    return { ...o, [name]: article.coauthors[index] };
  }, {});
  const [displayCategory, setDisplayCategory] = useState({});
  const { deviceType } = useContext(ThemeContext);
  const headerHeight = useHeaderHeight();
  const contentEdgeInset = deviceType === Device.DeviceType.PHONE ? 14 : 56;
  const [statusBarStyle, setStatusBarStyle] = useState("light");

  const openArticleIfPresent = (url) => {
    const pruned = url.slice(-1) === "/" ? url.slice(0, -1) : url;
    const slug = pruned.split("/").at(-1);

    if (url.match(/stanforddaily.com\/\d{4}\/\d{2}\/\d{2}\/(.*)/)) {
      // Hopefully this doesn't take too long to load. Might have to preload.
      Model.posts()
        .slug(slug)
        .embed()
        .then((result) => {
          if (result.length > 0) {
            navigation.push("Post", { article: result[0], sourceName: "Stanford Daily" });
          }
        })
        .catch((error) => console.trace(error));
    } else {
      Linking.openURL(url);
    }
  };

  const renderers = {
    // Note: Chrome URL protocol causes a crash with the renderer below.
    // iframe: IframeRenderer,
    em: (props) => (
      <Text {...props} style={{ fontFamily: "MinionProIt", fontSize: props?.tnode?.styles?.nativeTextFlow?.fontSize }}>
        {props?.tnode?.init?.textNode?.data}
      </Text>
    ),
    strong: (props) => (
      <Text
        {...props}
        style={{ fontFamily: "MinionProBold", fontSize: props?.tnode?.styles?.nativeTextFlow?.fontSize }}
      >
        {props?.tnode?.init?.textNode?.data}
      </Text>
    ),
    // h4: (props) => <Text {...props} category="h4">{props.tnode.children[0].children[0].init.textNode.data}</Text>,
  };

  const customHTMLElementModels = {
    iframe: iframeModel,
  };

  const Foreground = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        category={deviceType === Device.DeviceType.PHONE ? "h4" : "h2"}
        style={{ ...styles.hoveringText, paddingHorizontal: deviceType === Device.DeviceType.PHONE ? 20 : 60 }}
      >
        {decode(article.title.rendered)}
      </Text>
      {article["wps_subtitle"]?.length > 0 && (
        <Text
          category="s1"
          style={{
            ...styles.hoveringText,
            fontFamily: "MinionProBoldIt",
            marginTop: 10,
            paddingHorizontal: deviceType === Device.DeviceType.PHONE ? 20 : 60,
          }}
        >
          {article["wps_subtitle"]}
        </Text>
      )}
    </View>
  );

  useEffect(() => {
    Promise.all(article.categories.map((category) => Model.categories().embed().id(category).get())).then((p) => {
      const resolvedCategory = p.filter((q) => q.name === article.parsely.meta.articleSection)[0];
      setDisplayCategory(resolvedCategory);
    });

    navigation.addListener("focus", () => {
      setStatusBarStyle("light");
    });

    navigation.addListener("blur", () => {
      setStatusBarStyle(undefined);
    });
  }, [article, navigation]);

  return (
    <>
      <StatusBar style={statusBarStyle} />
      <ImageHeaderScrollView
        headerImage={{ uri: featuredMedia }}
        renderForeground={Foreground}
        maxOverlayOpacity={0.75}
        minOverlayOpacity={0.6}
        minHeight={headerHeight}
        maxHeight={headerHeight + featuredMedia ? 270 : 0}
        fadeOutForeground
        scrollViewBackgroundColor={theme["background-basic-color-1"]}
      >
        <View
          style={{
            flex: 1,
            marginHorizontal: contentEdgeInset,
            paddingTop: deviceType === Device.DeviceType.PHONE ? undefined : Spacing.large,
            paddingBottom: Spacing.large,
          }}
        >
          {article["_embedded"]?.["wp:featuredmedia"]?.[0]?.caption && (
            <Text style={{ paddingTop: Spacing.medium }} category="s1">
              {decode(article["_embedded"]?.["wp:featuredmedia"]?.[0]?.caption.rendered.slice(3, -5))}
            </Text>
          )}
          <Byline
            authors={authors}
            section={article.parsely.meta.articleSection}
            sourceName={sourceName}
            category={displayCategory}
            date={formatDate(publicationDate, true)}
            navigation={navigation}
          />
          <Content
            source={{ html: article.content.rendered }}
            defaultTextProps={{ selectable: true }}
            customHTMLElementModels={customHTMLElementModels}
            systemFonts={systemFonts}
            contentWidth={width}
            baseStyle={{
              fontFamily: "MinionProRegular",
              fontSize: 20 * fontScale,
              color: theme["text-basic-color"],
              backgroundColor: theme["background-basic-color-1"],
            }}
            tagsStyles={{ a: { color: theme["color-primary-500"], textDecorationLine: "none" } }} // The font color is slightly off in Dark Mode.
            renderers={renderers}
            renderersProps={{ a: { onPress: (e, href) => openArticleIfPresent(href) } }}
            WebView={WebView}
            backgroundColor={theme["background-color-basic-2"]}
            enableExperimentalMarginCollapsing
          />
        </View>
      </ImageHeaderScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  hoveringText: {
    color: "white",
    marginTop: 20,
    textShadowColor: "black",
    textShadowRadius: 1,
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textAlign: "center",
    fontFamily: "MinionProBold",
  },
});
