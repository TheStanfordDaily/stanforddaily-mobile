/*
Note: using the post.js as a template for this page; hoping it mostly works!
Each time to run again: call "npm run ios"
*/
'use strict';
import React, { Component } from 'react';
import NestedListView, { NestedRow } from 'react-native-nested-listview';
import {
  View,
  StatusBar,
  ScrollView,
  Dimensions,
  Text,
  Image
} from 'react-native';

import {
  COLORS,
  FONTS,
  FONT_SIZES,
} from '../../assets/constants';

import Header from '../common/header';

const { width, height } = Dimensions.get('window'); //Dimensions of the current device screen

const styles = {
  header: {
    borderRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  headerText: {
    fontSize: FONT_SIZES.DEFAULT_MEDIUM,
    fontFamily: FONTS.PT_SERIF_BOLD,
  },
  author: {
    borderRadius: 10,
    borderBottomColor: COLORS.LIGHT_GRAY,
    borderBottomWidth: 0.5,
  },
  authorText: {
    fontSize: FONT_SIZES.DEFAULT_SMALL_MEDIUM,
    fontFamily: FONTS.PT_SERIF,
  }
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
  fetchData() {
    fetch("http://stanforddaily2.staging.wpengine.com/wp-json/tsd/v1/authors/")
      .then(e => e.json()) //convert to json
      .then(e => {
        this.setState({ data: e });
      })
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
              getChildrenName={(node) => 'members'} //children of the categories
              onNodePressed={
                (node) => node.id && this.props.navigation.navigate("AuthorDetail", {id: node.id})
              }
              renderNode={(node, level) => (
                <NestedRow
                  level={level}
                  style={level == 1 ? styles.header : styles.author}>
                  <Text 
                    style={level == 1 ? styles.headerText : styles.authorText}>{node.name}
                  </Text>
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