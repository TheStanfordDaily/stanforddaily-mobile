import React from "react"
import { StyleSheet, View } from "react-native"
import { Card, List, Text } from "@ui-kitten/components"

export default function Culture(props) {
    const Header = (props) => (
        <React.Fragment>
            <Image
                source={{ uri: props.uri }}
                style={{ flex: 1, height: 192 }}
            />
            <Text category={"h6"}>{props.title}</Text>
        </React.Fragment>
    )

    const Footer = (props) => (
        <View style={styles.footer}>
            <Text>{props.byline}</Text>
            <Text>{moment(new Date(props.date))}</Text>
        </View>
    )

    const renderItem = (item) => (
        <Card
            style={styles.card}
            status={"basic"}
            header={<Header uri={"https://stanforddaily.com/wp-content/uploads/2022/05/farewell-v12-5-11-2022.png?w=800"}/>}
            footer={<Footer byline={item.parsely.meta.creator} date={item.date}/>}
        >
            <Text>{item["_embedded"].excerpt.rendered}</Text>
        </Card>
    )
    
    return (
        <View style={{ flex: 1 }}>
        <List
            contentContainerStyle={styles.listContainer}
            data={props.articles}
            renderItem={renderItem}
        />
        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    card: {
        marginVertical: 4
    },
    listContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4
    }
})