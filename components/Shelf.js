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
            style={{ flex: 1/3, width: 45,  height: 60, borderRadius: 3 }}
        />
    )
    const activeColor = withAlpha(theme["color-primary-100"], 0.5) // theme[props.alternate ? "color-primary-300" : "color-basic-200"]
    const inactiveColor = theme[props.alternate ? "color-primary-100" : "color-basic-100"]
    return (
        <PagerView
        style={styles.container}
            initialPage={0}>
            {_.chunk(opinionsArticles, 3).map((triplet, index) => (
                <View collapsable={false} style={{ flex: 1, flexDirection: "column" }} key={index}>
                    {triplet.map((item, itemIndex) => (
                        <React.Fragment>
                            <ListItem
                                title={() => <Text category={"p1"}>{cellPressed ? "pressed": "not pressed"}</Text>}
                                description={() => <Text category={"label"}>Scoop Scooperstein on June 13, 2022</Text>}
                                accessoryRight={<Accessory uri={item["_embedded"]["wp:featuredmedia"][0]["media_details"].sizes.thumbnail["source_url"]} />}
                                style={{
                                    flex: 1/3,
                                    paddingHorizontal: 10,
                                    paddingVertical: 10,
                                    backgroundColor: cellPressed.booleanValue &&
                                        itemIndex === cellPressed.itemIndex &&
                                        index === cellPressed.index ?
                                        activeColor : inactiveColor
                                }}
                                onPressIn={() => setCellPressed({index: index, itemIndex: itemIndex, booleanValue: true})}
                                onPressOut={() => setCellPressed({index: index, itemIndex: itemIndex, booleanValue: false})}
                            />
                            <Divider />
                        </React.Fragment>
                    ))}
                    
                    {/* <List
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                        data={triplet}
                        renderItem={({ item }) => (
                            <ListItem
                                title={decode(item.title.rendered)}
                                description={`Scoop Scooperstein on ${item.date}`}
                                // Adding the background color prop seems to erase the effect of the cells turning light grey when you tap on them.
                                style={{ flex: 1/3 }}
                                accessoryRight={<Accessory uri={item["_embedded"]["wp:featuredmedia"][0]["media_details"].sizes.thumbnail["source_url"]} />}
                                collapsable={false}
                            />
                        )}
                        ItemSeparatorComponent={Divider}
                        style={{ flex: 1 }}
                    /> */}
                </View>
            ))}
        </PagerView>
    )
}

function withAlpha(hex, opacity) {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return hex + _opacity.toString(16).toUpperCase();
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 250,
        paddingHorizontal: 8,
        padddingVertical: 4,
    }
})