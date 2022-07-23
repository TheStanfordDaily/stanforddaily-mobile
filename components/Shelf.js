import React from "react"
import { View, StyleSheet, Image } from "react-native"
import { Divider, ListItem, Text, useTheme } from "@ui-kitten/components"
import PagerView from "react-native-pager-view"
import { decode } from "html-entities"
import _ from "lodash"

export default function Shelf(props) {
    var opinionsArticles = props.articles
    while (opinionsArticles.length % 3 != 0) {
        opinionsArticles.pop()
    }
    
    const Accessory = (props) => (
        <Image
            source={{ uri: props.uri }}
            style={styles.image}
        />
    )

    const theme = useTheme()
    const inactiveColor = theme[props.alternate ? "color-primary-200" : "background-color-basic-2"]
    
    return (
        <PagerView style={[styles.container, { backgroundColor: inactiveColor }]} initialPage={0} overdrag>
            {_.chunk(opinionsArticles, 3).map((triplet, index) => (
                <View collapsable={false} style={{ flex: 1, flexDirection: "column" }} key={index}>
                    {triplet.map((item) => (
                        <React.Fragment>
                            <ListItem
                                title={() => <Text style={{ paddingHorizontal: 4 }} category={"p1"}>{decode(item.title.rendered)}</Text>}
                                description={() => <Text style={{ paddingHorizontal: 4 }} category={"p2"}>Scoop Scooperstein on June 13</Text>}
                                accessoryRight={<Accessory uri={item["jetpack_featured_media_url"]} />}
                                style={{
                                    flex: 1/3,
                                    paddingHorizontal: 10,
                                    paddingVertical: 10,
                                    backgroundColor: theme[props.alternate ? "color-primary-100" : "background-basic-color-1"]
                                }}
                                {...{...props, activeOpacity: 0.8, onPress: () => props.navigation.navigate("Post", { article: item })}}
                            />
                            <Divider/>
                        </React.Fragment>
                    ))}
                </View>
            ))}
        </PagerView>
    )
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