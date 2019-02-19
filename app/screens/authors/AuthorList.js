/*
Note: using the post.js as a template for this page; hoping it mostly works!
Each time to run again: call "npm run ios"
*/
'use strict';
import React, { Component } from 'react';
import {
  Alert,
  View,
  StatusBar,
  ScrollView,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  SectionList,
} from 'react-native';

import {
  COLORS,
  FONTS,
  FONT_SIZES,
  STRINGS,
  DEFAULT_IMAGE
} from '../../assets/constants';
import NestedListView from "./NestedListView";

import Header from '../common/header';

const { width, height } = Dimensions.get('window'); //Dimensions of the current device screen


class AuthorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }
  }

  //Once components load, load data. All data is passed down from previous screen
  componentDidMount() {
    this.fetchData();
  }

  //Gets data and makes it look as expected
  fetchData() {
    //temporary, change fetch string 
    fetch("https://www.stanforddaily.com/wp-json/tsd/v1/authors/")
      .then(e => e.json()) //convert to json
      .then(data => {
        for (let section of data) {
          section.data = section.members.filter(member => member && member.name && member.name.trim());
        }
        this.setState({ data: data });
      })
  }

  createMarkup(text) {
    return text;
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "white", opacity: 1}}>
        <Header ref='postHeader' postID={this.state.id} />
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: "white", opacity: 1}}>
          <StatusBar
            barStyle="light-content"
          />
          <ScrollView style={{ flex: 1, flexDirection: "row", backgroundColor: "white", opacity: 1 }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
            {this.state.data.length ?
              <NestedListView
                data={this.state.data}   
                text = {"food"}            
                navigate={id => this.props.navigation.navigate("AuthorDetail", { id: id })}              
              /> : <View />}
          </ScrollView>
        </View>
      </View>
    );
  }
};

export default AuthorList;