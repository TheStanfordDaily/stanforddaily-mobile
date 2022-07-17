import React from "react"
import { View, StyleSheet, Image } from "react-native"
import { Button, Divider, Layout, List, ListItem, Text, useTheme } from "@ui-kitten/components"
import PagerView from "react-native-pager-view"
import { decode } from "html-entities"
import _ from "lodash"

export default function Opinions(props) {

    var opinionsArticles = props.articles
    while (opinionsArticles.length % 3 != 0) {
        opinionsArticles.pop()
    }
    const theme = useTheme()
    
    const Accessory = (props) => (
        <Image
            source={{ uri: props.uri }}
            style={{ flex: 1/3, width: 45,  height: 60, borderRadius: 3 }}
        />
    )
    return (
        <PagerView
        style={styles.container}
            initialPage={0}>
            {_.chunk(opinionsArticles, 3).map((triplet) => (
                <List
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    data={triplet}
                    renderItem={({ item }) => (
                        <ListItem
                            title={decode(item.title.rendered)}
                            description={`Scoop Scooperstein on ${item.date}`}
                            // Adding the background color prop seems to erase the effect of the cells turning light grey when you tap on them.
                            style={{ flex: 1/3, backgroundColor: theme[props.alternate ? "color-primary-100" : "color-basic-100"] }}
                            accessoryRight={<Accessory uri={item["_embedded"]["wp:featuredmedia"][0]["media_details"].sizes.thumbnail["source_url"]} />}
                        />
                    )}
                    ItemSeparatorComponent={Divider}
                    style={{ flex: 1 }}
                />
            ))}
        </PagerView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 249,
        paddingHorizontal: 8,
        padddingVertical: 4,
    }
})