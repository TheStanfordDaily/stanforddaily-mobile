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
        // style={{...styles.container, flex: 0.9, backgroundColor: theme === "dark" ? "#1E1E1E" : "white"}}
        style={{ ...styles.container, backgroundColor: theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.05)" }}
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
    width: width*0.8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "flex-start",
    paddingLeft: Spacing.medium
  },
  inputText: {
    marginHorizontal: 0
  },
  icon: {
    width: 32,
    height: 32
  }
})
