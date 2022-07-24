import React, { useEffect, useState } from 'react';
import { ImageBackground, FlatList } from 'react-native';
import { Card, Layout, List, Tab, TabBar, Text } from '@ui-kitten/components';
import { Margins } from '../constants';
import Model from "../Model";
import { decode } from "html-entities";
import { formatDate } from '../helpers/format';

const kate = require("../kate.json")

export default function Author({ route, navigation }) {
    const { name, id } = route.params
    const [pageNumber, setPageNumber] = useState(0)
    const [articles, setArticles] = useState([])
    const [index, setIndex] = useState(0)

    const Header = ({ uri }) => (
        <ImageBackground source={{ uri: uri }} style={{ height: 140 }} />
    )

    // useEffect(() => {
    //     Model.posts().param("coauthor", id).get().then(posts => {
    //       setArticles(posts)
    //     }).finally(() => setArticlesLoaded(true))
    //   }, [pageNumber])
    // with the formatted date below next time we can drop the time of day from the card

    return (
        <Layout>
            <List
                data={kate}
                numColumns={2}
                onEndReached={() => setPageNumber(pageNumber + 1)}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                    <Card style={{ flex: 1/2 }} header={() => <Header uri={item["jetpack_featured_media_url"]} />}>
                        <Text category="p1">{decode(item.title.rendered)}</Text>
                        <Text category="label">{formatDate(new Date(item.date), false)}</Text>
                    </Card>
                )}
            />
        </Layout>
    )
}