import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import Cell from '../components/Cell';
import { Margins } from '../constants';
import { getCategoryPageAsync } from '../helpers/wpapi';

export default function Category(props) {

    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const renderItem = ({item}) => {
        return (
            <Cell 
                item={item}
                onPress={()=> props.navigation.navigate('Post', {item: item})}
            />
        );
    };

    const { title, data, id } = props.route.params;
    const [articles, setArticles] = useState(data)
    props.navigation.setOptions({title: title})

    const fetchNextPage = () => {
      setIsLoading(true)
      getCategoryPageAsync(id, page + 1).then(result => {
        setArticles(articles => [...articles, ...result])
        setPage(page + 1)
      })
      setIsLoading(false)
    }

    return (
        
        <View style={styles.container}>
        <FlatList 
            data={articles}
            renderItem={renderItem}
            onEndReachedThreshold={0.2}
            onEndReached={fetchNextPage}
            ListFooterComponent={<ActivityIndicator hidesWhenStopped isLoading={isLoading} />}
            ListFooterComponentStyle={{ marginBottom: Margins.defaultLarge }}
            // keyExtractor={item => item.id}
        />
        
      </View>
        
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});