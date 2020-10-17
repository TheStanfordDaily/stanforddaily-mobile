import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import "moment-timezone";
import styles from '../styles/card-style';
import _ from "lodash";
import HTML from '../../HTML';


const { width, height } = Dimensions.get('window');

export const formatDate = post => moment.utc(post.postDateGmt).format('MMM d, yyyy');
export const getThumbnailURL = ({thumbnailInfo}) => thumbnailInfo ? (thumbnailInfo.urls.mediumLarge || thumbnailInfo.urls.full): null;
export const formatAuthors = ({tsdAuthors}) => (tsdAuthors || []).map(e => e.displayName).join(", ");

export default class Card extends Component {

  //Handles clicking on items
  toPost() {
    this.props.onPress();
  }

  toAuthor() {
    this.props.onAuthorPress(authorID);
  }

  render() {
    const { item } = this.props;
    let { postTitle, postExcerpt, postDate, thumbnailInfo, postSubtitle, tsdAuthors} = item;
    const thumbnailURL = getThumbnailURL(item);
    return (
        <TouchableWithoutFeedback onPress={this.toPost.bind(this)}>
          <View style={{width: width/2}}>
                  {thumbnailURL && (
                  <View style={{padding: 10}}>
                      <Image resizeMode={'cover'} source={{ uri: thumbnailURL }} style={{width: width/2.2, height: 3/4 * width/2.2}} borderRadius={8} />
                  </View>)
                  }
                  <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.titleFont} html={postTitle} />
            {/*<HTML containerStyle={styles.descriptionContainer} baseFontStyle={styles.descriptionFont} html={postExcerpt} />*/}
            <View style={styles.dateAndAuthor}>
              <TouchableOpacity>
                <Text style={styles.author}> {formatAuthors(item).toUpperCase()} </Text>
              </TouchableOpacity>
              <Text style={styles.date}> {formatDate(item).toUpperCase()} </Text>
            </View>
          </View>
            
        </TouchableWithoutFeedback>
    );

  }

}