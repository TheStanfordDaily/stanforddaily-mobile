/**
 * Post Template
 */
'use strict';

//Pre-made Components imports
import React, { Component } from 'react';
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

import { WebView } from 'react-native-webview'

//Components for this app imports
import Header from './common/header';
import * as Amplitude from 'expo-analytics-amplitude';
import { FONTS, COLORS, STRINGS, KEYS, MARGINS, FONT_SIZES } from "../assets/constants";
import styles from './styles/post.js';
import _ from "lodash";
import HTML from '../HTML.js';
import striptags from 'striptags';
import { getPostByIdAsync } from '../helper/wpapi.js';
import { formatAuthors, getThumbnailURL, formatDate } from './common/newsfeed-item.js';
import Placeholder from './common/placeholder.js';

// const amplitude = Amplitude.initialize(KEYS.AMPLITUDE_API);
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

  componentDidMount() {
    const { post } = this.props.navigation.state.params;
    console.log("here is post", post.content)
    // Amplitude.logEvent(STRINGS.ARTICLE_FULL_LOADED, { ArticleId: postID })
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
    const { caption } = thumbnailInfo || {};
    const thumbnailURL = getThumbnailURL(item);
    console.log("render here", this.props.navigation.state.params.post)
    return (
      <Text>will this even work</Text>
    );
  }
};

export default Post;
