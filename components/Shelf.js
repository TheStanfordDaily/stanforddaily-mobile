import React, { useState } from "react"
import { View, StyleSheet, Image } from "react-native"
import { Divider, ListItem, Text, useTheme } from "@ui-kitten/components"
import PagerView from "react-native-pager-view"
import { decode } from "html-entities"
import _ from "lodash"
import { formatDate, itemize } from "../helpers/format"
import * as Device from "expo-device"

export default function Shelf(props) {
    const theme = useTheme()
    const inactiveColor = theme[props.alternate ? "color-primary-600" : "background-color-basic-2"]
    const [groupSize, setGroupSize] = useState(2)
    Device.getDeviceTypeAsync().then(result => setGroupSize(result === "PHONE" ? 1 : 2))

    var opinionsArticles = props.articles
    while (opinionsArticles.length % 3 != 0) {
        opinionsArticles.pop()
    }
    
    const Accessory = (props) => (
        <Image source={{ uri: props.uri + "?w=200" }} style={styles.image} />
    )

    return (
        <PagerView style={[styles.container, { backgroundColor: inactiveColor }]} initialPage={0} overdrag>
            {_.chunk(opinionsArticles, 3 * groupSize).map((triplet, index) => (
                <View style={{ flex: 1, flexDirection: "row" }}>
                    {_.chunk(triplet, 3).map((group, outerIndex) => (<View collapsable={false} style={{ flex: 1, flexDirection: "column" }} key={outerIndex}>
                    {group.map((item) => (
                        <React.Fragment>
                            <ListItem
                                title={() => <Text numberOfLines={4} ellipsizeMode="tail" style={{ paddingHorizontal: 4, fontSize: 18, color: props.alternate ? "white" : theme["text-basic-color"] }} allowFontScaling category={"p1"}>{decode(item.title.rendered)}</Text>}
                                description={() => <Text style={{ paddingHorizontal: 4, fontSize: 14, color: props.alternate ? "white" : theme["text-basic-color"] }} category={"p2"}>{itemize(item.parsely.meta.creator)} on {formatDate(new Date(item.date), false).split(",")[0]}</Text>}
                                accessoryRight={<Accessory uri={item["jetpack_featured_media_url"]} />}
                                style={{
                                    flex: 1/3,
                                    paddingHorizontal: 10,
                                    paddingVertical: 10,
                                    backgroundColor: theme[props.alternate ? "color-primary-600" : "background-basic-color-1"]
                                }}
                                {...{...props, activeOpacity: 0.8, onPress: () => props.navigation.navigate("Post", { article: item })}}
                            />
                            <Divider />
                        </React.Fragment>
                    ))}
                </View>))}
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
        padddingVertical: 4
    },
    image: {
        flex: 1/3,
        width: 45,
        height: 60,
        borderRadius: 3,
        marginLeft: 4
    }
})