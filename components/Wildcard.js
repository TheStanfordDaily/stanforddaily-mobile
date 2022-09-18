import React, { useContext, useEffect, useState } from "react"
import { Dimensions, StyleSheet, PixelRatio, View } from "react-native"
import { Button, Card, Text } from "@ui-kitten/components"
import { Image } from "react-native"
import _ from "lodash"
import { decode } from "html-entities"
import { ThemeContext } from "../theme-context"
import { formatDate, itemize } from "../helpers/format"
import { Spacing } from "../constants"

const { width, height } = Dimensions.get("window")
const pixelRatio = PixelRatio.get()

const Header = (props) => (
    <React.Fragment>
        <View>
            <Text style={styles.header} category="h6">{props.title}</Text>
            {props.verbose && (<Text category="p2" style={styles.date}>{formatDate(new Date(props.date))}</Text>)}
        </View>
        <Image source={{ uri: `${props.uri}?w=${width*pixelRatio}` }} style={{ flex: 1, height: 192 }} />
    </React.Fragment>
)

const Footer = (props) => (
    <View style={styles.footer}>
        <Text style={{ textAlign: "left", flex: 0.95 }} category="label">{props.byline}</Text>
        <Button size="tiny" status="basic">{decode(props.section).replace('\'', '\u{2019}')}</Button>
    </View>
)

export default function Wildcard(props) {
    const { navigation, articles, random, verbose, title, item, index } = props

    return (
        <Card
            style={styles.card}
            header={<Header verbose={verbose} title={decode(item.title.rendered)} date={item.date} uri={item["jetpack_featured_media_url"]}/>}
            footer={<Footer byline={itemize(item.parsely?.meta?.creator?.map(name => name.toUpperCase()))} section={item.parsely?.meta?.articleSection}/>}
            {...{...props, onPress: () => navigation.push("Post", { article: item, sourceName: title })}}
        >
            <Text style={{ marginHorizontal: -4 }}>{decode(item.excerpt.rendered.slice(3, -5))}</Text>
        </Card>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    date: {
        paddingHorizontal: 20,
        paddingTop: 0,
        paddingBottom: 10,
        fontFamily: undefined,
        fontWeight: "bold"
    },
    card: {
        flex: 1,
        marginHorizontal: Spacing.medium,
        marginVertical: 4
    },
    container: {
        flex: 1,
        paddingHorizontal: Spacing.medium,
        paddingVertical: 4
    }
})