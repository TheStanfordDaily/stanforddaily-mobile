import React from "react"
import { Card, Layout, Text } from "@ui-kitten/components"
import { Image, View, StyleSheet } from "react-native"
import PagerView from "react-native-pager-view"
import moment from "moment"
import _ from "lodash"
import { decode } from "html-entities"

export const News = (props) => {

    const [selection, setSelection] = React.useState(0)
    let newsArticles = props.articles.length % 2 == 0 ? props.articles : props.articles.slice(0, -1)
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
          <View style={styles.headerTextContainer}>
            <Text category="h6">{moment(new Date(props.date)).fromNow().toUpperCase()}</Text>
          </View>
        )
      }
      

    return (
        <PagerView
            style={{ flex: 1 }}
            initialPage={0}>
            {_.chunk(newsArticles, 2).map((pair, index) => {
                const former = pair[0]
                const latter = pair[1] // if it's the first page of articles, the cards will have slightly smaller width? I don't know if that would work.
                console.log(former, latter)
                return (
                <View collapsable={false} style={{ flex: 1, flexDirection: "row" }} key={index}>
                    <Card
                        style ={{ flex: 1, height: 300, marginHorizontal: 5 }}
                        header={<CustomHeader source={former["_embedded"]["wp:featuredmedia"][0]["media_details"].sizes.thumbnail.source_url} />}
                        footer={<CustomFooter date={former.date} />}>
                        <Text>{decode(former.title.rendered)}</Text>
                    </Card>

                    <Card
                        style={{ flex: 1, height: 300, marginHorizontal: 5 }}
                        header={<CustomHeader source={latter["_embedded"]["wp:featuredmedia"][0]["media_details"].sizes.thumbnail.source_url} />}
                        footer={<CustomFooter date={latter.date} />}>
                        <Text>{decode(latter.title.rendered)}</Text>
                    </Card>
                    
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
      card: {
        flex: 1,
        margin: 2
      },
      headerTextContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10
      },
      headerImage: {
        width: 300,
        height: 200,
      },
      footerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 20,
      },
      footerControl: {
        marginHorizontal: 4,
      },
})