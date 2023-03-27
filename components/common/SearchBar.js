import React from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, View } from 'react-native';
import { Icon, Input, Button, useTheme } from '@ui-kitten/components';
import { Spacing } from '../../utils/constants';
import { ThemeContext } from '../../theme-context';

const { width } = Dimensions.get("window");

export default function SearchBar({ searchQuery, onChangeText, onSearch, onClose }) {
    const theme = useTheme();
    
    return (
        <View style={{
            flex: 1,
            width,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme === "dark" ? "#1E1E1E" : "white",
            paddingRight: Spacing.medium,
        }}>
            <Input
                autoFocus
                style={{
                    flex: 1,
                    backgroundColor: "white",
                    borderRadius: 5,
                    // paddingHorizontal: Spacing.medium,
                    // marginRight: Spacing.medium,
                }}
                value={searchQuery}
                onChangeText={onChangeText}
                onSubmitEditing={onSearch}
                placeholderTextColor={theme === "dark" ? "white" : "black"}
                placeholder="Search for articles or topics"
                returnKeyType="search"
                onTouchCancel={onClose}
                clearButtonMode="while-editing"
            />
            <Button onPress={onClose} appearance="ghost">Cancel</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        paddingHorizontal: Spacing.medium,
        paddingVertical: Spacing.small,
    },
    icon: {
        width: 32,
        height: 32,
    },
});
