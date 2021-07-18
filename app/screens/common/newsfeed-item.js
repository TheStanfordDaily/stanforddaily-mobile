import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import moment from 'moment';
import "moment-timezone";
import styles from '../styles/newsfeeditem';
import _ from "lodash";
import { MARGINS } from '../../assets/constants'

export const formatDate = post => moment.utc(post.postDateGmt).format('MMM D, YYYY');
export const getThumbnailURL = ({thumbnailInfo}) => thumbnailInfo ? (thumbnailInfo.urls.mediumLarge || thumbnailInfo.urls.full): null;
export const formatAuthors = ({tsdAuthors}) => (tsdAuthors || []).map(e => e.displayName).join(", ");
export default class NewsFeedItem extends Component {

  //Handles clicking on items
  toPost() {
    this.props.onPress();
  }

  toAuthor(authorID) {
    this.props.onAuthor(authorID);
  }  
  itemize(elements) {
    console.log(elements[-1])
    return [elements.slice(0, -1).join(", "), elements.length > 2 ? elements.last() : elements].join(" and ")
  }

  render() {
    const { item, index, slideIndex, isFeatured } = this.props;
    let groupLength = item.tsdAuthors.length
    let { postTitle } = item;
    const thumbnailURL = getThumbnailURL(item);
    const {width, height} = Dimensions.get('window');
    const full = 0.92*width;
    return (
      <TouchableWithoutFeedback onPress={this.toPost.bind(this)}>
        <View style={isFeatured && index === 0 ? styles.homeContent
        : isFeatured && index === 1 ? {...styles.homeContent, ...{width: width}}
        : isFeatured && index === 2 ? {...styles.homeContent, ...{}}
        : styles.content            
          }>
            {thumbnailURL && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: thumbnailURL }} style={isFeatured && index > 0 ? {...styles.image, ...{width: full}}: isFeatured && index === 2 ? {...styles.image, ...{marginLeft:20}} : {...styles.image, ...{}}} borderRadius={8} />
            </View>) // need to find a way to switch to normal styling for lists when it's not homes screen
          }
          {/* <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.titleFont} html={postTitle} /> */}
        <Text style={styles.titleContainer} adjustsFontSizeToFit minimumFontScale={0.75} allowFontScaling numberOfLines={3}>{postTitle}</Text>
          {/* <HTML containerStyle={styles.descriptionContainer} baseFontStyle={styles.descriptionFont} html={postExcerpt} /> */}
          <View style={styles.dateAndAuthor}>

              <Text style={{flexDirection: 'row'}, styles.author}>
              {item.tsdAuthors.map(t => <TouchableWithoutFeedback onPress = {() => this.toAuthor(t.id)}><Text>{t.displayName.toUpperCase()}</Text></TouchableWithoutFeedback>).reduce((prev, curr, ind) => [prev, ind === groupLength - 1 ? ' and ' : ', ', curr])} on {formatDate(item)}
              </Text>
            
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
