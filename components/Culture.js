import React from "react"
import { StyleSheet, View } from "react-native"
import { Button, Card, Layout, List, Text } from "@ui-kitten/components"
import { Image } from "react-native"
import _ from "lodash"
import { decode } from "html-entities"

// Going to rename this component to Wildcard.
export default function Culture(props) {

    const { navigation, articles } = props
    const cultureArticles = articles //  _.shuffle(articles[0].concat(articles[1]))
    const Header = (props) => (
        <React.Fragment>
            <Text style={styles.header} category={"h6"}>{props.title}</Text>
            <Image
                source={{ uri: props.uri }}
                style={{ flex: 1, height: 192 }}
            />
        </React.Fragment>
    )

    const Footer = (props) => (
        <View style={styles.footer}>
            <Text style={{ textAlign: "justify" }} category={"label"}>{props.byline}</Text>
            <Button size={"tiny"} status={"basic"}>{props.section}</Button>
        </View>
    )
    
    return (
        <View style={styles.container}>
            {cultureArticles.map((item) => (
                <Card
                    style={styles.card}
                    header={<Header title={decode(item.title.rendered)} uri={item["jetpack_featured_media_url"]}/>}
                    footer={<Footer byline={"Scoop Scooperstein".toUpperCase()} section={_.sample(["The Grind", "Arts & Life"])}/>}
                    {...{...props, onPress: () => navigation.navigate("Post", { article: item })}}
                >
                    <Text style={{ marginHorizontal: -4 }}>{decode(item.excerpt.rendered.slice(3, -5))}</Text>
                </Card>
            ))}
        {/* <List
            contentContainerStyle={styles.listContainer}
            data={cultureArticles}
            renderItem={renderItem}
        /> */}
        </View>
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
    card: {
        marginVertical: 4
    },
    container: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 4
    }
})