import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import Cell from '../components/Cell';
import { getCategoryPageAsync } from '../helpers/wpapi';

export default function Category(props) {


    const renderItem = ({item}) => {
        return (
            <Cell 
                item={item}
                onPress={()=> props.navigation.navigate('Post', {item: item})}
            />
        );
    };

    getCategoryPageAsync(32278, 2).then(result => {
      console.log(result)
    })
    

    const { title, data } = props.route.params;
    props.navigation.setOptions({title: title})
    return (
        
        <View style={styles.container}>
        <FlatList 
            data={data}
            renderItem={renderItem}
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