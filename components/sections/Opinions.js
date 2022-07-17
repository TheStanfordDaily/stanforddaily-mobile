import React from "react"
import { View, StyleSheet, Text, Image } from "react-native"
import { Button, ListItem } from "@ui-kitten/components"
import PagerView from "react-native-pager-view"
import { decode } from "html-entities"
import _ from "lodash"

export default function Opinions(props) {

    var opinionsArticles = props.articles
    while (opinionsArticles.length % 3 != 0) {
        opinionsArticles.pop()
    }
    
    const Accessory = (props) => (
        <Image
            source={{ uri: "https://stanforddaily.com/wp-content/uploads/2021/12/Stanford_Farm_4.jpg?w=800" }}
            style={{ flex: 1, height: 192 }}
        />
    )
    return (
        <PagerView
            style={styles.container}
            initialPage={0}>
            <View collapsable={false} style={{ flex: 1, flexDirection: "row" }}>
            {_.chunk(opinionsArticles, 3).map((triplet) => 
                triplet.map((article) => {(
                    <ListItem
                        title={decode(article.title.rendered)}
                        description={"Scoop Scooperstein"}
                        accessoryRight={<Accessory />}
                    />
                )})
            )}
            </View>
        </PagerView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 300,
        paddingHorizontal: 8,
        padddingVertical: 4
    }
})