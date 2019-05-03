/*
Note: using the post.js as a template for this page; hoping it mostly works!
Each time to run again: call "npm run ios"
*/
'use strict';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  View,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';

import {MARGINS} from '../../assets/constants';

import NestedListView from "./NestedListView";

import Header from '../common/header';

const styles = {
  loadingIndicator: {
    marginTop: MARGINS.DEFAULT_MARGIN,
    marginBottom: MARGINS.DEFAULT_MARGIN
  }
};
class AuthorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
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
    if (!this.state.data) {
      return <ActivityIndicator style={styles.loadingIndicator}/>;
    }
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