import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, useTheme } from '@ui-kitten/components'
import { Spacing } from '../constants'

export default function SearchBar({ navigation, value, onChangeText, onSearch }) {
    const theme = useTheme()
    
    return (
        <View style={{...styles.searchBar, backgroundColor: theme["background-basic-color-1"]}}>
            <Input placeholder="Search"  />
            {/* TODO: add accessoryLeft={SearchIcon} */}
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        paddingHorizontal: Spacing.medium,
        paddingVertical: Spacing.small
    }
})