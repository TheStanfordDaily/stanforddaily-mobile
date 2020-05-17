/**
 * Post Template
 */
'use strict';

//Pre-made Components imports
import React, { Component } from 'react';
import { STRINGS, KEYS, MARGINS, FONT_SIZES } from '../assets/constants.js';
import {
  View,
  StatusBar,
  ScrollView,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

//Components for this app imports
import Header from './common/header';
import * as Amplitude from 'expo-analytics-amplitude';
import { FONTS, COLORS } from "../assets/constants";
import styles from './styles/post.js';
import _ from "lodash";
import HTML from '../HTML.js';
import striptags from 'striptags';
import { getPostByIdAsync } from '../helper/wpapi.js';
import { formatAuthors, getThumbnailURL, formatDate } from './common/newsfeed-item.js';
import Placeholder from './common/placeholder.js';


const amplitude = Amplitude.initialize(KEYS.AMPLITUDE_API);
const { width, height } = Dimensions.get('window'); //Dimensions of the current device screen

class Post extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.state = {
      item: null,
      width: width <= height ? width : height,
      height: Dimensions.get('window').height,
    }
    Dimensions.addEventListener('change', () => {
      const { width, height } = Dimensions.get('window')
      this.setState({ width: width <= height ? width : height, height: height });
      // console.warn("orientation changed");
    });
  }

  //A function that triggers going back to headlines
  goBack() {
    this.props.navigation.goBack();
  }

  async componentDidMount() {
    let item = await getPostByIdAsync(this.props.navigation.state.params.postID);
    this.setState({ item });
    Amplitude.logEvent(STRINGS.ARTICLE_FULL_LOADED, { ArticleId: id })
  }

  createMarkup(text) {
    return text;
    // todo: HTML purify this if needed.
  }

  render() {
    const { item } = this.state;
    if (!item) {
      return <Placeholder />;
    }
    const { id, postTitle, postSubtitle, thumbnailInfo, postContent } = item;
    const {caption} = thumbnailInfo || {};
    const thumbnailURL = getThumbnailURL(item);
    return (
      <View style={{ flex: 1}}>
        <Header ref='postHeader' share={true} postID={id} goBack={this.goBack} />
        {!id && <ActivityIndicator />}
        {id &&
        <View style={{ flex: 1, alignItems: 'center' }}>
          <StatusBar
            barStyle="dark-content"
          />

          <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={styles.title}>
              <HTML baseFontStyle={styles.titleText} html={postTitle} />
            </View>
            {/* TODO: add subtitles */}
            {/* <View style={styles.title}>
              <HTML baseFontStyle={styles.titleText} html={postSubtitle} />
            </View> */}
            <View style={styles.authorAndDate}>
              <TouchableOpacity onPress = {()=>this.props.navigation.navigate("AuthorDetail", { id: this.state.authorID})}>
                <Text style={{ fontFamily: FONTS.OPEN_SANS }}>By {formatAuthors(item)}</Text>
              </TouchableOpacity>
              <Text style={{ marginTop: 4, fontFamily: FONTS.OPEN_SANS, color: COLORS.DARK_GRAY, fontSize: FONT_SIZES.DEFAULT_SMALL }}>{formatDate(item)}</Text>
            </View>
            {thumbnailURL &&
              <Image style={{ width: width, height: 240, marginVertical: 5 }} source={{ uri: thumbnailURL }} />
            }
            {caption &&
              <Text style={{ marginHorizontal: MARGINS.ARTICLE_SIDES, fontFamily: FONTS.OPEN_SANS, fontSize: FONT_SIZES.DEFAULT_SMALL, color: COLORS.DARK_GRAY }}>Photo Credits: {striptags(caption)}</Text>
            }
            <View style={{ marginHorizontal: MARGINS.ARTICLE_SIDES }}>
              {postContent &&
                <HTML tagsStyles={{ p: { marginBottom: 16 }}} baseFontStyle={styles.articleText} html={this.createMarkup(postContent)} imagesMaxWidth={width} textSelectable={true} />
              } 
            </View>
          </ScrollView>
        </View>}
      </View>
    );
  }
};

export default Post;
