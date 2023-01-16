import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Input } from '@ui-kitten/components';

export default function SearchBar({ navigation, value, onChangeText, onSearch }) {
    return (
        <View style={styles.searchBar}>
            <Input placeholder="Search"  />
            {/* TODO: add accessoryLeft={SearchIcon} */}
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {

    }
})