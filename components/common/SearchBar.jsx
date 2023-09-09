import { useTheme } from "@ui-kitten/components";
import React from "react";
import { StyleSheet, Dimensions, TextInput, Platform } from "react-native";

import { Spacing } from "../../utils/constants";

const { width } = Dimensions.get("window");

export default function SearchBar({ searchQuery, onChangeText, onSearch, onClose }) {
  const theme = useTheme();

  return (
    <TextInput
      autoFocus
      style={{
        ...styles.container,
        backgroundColor: theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.05)",
      }}
      value={searchQuery}
      onChangeText={onChangeText}
      onSubmitEditing={onSearch}
      placeholderTextColor={theme === "dark" ? "white" : "black"}
      placeholder="Search for articles or topics"
      returnKeyType="search"
      onTouchCancel={onClose}
      clearButtonMode="while-editing"
      textStyle={{
        ...styles.inputText,
        color: theme === "dark" ? "white" : "black",
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width * (Platform.OS === "ios" ? 0.875 : 0.8),
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: Spacing.medium,
    marginVertical: Spacing.medium,
  },
  inputText: {
    marginHorizontal: 0,
  },
  icon: {
    width: 32,
    height: 32,
  },
});
