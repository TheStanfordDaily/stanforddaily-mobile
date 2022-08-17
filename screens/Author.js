import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ImageBackground, FlatList, PixelRatio, StatusBar, StyleSheet } from 'react-native';
import { Card, Layout, List, Tab, TabBar, Text } from '@ui-kitten/components';
import { Margins, Spacing } from '../constants';
import Model from "../Model";
import { decode } from "html-entities";
import { formatDate, stringMode } from "../helpers/format";
import * as Device from "expo-device";
import { deviceType } from '../App';

const { width, height } = Dimensions.get('window')
const pixelRatio = PixelRatio.get()

export default function Author({ route, navigation }) {
    const { name, id } = route.params
    const [pageNumber, setPageNumber] = useState(1)
    const [articles, setArticles] = useState([])
    const [articlesLoading, setArticlesLoading] = useState(true)
    const [authorDetail, setAuthorDetail] = useState(null)
    const [possiblyReachedEnd, setPossiblyReachedEnd] = useState(false)
    const groupSize = deviceType() === Device.DeviceType.PHONE ? 2 : 3

    const Header = ({ uri }) => (
        // There might be a better way to do this: https://reactnative.dev/docs/pixelratio
        <ImageBackground source={{ uri: `${uri}?w=${width*pixelRatio/groupSize}` }} style={{ height: 140 }} />
    )

    useEffect(() => {
        setArticlesLoading(true)
        
        if (!possiblyReachedEnd) {
            Model.posts().param("coauthors", id).page(pageNumber).param("_embed", pageNumber === 1).get().then(posts => {
                setArticles([...articles, ...posts])
                setArticlesLoading(false)
                if (pageNumber === 1) {
                    const descriptions = posts.map(post => post["_embedded"].author.map(a => a.description).reduce((p, q) => p + q))
                    setAuthorDetail(stringMode(descriptions))
                }
            }).catch(error => {
                console.log(error)
                setPossiblyReachedEnd(true)
            })
        }
        
        setArticlesLoading(false)

        // FIXME: Not all of the asynchronous tasks are being canceled, so there needs to be a cleanup function to avoid a memory leak.
    }, [pageNumber])

    return (
        <Layout style={styles.container}>
            <List
                data={articles}
                numColumns={groupSize}
                key={groupSize}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={1}
                onEndReached={() => {
                    if (!articlesLoading) {
                        setPageNumber(pageNumber + 1)
                    }
                }}
                renderItem={({ item }) => (
                    <Card key={item.id} onPress={() => navigation.navigate("Post", { article: item })} style={{ flex: 1/groupSize }} header={() => <Header uri={item["jetpack_featured_media_url"]} />}>
                        <Text category="p1">{decode(item.title.rendered)}</Text>
                        <Text category="label">{formatDate(new Date(item.date), false)}</Text>
                    </Card>
                )}
                ListFooterComponent={() => !possiblyReachedEnd && <ActivityIndicator />}
            />
        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})