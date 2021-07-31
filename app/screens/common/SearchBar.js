import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

export default class SearchBar extends Component {

    render() {
        return (
            <View style={styles.searchBarContainer}>
                <TextInput
                ref={c => this.searchInput = c}
                style={styles.searchBar}
                placeholder={"Search..."}
                clearButtonMode="while-editing"
                placeholderTextColor="#919188"
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                keyboardType="email-address"
                // onChangeText={t => this.setState({ searchText: t })}
                // value={searchText}
                maxLength={100}
                returnKeyType='search'
                // onSubmitEditing={() => onSearch?.(this.state.searchText)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    noData: {
        alignSelf: "center",
        textAlign: "center",
        marginTop: 20 
    },
    searchBarContainer: {
        justifyContent: "center",
        padding: 10,
        backgroundColor: "#f2f2f2",
        width: "100%"
    },
    searchBar: {
        borderRadius: 5,
        backgroundColor: "white",
        height: 38,
        fontSize: 15,
        width: "80%",
        paddingHorizontal: 10
      },
      container: {
        flex: 1,
        height: '100%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        width: '80%',
      },
      defaultSeparator: { height: 1, width: "80%", alignSelf: "center", backgroundColor: "#f2f2f2" },
      flatList: { height: "100%", width: "100%", backgroundColor: "transparent" }
})