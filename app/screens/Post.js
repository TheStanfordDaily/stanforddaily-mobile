/**
 * Post Template
 */
'use strict';

//Pre-made Components imports
import React, {Component} from 'react';
import {STRINGS, KEYS} from '../assets/constants.js';
// import HTML from 'react-native-render-html';
import {
  View,
  StatusBar,
  ScrollView,
  Dimensions,
  Text,
  Image
} from 'react-native';

//Components for this app imports
import Header from './common/header';
import {Amplitude} from 'expo';
import HTML from "react-native-render-html";
import FONTS from "../assets/constants";

const amplitude = Amplitude.initialize(KEYS.AMPLITUDE_API);
const {width, height} = Dimensions.get('window'); //Dimensions of the current device screen

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
       const {width, height} = Dimensions.get('window')
       this.setState({width: width <= height ? width : height, height: height});
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
        date: postData.date,
        featuredMedia: postData.featuredMedia,
        id: postData.id,
    });
    Amplitude.logEvent(STRINGS.ARTICLE_FULL_LOADED, {ArticleId: postData.id})
  }
  
  createMarkup(text) {
    return text;
    // todo: HTML purify this if needed.
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Header ref='postHeader' share={true} postID={this.state.id} goBack={this.goBack}/>
        <View style={{flex:1, alignItems: 'center'}}>
          <StatusBar
            barStyle="light-content"
          />
          <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
          <Text style={{fontSize: 22, fontFamily: FONTS.PT_SERIF_BOLD, margin: 10}}>
            {this.state.title}
          </Text>
          <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", margin: 10}}>
            <Text>{this.state.author}</Text>
            <Text>{this.state.date}</Text>
          </View>
          <Image style={{width: this.state.width, height: 200, marginVertical: 5}} source={{uri: this.state.featuredMedia}} />
          <View style={{margin: 10}}>
            <HTML html={this.createMarkup(this.state.content)} imagesMaxWidth={Dimensions.get('window').width} />
          </View>
          </ScrollView>
        </View>
      </View>
    );
  }
};

export default Post;
