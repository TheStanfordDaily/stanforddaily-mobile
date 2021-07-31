import {STRINGS, REFS, COLORS, ICONS} from '../assets/constants.js';
import React, {Component, useState, useEffect} from 'react';
import {
    View,
    StatusBar,
    ActivityIndicator,
    FlatList,
    TextInput,
    Text,
    Image,
    Dimensions
} from 'react-native';
import WPAPI from "wpapi";
// import SearchBar from 'react-native-elements'
import Fuse from 'fuse.js'

import {NavigationActions} from 'react-navigation';
import { formatAuthors, getThumbnailURL, formatDate } from './common/newsfeed-item.js';

//Components for this app imports
import NewsFeedItem from './common/newsfeed-item';
import { Ionicons } from '@expo/vector-icons';
import _ from 'lodash';
import Header from './common/header';

//Styles for the page
import styles from './styles/search';

import * as Amplitude from 'expo-analytics-amplitude';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

// const amplitude = Amplitude.initialize(KEYS.AMPLITUDE_API);
// const selectedCategory = STRINGS.FEATURED_HEADLINES; //The currently selected category
const { width, height } = Dimensions.get('window'); //Dimensions of the current device screen

function removeDuplicates(arr) {
  const result = [];
  const map = new Map();
  for (const item of arr) {
      if(!map.has(item.id)){
          map.set(item.id, true);
          console.log(item.id, item)
          result.push(item);
      }
  }
  return result
}
export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: "",
            focusColor: COLORS.LIGHT_GRAY,
            refreshing: false,
            loading: false,
            page: 1,
            posts: [],
            hashed: {},
            allIsHere: false,
            item: 'ofvdhiufh',
            searchText: "",
            selectedId: -1,
            data: [],
            responseData: [],
            filteredData: []
        };
        // this.data = []; //A list of all current data
        this.currPosts = {}; //A hash of all current posts
        // console.log(this.currPosts);
        this.fetchDataIsBusy = false; //Used to handle concurrency
        // this.fetchData = _.debounce(this.fetchData, 200); //Sets a gap of at least 200ms between each call to loading more articles
        // this.loadMore = _.debounce(this.loadMore, 200); //Sets a gap of at least 200ms between each call to loading more articles
        this.goToPost = this.goToPost.bind(this); //The function that goes to the post screen
      }

    // Given data, it passes it to Post view
    goToPost(data) {
      this.props.navigation.navigate(STRINGS.POST, { ...data });
    }

    goBack() {
      this.props.navigation.goBack();
    }

    search = (searchText) => {

      this.setState({searchText: searchText});
      var object = this.state.responseData,
    flattened = Object.keys(object).reduce(function (r, k) {
        return r.concat(object[k]);
    }, []);
    
    const fuse = new Fuse(flattened, {
      keys: ['postTitle', 'postExcerpt', 'postName', 'tagsInput', 'tsdAuthors.displayName', 'thumbnailInfo.caption'],
    });
    const result = fuse.search(searchText)
    this.setState({filteredData: result})

    };

  async componentDidMount() {
    this.setState({responseData: this.props.navigation.state.params.articles})
  }
 
  render() {  
    const renderItem = ({item}) => { return (
        <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate(STRINGS.POST, { postID: item.id })}>
        <View style={{flexDirection: 'column', backgroundColor: COLORS.BACKGROUND}}>
                        <View style={{flexDirection: 'row', width: width}}>
                            {getThumbnailURL(item) && (
                                <View style={{padding: 10}}>
                                    <Image resizeMode={'cover'} source={{ uri: getThumbnailURL(item) }} style={{width: width/3, height: 3/4 * width/3}} borderRadius={8} />
                                </View>)
                            }
                            <View style={{flexShrink: 1}}>
                                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
                                    <View>
                                        <Text style={styles.titleContainer}>{item.postTitle}</Text>
                                        {/* <Text style={{ fontSize: 60*(1/2)^item.postTitle.split(' ').length }}>{item.postTitle.length}</Text> */}
                                        
                                        {/* <Text style={styles.author}>{JSON.stringify(item.tsdAuthors)}</Text> */}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
    </TouchableWithoutFeedback>
  )}

  var object = this.state.responseData,
    flattened = Object.keys(object).reduce(function (r, k) {
        return r.concat(object[k]);
    }, []);

    return (
      <View>
        <Header searchHandler={() => console.log("Search")} value={this.state.searchText} onChangeText={this.search} goBack={ () => this.goBack()} />
        {/* <Text>{JSON.stringify(this.state.filteredData[0])}</Text> */}
          <FlatList
              data={this.state.filteredData && this.state.filteredData.length > 0 ? this.state.filteredData.map(function(t) {
                return t.item
              }) : flattened.slice(0, -1)}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              backgroundColor={COLORS.BACKGROUND}
          />
      </View>
    )
  }
}