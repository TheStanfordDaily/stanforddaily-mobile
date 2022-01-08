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
import styles from '../styles/newsfeeditem';
import _ from "lodash";
import HTML from '../../HTML';


const { width, height } = Dimensions.get('window');

export const formatDate = post => moment.utc(post.postDateGmt).tz("America/Los_Angeles").toDate().toLocaleDateString();
export const getThumbnailURL = ({thumbnailInfo}) => thumbnailInfo ? (thumbnailInfo.urls.mediumLarge || thumbnailInfo.urls.full): null;
export const formatAuthors = ({tsdAuthors}) => (tsdAuthors || []).map(e => e.displayName).join(", ");

export default class NewsFeedItem extends Component {

  //Handles clicking on items
  toPost() {
    this.props.onPress();
  }

  toAuthor() {
    this.props.onAuthorPress(authorID);
  }

  render() {
    const { item } = this.props;
    let { title, author, excerpt, _embedded, postDate, thumbnailInfo, postSubtitle } = item;
    const thumbnailURL = _embedded["wp:featuredmedia"][0]["media_details"]["sizes"]["full"]["source_url"];
    let upperBound = _embedded.author.length
    console.log(_embedded[2])
    let authorNames = _embedded.author.map(t => t.name)
    return (
      <TouchableWithoutFeedback onPress={this.toPost.bind(this)}>
        <View style={styles.content}>
          {thumbnailURL && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: thumbnailURL }} style={styles.image} />
            </View>)
          }
          <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.titleFont} html={title.rendered} />
          {/*<HTML containerStyle={styles.descriptionContainer} baseFontStyle={styles.descriptionFont} html={postExcerpt} />*/}
          <View style={styles.dateAndAuthor}>
            <TouchableOpacity>
              <Text style={styles.author}> {_embedded.author[0].name} </Text>
            </TouchableOpacity>
            <Text style={styles.date}> {formatDate(item)} </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
