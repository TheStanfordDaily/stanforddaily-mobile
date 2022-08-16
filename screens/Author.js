import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ImageBackground, FlatList, StatusBar } from 'react-native';
import { Card, Layout, List, Tab, TabBar, Text } from '@ui-kitten/components';
import { Margins, Spacing } from '../constants';
import Model from "../Model";
import { decode } from "html-entities";
import { formatDate, stringMode } from "../helpers/format";
import * as Device from "expo-device";
import { isPhone } from '../App';

export default function Author({ route, navigation }) {
    const { name, id } = route.params
    const [pageNumber, setPageNumber] = useState(1)
    const [articles, setArticles] = useState([])
    const [articlesLoading, setArticlesLoading] = useState(true)
    const [authorDetail, setAuthorDetail] = useState(null)
    const [possiblyReachedEnd, setPossiblyReachedEnd] = useState(false)
    // const [groupSize, setGroupSize] = useState(2)
    // Device.getDeviceTypeAsync().then(result => setGroupSize(result === "PHONE" ? 2 : 3))
    const groupSize = isPhone() ? 2 : 3

    const Header = ({ uri }) => (
        <ImageBackground source={{ uri: uri + "?w=300" }} style={{ height: 140 }} />
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
        <Layout>
            <List
                data={articles}
                numColumns={groupSize}
                key={groupSize}
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