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
  ImageBackground,
  ActivityIndicator
} from 'react-native';

import { WebView } from 'react-native-webview'

//Components for this app imports
import Header from './common/header';
import * as Amplitude from 'expo-analytics-amplitude';
import { FONTS, COLORS, STRINGS, KEYS, MARGINS } from "../assets/constants";
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
    const { postID } = this.props.navigation.state.params;
    let item = await getPostByIdAsync(postID);
    this.setState({ item });
    Amplitude.logEvent(STRINGS.ARTICLE_FULL_LOADED, { ArticleId: postID })
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
    return (
      <View style={{ flex: 1 }}>
        <Header ref='postHeader' share={true} postID={id} goBack={this.goBack} />
        {!id && <ActivityIndicator />}
        {id &&
          <View style={{ flex: 1, alignItems: 'center' }}>
            <StatusBar
              barStyle="dark-content"
            />

            <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
              {thumbnailURL !== 0 &&
                // <Image style={{ width: width, height: 240, marginTop: MARGINS.DEFAULT_LARGE_MARGIN }} source={{ uri: thumbnailURL }} />
                <ImageBackground source={{uri: thumbnailURL}} style={{width: width, height: 240}}>
                  <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 15, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'}}>
     <Text style={styles.titleText}>{postTitle}</Text>
   </View>
                </ImageBackground>
              }
                            {postSubtitle !== "" &&
                <View style={styles.title}>
                  <HTML baseFontStyle={styles.subtitleText} html={postSubtitle} />
                </View>
              }
              {caption !== 0 &&
                <Text style={styles.caption}>{striptags(caption)}</Text>
              }
              <View style={styles.authorAndDate}>
                {/*<TouchableOpacity onPress = {()=>this.props.navigation.navigate("AuthorDetail", { id: this.state.authorID})}>*/}
                <Text style={{ fontFamily: FONTS.OPEN_SANS }}>By {formatAuthors(item)}</Text>
                {/*</TouchableOpacity>*/}
                <Text style={styles.date}>{formatDate(item)}</Text>
              </View>
              <View style={{ marginHorizontal: MARGINS.ARTICLE_SIDES }}>
                {postContent !== 0 &&
                  <HTML
                    tagsStyles={{ 
                      p: { marginBottom: MARGINS.ARTICLE_SIDES }, 
                      a: { color: COLORS.CARDINAL }, 
                      strong: { fontFamily: FONTS.PT_SERIF_BOLD },
                      em: { fontFamily: FONTS.PT_SERIF_ITALIC }, 
                      img: { marginHorizontal: -1 * MARGINS.ARTICLE_SIDES }, 
                      figure: { marginVertical: MARGINS.ARTICLE_SIDES },
                      figcaption: styles.caption,
                    }}
                    baseFontStyle={styles.articleText}
                    html={this.createMarkup(postContent)}
                    imagesMaxWidth={width}
                    textSelectable={true}
                  />
                }
              </View>
            </ScrollView>
          </View>}
      </View>
    );
  }
};

export default Post;
