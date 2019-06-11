/**
 * Post Template
 */
'use strict';

//Pre-made Components imports
import React, { Component } from 'react';
import { STRINGS, KEYS } from '../assets/constants.js';
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

const amplitude = Amplitude.initialize(KEYS.AMPLITUDE_API);
const { width, height } = Dimensions.get('window'); //Dimensions of the current device screen

class Post extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.state = {
      post: {},
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

  //Once components load, load data. All data is passed down from previous screen
  componentDidMount() {
    if (this.props.navigation.state.params.postID) {
      this.fetchData(this.props.navigation.state.params.postID);
    }
    else {
      this.fetchDataFromParams();
    }
  }

  async fetchDataFromParams() {
    var postData = this.props.navigation.state.params;
    this.setState({
      // post: {content:this.assembleHTML(title, featuredMedia, postData.body) },
      content: postData.body,
      title: postData.title,
      author: postData.author,
      authorID: postData.authorID,
      date: postData.date,
      featuredMedia: postData.featuredMedia,
      featuredMediaCaption: postData.featuredMediaCaption,
      id: postData.id,
    });
    Amplitude.logEvent(STRINGS.ARTICLE_FULL_LOADED, { ArticleId: postData.id })
  }

  //Gets data and makes it look as expected
  async fetchData(id) {
    let postData = await fetch(`${STRINGS.DAILY_URL}wp-json/wp/v2/posts/${id}?_embed`).then(e => e.json())
    this.setState({
      content: _.get(postData, "content.rendered", ""),
      title: _.get(postData, "title.rendered", ""),
      author: _.get(postData, "_embedded.author.name", ""),
      authorID: postData.author,
      date: new Date(postData.date).toLocaleDateString(),
      featuredMedia: _.get(postData, "_embedded.wp:featuredmedia.0.media_details.sizes.medium_large.source_url"),
      featuredMediaCaption: _.get(postData, "_embedded.wp:featuredmedia.caption.rendered"),
      id: id
    });
    Amplitude.logEvent(STRINGS.ARTICLE_FULL_LOADED, { ArticleId: id })
  }

  createMarkup(text) {
    return text;
    // todo: HTML purify this if needed.
  }

  render() {
    return (
      <View style={{ flex: 1}}>
        <Header ref='postHeader' share={true} postID={this.state.id} goBack={this.goBack} />
        {!this.state.id && <ActivityIndicator />}
        {this.state.id &&
        <View style={{ flex: 1, alignItems: 'center' }}>
          <StatusBar
            barStyle="light-content"
          />

          <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={styles.title}>
              <HTML baseFontStyle={styles.titleText} html={this.state.title} />
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", margin: 10 }}>
              <TouchableOpacity onPress = {()=>this.props.navigation.navigate("AuthorDetail", { id: this.state.authorID})}>
                <Text style={{fontFamily: FONTS.CENTURY}}>{this.state.author}</Text>
              </TouchableOpacity>
              <Text style={{fontFamily: FONTS.CENTURY}}>{this.state.date}</Text>
            </View>
            {this.state.featuredMedia !== "" &&
              <Image style={{ width: this.state.width, height: 200, marginVertical: 5 }} source={{ uri: this.state.featuredMedia }} />
            }
            {this.state.featuredMediaCaption &&
              <Text style={{ marginLeft: 10, fontFamily: FONTS.CENTURY, color: COLORS.LIGHT_GRAY, fontStyle: 'italic' }}>Photo Credits: {striptags(this.state.featuredMediaCaption)}</Text>
            }
            <View style={{ margin: 10 }}>
              {this.state.content &&
                <HTML baseFontStyle={{ fontFamily: FONTS.CENTURY }} html={this.createMarkup(this.state.content)} imagesMaxWidth={Dimensions.get('window').width} textSelectable={true} />
              }
            </View>
          </ScrollView>
        </View>}
      </View>
    );
  }
};

export default Post;
