import React, { Component, useState, useEffect } from 'react';
import { FlatList, Text } from 'react-native';
import { Margins } from '../constants';

export default function Author(props) {

    const [authorName, setAuthorName] = useState('');
    const [authorPosts, setAuthorPosts] = useState([]);
    const { authorID } = props.route.params;
    const renderItem = ({ item }) => {
        return <Text style={{ paddingHorizontal: Margins.articleSides, paddingVertical: Margins.default }}>{item.title.rendered}</Text>
    }
    var WPAPI = require('wpapi');
    var wp = new WPAPI({ endpoint:  'http://stanforddaily.com/wp-json' });

    useEffect(() => {
        wp.posts().perPage(25).author(authorID).embed().get()
        .then(posts => { setAuthorPosts(posts) });
        wp.users().id(authorID).get()
            .then( data => {
                setAuthorName(data.name)
            })
    })

    return (
        <FlatList
            data={authorPosts}
            renderItem={renderItem}
            // ItemSeparatorComponent={() => <Separator />}
            style={{ backgroundColor: 'white' }}
        />
    )
}