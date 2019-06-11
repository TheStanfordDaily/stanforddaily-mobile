import {STRINGS, CATEGORIES, REFS, FONTS, KEYS, ALIGNMENTS, Images, COLORS, ICONS} from '../assets/constants.js';
import React, {Component} from 'react';
import {
    View,
    Text,
    Dimensions,
    RefreshControl,
    StatusBar,
    ActivityIndicator,
    NetInfo,
    FlatList,
    TouchableOpacity,
    SectionList,
    TextInput,
    Image
} from 'react-native';
import Drawer from 'react-native-drawer'

import {NavigationActions} from 'react-navigation';

//Components for this app imports
import Header from './common/header';
import NewsFeedItem from './common/newsfeed-item';
import Placeholder from './common/placeholder';
import { Ionicons } from '@expo/vector-icons';
import _ from 'lodash';

//Styles for the page
import styles from './styles/search';

import * as Amplitude from 'expo-analytics-amplitude';

const amplitude = Amplitude.initialize(KEYS.AMPLITUDE_API);
const selectedCategory = STRINGS.FEATURED_HEADLINES; //The currently selected category

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
            allIsHere: false
        };
        // this.data = []; //A list of all current data
        this.currPosts = {}; //A hash of all current posts
        // console.log(this.currPosts);
        this.fetchDataIsBusy = false; //Used to handle concurrency
        // this.fetchData = _.debounce(this.fetchData, 200); //Sets a gap of at least 200ms between each call to loading more articles
        // this.loadMore = _.debounce(this.loadMore, 200); //Sets a gap of at least 200ms between each call to loading more articles
        this.goToPost = this.goToPost.bind(this); //The function that goes to the post screen
        this._renderRow = this._renderRow.bind(this); //A function used by the listView to render each row
    }

    //Given data, it passes it to Post view
    goToPost(data) {
      this.props.navigation.navigate(STRINGS.POST, { ...data });
    }

    componentDidMount() {
      this.refs.textInput.focus();
      // console.log('hihi');
      // tracker.setUser('12345678');
     // log an event
     // Amplitude.logEvent(STRINGS.APP_OPENED);
    //  console.log("Logged");
    }

    //Sends the fetch request, populates data with the new articles and alerts listView about potential change
    //Specific to category articles
    async fetchNewHeadlines(searchURL, loadMore, currText) {
      let response = await fetch(searchURL);
      let responseData = await response.json();
      var counter = 0;
      var view = this;
      var newArr = view.state.posts.slice();
      if(this.state.input !== currText) return;
      if(responseData.length === 0) this.setState({allIsHere : true});
      responseData.forEach(function(post) {
        if(view.state.hashed[post.id] === undefined) {
          view.state.hashed[post.id] = 1;
          var postObject = {postObj: post, searchTerm: currText, key: post.id};
          if(loadMore === true) {
            newArr.push(postObject);
          } else {
            newArr.splice(counter,0,postObject);
            counter += 1;
          }
        }
      });
      if(this.state.input !== currText) return;
      this.setState({posts: newArr});
      return counter;
    }

    //Determines the page and code for the category fetching, and calls the above function
    async handleFetching(counter, loadMore) {
      let searchURL = STRINGS.REQUEST_LARGE_PAGE +counter+STRINGS.SEARCH_URL+encodeURI(this.state.input);
      return await this.fetchNewHeadlines(searchURL, loadMore, this.state.input);
    }

    //Handles all requests to fetch more data, and figures out whether it should get category only or also featured headlines too
    async fetchData(loadMore) {
      if (this.state.input.length === 0 || this.state.allIsHere) return;
      // this.props.navigation.dispatch(NavigationActions.back());
      if (loadMore || this.state.page === 1) {
        await this.handleFetching(this.state.page,loadMore);
      } else {
        var counter = 1;
        while (true) {
          var refreshed = await this.handleFetching(counter,loadMore);
          if (refreshed !== 3) break;
          counter += 1;
        }
      }
      this.fetchDataIsBusy = false;
    }

    //Handles loading more articles
    async loadMore(event) {
      if(!this.state.loading && this.state.input.length !== 0) {
        this.state.loading = true;
        if(!this.fetchDataIsBusy) {
          this.fetchDataIsBusy = true;
          await this.fetchData(true);
          this.state.page += 1;
        }
        this.state.loading = false;
      }
    }

   //Handles rendering rows by calling the NewsFeedItem and passing data to it
  _renderRow(data) {
    // console.log("This is my id", data.item.key);
    if(data.item.searchTerm !== this.state.input) return null;
    if(data.item.postObj !== STRINGS.PLACEHOLDER) {
      return <NewsFeedItem key={data.item.key} postID={data.item.key} data={data.item} onPress={this.goToPost} context={STRINGS.HEADLINES}
      onAuthorPress = {authorID=>this.props.navigation.navigate("AuthorDetail", { id: authorID})} />
    }
    return null;
  }

  //Required ReactNative function
  //For this screen we render
  /* <View for the page>
     <Set Status Bar props>
     <Show the header>
     <MenuContext states that we will use the Menu component>
     <ListView for the articles>
  */
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <View style={styles.header}>
          <View style={styles.close}/>
          <View style={[styles.textInputWrapper,{backgroundColor: this.state.focusColor, borderColor: this.state.focusColor}]}>
            <Ionicons name={ICONS.SEARCH} size={20} style={{backgroundColor: 'rgba(0,0,0,0)'}} color={COLORS.DARK_GRAY}/>
            <TextInput
              ref={'textInput'}
              style={[styles.textInput,{backgroundColor: this.state.focusColor, borderColor: this.state.focusColor}]}
              placeholder={STRINGS.SEARCH}
              returnKeyType={'search'}
              autoCapitalize={'none'}
              autoCorrect={false}
              placeholderTextColor={COLORS.DARK_GRAY}
              selectionColor={COLORS.CARDINAL}
              onFocus={() => this.setState({focusColor: COLORS.WHITE})}
              onEndEditing={() => this.setState({focusColor: COLORS.PLACEHOLDER_LIGHT})}
              onChangeText={(text) => {
                this.setState({input: text, loading: false, page: 1, posts: [], hashed: {}, allIsHere: false}, () => {
                  this.fetchDataIsBusy = false;
                  if(text.length === 0) return;
                  this.fetchData();
                }
                );
              }}
            />
          </View>
          <TouchableOpacity onPress={() => this.props.navigation.dispatch(NavigationActions.back())}>
            <Ionicons name={ICONS.CLOSE} style={{width: 40}} size={40} color={COLORS.WHITE}/>
          </TouchableOpacity>
        </View>
        <View ref={REFS.VIEW} style={{flex: 1, backgroundColor:COLORS.GHOST_WHITE}}>
        <StatusBar
          ref={REFS.STATUS_BAR}
          barStyle={STRINGS.LIGHT_CONTENT}
        />
        <FlatList
            ref={REFS.LIST}
            removeClippedSubviews={false}
            disableVirtualization={true}
            keyExtractor={item => item.key}
            onEndReached={this.loadMore.bind(this)}
            data={this.state.posts}
            renderItem={this._renderRow}
            renderSectionHeader={() => this.renderSectionHeader()}
            ListFooterComponent={() => {if(this.state.input.length !== 0 && !this.state.allIsHere) return (<ActivityIndicator style={styles.loadingIndicator}/>); return null;}}
            contentContainerStyle={styles.list}
        />
        </View>
      </View>
    )
  }
}
