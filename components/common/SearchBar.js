import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, Input, useTheme } from '@ui-kitten/components'
import { Spacing } from '../constants'

export default function SearchBar({ navigation, value, onChangeText, onSearch }) {
    const theme = useTheme()
    
    return (
        <View style={{...styles.searchBar, backgroundColor: theme["background-basic-color-1"]}}>
            <Input placeholder="Search" accessoryRight={<Icon style={styles.icon} name="close-circle" fill={theme["text-hint-color"]} />} value={value} onChangeText={onChangeText} onSubmitEditing={onSearch} />
        </View>
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