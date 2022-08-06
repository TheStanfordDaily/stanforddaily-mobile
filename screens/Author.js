import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, FlatList } from 'react-native';
import { Card, Layout, List, Tab, TabBar, Text } from '@ui-kitten/components';
import { Margins } from '../constants';
import Model from "../Model";
import { decode } from "html-entities";
import { formatDate } from '../helpers/format';

export default function Author({ route, navigation }) {
    const { name, id } = route.params
    const [pageNumber, setPageNumber] = useState(1)
    const [articles, setArticles] = useState([])
    const [articlesLoading, setArticlesLoading] = useState(true)

    const checkBottom = (e) => {
        let paddingToBottom = 10;
        paddingToBottom += e.nativeEvent.layoutMeasurement.height;
        if (e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
          setPageNumber(pageNumber + 1)
        }
    }

    const Header = ({ uri }) => (
        <ImageBackground source={{ uri: uri }} style={{ height: 140 }} />
    )

    useEffect(() => {
        setArticlesLoading(true)
        Model.posts().param("coauthors", id).page(pageNumber).get().then(posts => {
          setArticles([...articles, ...posts])
          setArticlesLoading(false)
        }).catch(error => {
            console.log(error)
            setArticlesLoading(false)
        })
      }, [pageNumber])

    return (
        <Layout>
            <List
                data={articles}
                numColumns={2}
                onScroll={checkBottom}
                onEndReached={() => setPageNumber(pageNumber + 1)}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                    <Card onPress={() => navigation.navigate("Post", { article: item })} style={{ flex: 1/2 }} header={() => <Header uri={item["jetpack_featured_media_url"]} />}>
                        <Text category="p1">{decode(item.title.rendered)}</Text>
                        <Text category="label">{formatDate(new Date(item.date), false)}</Text>
                    </Card>
                )}
                ListFooterComponent={() => articlesLoading && <ActivityIndicator />}
            />
        </Layout>
    )
}