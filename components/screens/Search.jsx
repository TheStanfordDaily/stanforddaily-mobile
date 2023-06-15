import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Keyboard, LayoutAnimation, Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Layout, List, Text } from "@ui-kitten/components";

import Wlidcard from "../common/Wildcard";
import Model from "../../utils/model";
import { ThemeContext } from "../../theme-context";
import { DeviceType } from "expo-device";
import { Spacing } from "../../utils/constants";
import Fuse from "fuse.js";
import { DailyBread as bread } from "../../theme";

const BATCH_SIZE = 24;
const { width, height } = Dimensions.get("window");

export default function Search({ route, navigation }) {
  const { deviceType, theme } = useContext(ThemeContext);
  const columnCount = deviceType === DeviceType.PHONE ? 1 : 2;

  const tintColor = theme === "dark" ? "white" : bread[theme]["color-primary-500"];
  const textColor = theme === "dark" ? "white" : bread[theme]["text-basic-color"];
  const buttonStatus = theme === "dark" ? "control" : "primary";

  const [articlesLoading, setArticlesLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [possiblyReachedEnd, setPossiblyReachedEnd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [incumbentQuery, setIncumbentQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [emptyResults, setEmptyResults] = useState(false);
  const [cancelVisible, setCancelVisible] = useState(false);

  async function handleSearch(query) {
    Keyboard.dismiss();
    if (query.match(/^\s*$/)) {
      setSearchQuery("");
      return;
    }

    setSearching(true);
    let posts;
    try {
      posts = await Model.posts().search(query).orderby("relevance").perPage(BATCH_SIZE).page(1).get();
      setArticles(posts);
    } catch (error) {
      console.log(error);
      if (error.data?.status === 400) {
        setPossiblyReachedEnd(true);
      }
    } finally {
      setPageNumber(1);
      setPossiblyReachedEnd(false);
      setEmptyResults(posts.length === 0);
      setIncumbentQuery(query);
      setSearching(false);
    }
  }

  const loadPage = useCallback(async page => {
    if (possiblyReachedEnd) {
      return;
    }

    setArticlesLoading(true);
    let posts;
    try {
      posts = await Model.posts().search(incumbentQuery).orderby("relevance").perPage(BATCH_SIZE).page(page).get();
      setArticles([...articles, ...posts]);
    } catch (error) {
      console.log(error);
      if (error.data?.status === 400) {
        setPossiblyReachedEnd(true);
      }
    } finally {
      setArticlesLoading(false);
    }
  }, [articles, incumbentQuery, possiblyReachedEnd]);

  useEffect(() => {
    setEmptyResults(false);
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: () => (
        <View style={styles.searchContainer}>
          <TextInput
            style={{ ...styles.searchInput, color: textColor }}
            onChangeText={setSearchQuery}
            value={searchQuery}
            placeholder="Search for articles or topics"
            returnKeyType="search"
            onSubmitEditing={(e) => {
              setPageNumber(1);
              handleSearch(e.nativeEvent.text);
            }}
            autoCorrect={false}
            autoFocus
            clearButtonMode="while-editing"
            onFocus={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setCancelVisible(true);
            }}
            onBlur={() => {
              Keyboard.dismiss();
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setCancelVisible(false);
            }}
          />
          {cancelVisible && (
            <TouchableOpacity onPress={Keyboard.dismiss} style={styles.cancelButton} title="Cancel">
              <Text category="label" style={{ fontSize: 16, color: tintColor }}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      ),
      headerTintColor: tintColor
    });
  }, [cancelVisible, navigation, textColor, tintColor, searchQuery]);

  useEffect(() => {
    loadPage(pageNumber);
  }, [loadPage, pageNumber]);

  return emptyResults ? (
    <Layout style={styles.empty}>
      <Text category="h6" style={{ color: theme === "dark" ? "white" : "black" }}>No results found for {`\u2018${searchQuery}.\u2019`}</Text>
    </Layout>
  ) : searching ? (
    <Layout style={styles.empty}>
      <ActivityIndicator />
    </Layout>
  ) : articles.length > 0 ? (
    <Layout style={styles.container}>
      <List
        data={articles}
        style={{ backgroundColor: "transparent" }}
        numColumns={columnCount}
        key={columnCount}
        scrollEventThrottle={BATCH_SIZE}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.25}
        onEndReached={() => {
          if (!articlesLoading && !possiblyReachedEnd) {
            setPageNumber(pageNumber + 1);
          }
        }}
        renderItem={({ item, index }) => <Wlidcard key={item.id} item={item} index={index} navigation={navigation} verbose />}
        ListFooterComponent={() => articlesLoading && <ActivityIndicator style={{ marginBottom: Spacing.large }} />}
      />
    </Layout>
  ) : (
    <Layout style={styles.empty}>
      {articles.length === 0 && route.params?.tags?.map((tag, index) => (
        <Button
          key={index}
          onPress={() => {
            setSearchQuery(tag.name);
            handleSearch(tag.name);
          }}
          appearance="ghost"
          status={buttonStatus}
          style={{ marginBottom: Spacing.medium }}
        >
          {tag.name.toUpperCase()}
        </Button>
      ))}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flex: 1,
    paddingBottom: Spacing.large
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: Spacing.medium,
    paddingRight: Spacing.large,
    width: width - (Platform.OS === "ios" ? 1 : 2.5) * Spacing.extraLarge
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 5,
    paddingHorizontal: Spacing.medium,
    paddingVertical: 5,
    marginRight: Spacing.medium
  },
  cancelButton: {
    paddingHorizontal: Spacing.medium
  }
});
