/*
Note: using the post.js as a template for this page; hoping it mostly works!

Each time to run again: call "npm run ios"
*/
'use strict';
import React, { Component } from 'react';
import NestedListView, {NestedRow} from 'react-native-nested-listview';
import { STRINGS, KEYS } from '../../assets/constants.js';
import RNAmplitute from 'react-native-amplitude-analytics';
//import HTML from 'react-native-render-html';
import {
  View,
  StatusBar,
  ScrollView,
  Dimensions,
  Text,
  Image
} from 'react-native';

import Header from '../common/header';

const { width, height } = Dimensions.get('window'); //Dimensions of the current device screen
const styles = {
  header: {
    backgroundColor: "red",
  },
  author: {
    backgroundColor: "green",
  },
}


class Post extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.state = {
      data: [],
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
  //"Music", "Culture", "Screen"
  fetchData() {
    var postData = this.props.navigation.state.params;
    this.setState({
      data: [{"name":"Arts and Life","members":[{"name":"Alex Tsai","id":1001790},{"name":"Shana Hadi","id":1001803}]},{"name":"Tech","members":[{"name":"Ashwin Ramaswami","id":1001827},{"name":"John Doe","id":1001714}]}],
    });
    //amplitude.logEvent(STRINGS.ARTICLE_FULL_LOADED, {ArticleId: postData.id})
  }

  createMarkup(text) {
    return text;
  }
  render() {


    return (
      <View style={{ flex: 1 }}>
        <Header ref='postHeader' share={true} postID={this.state.id} goBack={this.goBack} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <StatusBar
            barStyle="light-content"
          />
          <ScrollView style={{ flex: 1, flexDirection: "row", backgroundColor: "white" }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
            
            <NestedListView
              data={this.state.data}
              getChildrenName={(node) => 'members'}
              onNodePressed={(node) => alert('Selected node')}
              renderNode={(node, level) => (
                <NestedRow
                  level={level}
                  style={level == 1 ? styles.header : styles.author}
                >
                  <Text>{node.name}</Text>
                </NestedRow>
              )}
            />

          </ScrollView>
        </View>
      </View>
    );
  }
};

export default Post;