import React from "react"
import { Card, Layout, Text } from "@ui-kitten/components"
import { Image, View, StyleSheet } from "react-native"
import PagerView from "react-native-pager-view"
import { max } from "moment"

export const News = (props) => {

    const [selection, setSelection] = React.useState(0)
    const newsArticles = props.articles
    const CustomHeader = (props) => (
        <React.Fragment>
          <Image
            source={{ uri: props.source }}
            style={{ flex: 1, height: 192 }}
          />
        </React.Fragment>
      )
      
      
      function CustomFooter(props) {
        return (
          <View style={cardStyles.headerTextContainer}>
            <Text category="h6">{props.date}</Text>
          </View>
        )
      }

    return (
        <PagerView
            style={{ flex: 1 }}
            initialPage={0}>
            {newsArticles.map((article, index) => {
                const former = newsArticles[index]
                const latter = newsArticles[index] // if it's the first page of articles, the cards will have slightly smaller width? I don't know if that would work.
                return (
                <View collapsable={false} style={{ backgroundColor: "green", flex: 1, flexDirection: "row" }} key={index}>
                    <Card style ={{ flex: 1, height: 300, marginHorizontal: 5 }} header={<CustomHeader source={former["_embedded"]["wp:featuredmedia"][0]["media_details"].sizes.thumbnail.source_url} />}>
                        <Text>{former.title.rendered}</Text>
                    </Card>
                    {index + 1 < newsArticles.length && 

<Card style={{ flex: 1, height: 300, marginHorizontal: 5 }} header={<CustomHeader source={latter["_embedded"]["wp:featuredmedia"][0]["media_details"].sizes.thumbnail.source_url} />}>
<Text>{latter.title.rendered}</Text>
</Card>
                    }
                </View>
            )})}

        </PagerView>
    )
}

const styles = StyleSheet.create({
    tab: {
        height: 192,
        alignItems: 'center',
        justifyContent: 'center',
      },
})