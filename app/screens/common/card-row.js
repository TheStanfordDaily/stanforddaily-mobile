import React, { Component, useRef } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import "moment-timezone";
import _ from "lodash";
import HTML from '../../HTML';
import styles from '../styles/card-style';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Category from '../Category';

const { width, height } = Dimensions.get('window');

export default class CardRow extends Component {  

    constructor(props) {
        super(props)
        this.state = {
            scrollPosition: 0
          }
    }

    render() {
        const { data, renderItem, title, onPress } = this.props;
        
        return (
            <View style={styles.content}>
                <FlatList
                    style={styles.videos_flatList}
                    horizontal={true}
                    data={data}
                    // snapToAlignment={"start"}
                    // snapToInterval={0.95*width/2}
                    // decelerationRate={"fast"}
                    showsHorizontalScrollIndicator={false}
                    // pagingEnabled
                    renderItem={renderItem}
                    onScroll={e => {this.setState({scrollPosition: e.nativeEvent.contentOffset.x})}}
                />
            </View>
        );
      }
}