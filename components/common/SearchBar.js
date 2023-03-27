import React from 'react'
import { StyleSheet, Dimensions, TouchableOpacity, View } from 'react-native'
import { Icon, Input, useTheme } from '@ui-kitten/components'
import { Spacing } from '../../utils/constants'

const { width } = Dimensions.get("window")

export default function SearchBar({ searchQuery, onChangeText, onSearch, onClose }) {
    const theme = useTheme()
    
    return (
        <Input
        autoFocus
        style={{ width: width - Spacing.medium, height: 30, backgroundColor: "white", borderRadius: 5, paddingHorizontal: Spacing.medium, alignSelf: "center" }}
        value={searchQuery}
        onChangeText={onChangeText}
        onSubmitEditing={onSearch}
        placeholderTextColor={theme === "dark" ? "white" : "black"}
        placeholder="Search for articles or topics"
        clearButtonMode="always"
        returnKeyType="search"
        accessoryRight={() => (
          <TouchableOpacity onPress={onClose}>
            <Icon name="close-outline" width={24} height={24} fill={theme === "dark" ? "white" : "black"} />
          </TouchableOpacity>
        )}
      />
    )
}

const styles = StyleSheet.create({
    searchBar: {
        paddingHorizontal: Spacing.medium,
        paddingVertical: Spacing.small,
    },
    icon: {
        width: 32,
        height: 32,
    }
})