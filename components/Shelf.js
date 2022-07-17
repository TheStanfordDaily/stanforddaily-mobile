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
    const [cellPressed, setCellPressed] = React.useState({})
    const Accessory = (props) => (
        <Image
            source={{ uri: props.uri }}
            style={styles.image}
        />
    )
    const activeColor = props.alternate ? withAlpha(theme["color-primary-100"], 0.5) : theme["color-basic-200"]
    const inactiveColor = theme[props.alternate ? "color-primary-100" : "color-basic-100"]
    
    return (
        <PagerView
            style={styles.container}
            initialPage={0}
            overdrag>
            {_.chunk(opinionsArticles, 3).map((triplet, index) => (
                <View collapsable={false} style={{ flex: 1, flexDirection: "column" }} key={index}>
                    {triplet.map((item, _index) => (
                        <React.Fragment>
                            <ListItem
                                title={() => <Text style={{ paddingHorizontal: 4 }} category={"p1"}>{decode(item.title.rendered)}</Text>}
                                description={() => <Text style={{ paddingHorizontal: 4 }} category={"p2"}>Scoop Scooperstein on June 13</Text>}
                                accessoryRight={<Accessory uri={item["_embedded"]["wp:featuredmedia"][0]["media_details"].sizes.thumbnail["source_url"]} />}
                                style={{
                                    flex: 1/3,
                                    paddingHorizontal: 10,
                                    paddingVertical: 10,
                                    backgroundColor: cellPressed.booleanValue &&
                                        _index === cellPressed._index &&
                                        index === cellPressed.index ?
                                        activeColor : inactiveColor
                                }}
                                onPressIn={() => setCellPressed({ index: index, _index: _index, booleanValue: true })}
                                onPressOut={() => setCellPressed({ index: index, _index: _index, booleanValue: false })}
                            />
                            <Divider />
                        </React.Fragment>
                    ))}
                </View>
            ))}
        </PagerView>
    )
}

// Assumes a white background.
function withAlpha(hex, opacity) {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return hex + _opacity.toString(16).toUpperCase();
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 300,
        paddingHorizontal: 8,
        padddingVertical: 4,
    },
    image: {
        flex: 1/3,
        width: 45,
        height: 60,
        borderRadius: 3,
        marginLeft: 4
    }
})