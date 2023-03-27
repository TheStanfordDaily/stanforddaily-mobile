import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { Icon, Input, Button, useTheme } from '@ui-kitten/components';
import { Spacing } from '../../utils/constants';

const { width } = Dimensions.get("window");

export default function SearchBar({ searchQuery, onChangeText, onSearch, onClose }) {
  const theme = useTheme();
  
  return (
    <View style={{...styles.container, backgroundColor: theme === "dark" ? "#1E1E1E" : "white"}}>
      <Input
        autoFocus
        style={styles.searchBar}
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
      <Button onPress={onClose} appearance="ghost">Cancel</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: Spacing.medium
  },
  searchBar: {
    flex: 1,
    backgroundColor: "white",
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
