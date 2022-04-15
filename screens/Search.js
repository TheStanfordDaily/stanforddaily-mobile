import React, { useEffect, useState } from 'react'
import { Image, Text, Platform } from 'react-native'
import { SearchBar } from 'react-native-elements'

export default function Search(props) {
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // props.navigation.setOptions({headerTitle: () => (<SearchBar style={{ width: 400 }} placeholder={"Type something here..."} />)})
        props.navigation.setOptions({
            headerSearchBarOptions:  () => (<SearchBar style={{ width: 400 }} placeholder={"Type something here..."} />)
        })
    })

    return <SearchBar placeholder={"Search for..."} value={searchQuery} onChangeText={(query) => setSearchQuery(query)}/>
}