/**
 * Post Template
 */
'use strict';

//Pre-made Components imports
import React, { Component } from 'react';
import { STRINGS, KEYS } from '../assets/constants.js';
// import HTML from 'react-native-render-html';
import {
  View,
  StatusBar,
  ScrollView,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

//Components for this app imports
import Header from './common/header';
import { Amplitude } from 'expo';
import {FONTS} from "../assets/constants";
import styles from './styles/post.js';
const h2p = require('html2plaintext')

const HTML = (props) => {
  return <Text style={props.style}>{h2p(props.html)}</Text>
}


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
    this.fetchData();
  }

  //Gets data and makes it look as expected
  async fetchData() {
    var postData = this.props.navigation.state.params;
    this.setState({
      // post: {content:this.assembleHTML(title, featuredMedia, postData.body) },
      content: postData.body,
      title: postData.title,
      author: postData.author,
      authorID: postData.authorID,
      date: postData.date,
      featuredMedia: postData.featuredMedia,
      id: postData.id,
    });
    Amplitude.logEvent(STRINGS.ARTICLE_FULL_LOADED, { ArticleId: postData.id })
  }

  createMarkup(text) {
    return text;
    // todo: HTML purify this if needed.
  }

  render() {
    return (
      <View style={{ flex: 1}}>
        <Header ref='postHeader' share={true} postID={this.state.id} goBack={this.goBack} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <StatusBar
            barStyle="light-content"
          />
          <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
            <Text style={styles.title}>
              <HTML style={{fontFamily: FONTS.CENTURY}} html={this.state.title} />
            </Text>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", margin: 10 }}>
            <TouchableOpacity onPress = {()=>this.props.navigation.navigate("AuthorDetail", { id: this.state.authorID})}>
              <Text style={{fontFamily: FONTS.CENTURY}}>{this.state.author}</Text>             
                  </TouchableOpacity>
              <Text style={{fontFamily: FONTS.CENTURY}}>{this.state.date}</Text>
            </View>
            <Image style={{ width: this.state.width, height: 200, marginVertical: 5 }} source={{ uri: this.state.featuredMedia }} />
            <View style={{ margin: 10 }}>
              {this.state.content &&
                <HTML style={{fontFamily: FONTS.CENTURY}} html={this.createMarkup(this.state.content)} imagesMaxWidth={Dimensions.get('window').width} />
              }
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
};

export default Post;
