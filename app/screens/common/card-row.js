import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList
} from 'react-native';
import "moment-timezone";
import _ from "lodash";
import HTML from '../../HTML';
import styles from '../styles/card-style';

const { width, height } = Dimensions.get('window');

export default class CardRow extends Component {
    render() {
        const { data, renderItem, title } = this.props;
        
        return (
            <View style={styles.content}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.header} html={title} />
                    <TouchableOpacity style={styles.more}>
                        <Text style={styles.titleContainer, styles.titleFont, {paddingHorizontal: 20}}>See All</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={styles.videos_flatList}
                    horizontal={true}
                    data={data}
                    snapToAlignment={"start"}
                    snapToInterval={width/2}
                    decelerationRate={"fast"}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    renderItem={renderItem}
                />
            </View>
        );
      }
}