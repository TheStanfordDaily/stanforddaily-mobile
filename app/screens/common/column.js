import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList
} from 'react-native';
import moment from 'moment';
import "moment-timezone";
import _ from "lodash";
import HTML from '../../HTML';
import Carousel from 'react-native-snap-carousel';
import styles from '../styles/column-style';
import Separator from './Separator';

const { width, height } = Dimensions.get('window');
export const formatDate = post => moment.utc(post.postDateGmt).tz("America/Los_Angeles").toDate().toLocaleDateString();
export const getThumbnailURL = ({thumbnailInfo}) => thumbnailInfo ? (thumbnailInfo.urls.mediumLarge || thumbnailInfo.urls.full): null;
export const formatAuthors = ({tsdAuthors}) => (tsdAuthors || []).map(e => e.displayName).join(", ");

export default class Column extends Component {

    toPost() {
        this.props.onPress();
      }
    
      toAuthor() {
        this.props.onAuthorPress(authorID);
      }

    render() {
        const { item } = this.props;
        return (
                <FlatList
                    style={styles.videos_flatList}
                    data={item}
                    renderItem={({ item, index }) => (
                        <TouchableWithoutFeedback onPress={this.toPost.bind(this)}>
                            <View style={{flexDirection: 'column'}}>
                                <View style={{flexDirection: 'row', width: width}}>
                                    {getThumbnailURL(item) && (
                                        <View style={{padding: 10}}>
                                            <Image resizeMode={'cover'} source={{ uri: getThumbnailURL(item) }} style={{width: width/3, height: 3/4 * width/3}} borderRadius={8} />
                                        </View>)
                                    }
                                    <View style={{flexShrink: 1}}>
                                        <Text style={styles.titleContainer}>{item.postTitle}</Text>
                                        <Text style={styles.author}> {formatAuthors(item).toUpperCase()} • {formatDate(item)} </Text>
                                        {index != 2 && (
                                            <Separator />
                                        )}
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    scrollEnabled={false}
                />
          );

    }
}