import React from 'react';
import { StyleSheet, Dimensions, TextInput, View } from 'react-native';
import { Icon, Input, Button, useTheme } from '@ui-kitten/components';
import { Spacing } from '../../utils/constants';

const { width } = Dimensions.get("window");

export default function SearchBar({ searchQuery, onChangeText, onSearch, onClose }) {
  const theme = useTheme();
  
  return (
      <TextInput
        autoFocus
        style={{...styles.container, flex: 0.9, backgroundColor: theme === "dark" ? "#1E1E1E" : "white"}}
        value={searchQuery}
        onChangeText={onChangeText}
        onSubmitEditing={onSearch}
        placeholderTextColor={theme === "dark" ? "white" : "black"}
        placeholder="Search for articles or topics"
        returnKeyType="search"
        onTouchCancel={onClose}
        clearButtonMode="while-editing"
        textStyle={styles.inputText}
      />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "flex-start",
    // paddingRight: Spacing.medium
  },
  searchBar: {
    flex: 1,
    borderRadius: 5
  },
  inputText: {
    marginHorizontal: 0
  },
  icon: {
    width: 32,
    height: 32
  }
})
