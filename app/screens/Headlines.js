//Pre-made Components imports
import React, {Component} from 'react';
import {
    View,
    Text,
    Dimensions,
    RefreshControl,
    ListView,
    StatusBar,
    ActivityIndicator,
    NetInfo,
    FlatList,
    TouchableOpacity
} from 'react-native';
import Drawer from 'react-native-drawer'

//Components for this app imports
import Header from './common/header';
import NewsFeedItem from './common/newsfeed-item';
import Placeholder from './common/placeholder';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';

//Styles for the page
import styles from './styles/headlines';

//A map between categories names and their codes
const categories = {
    "All" : '',
    "Featured Headlines": '1485',
    "News": '3',
    "Sports": '23',
    "Opinions": '24',
    "Arts & Life": '25',
    "The Grind": '32278'
};

const selectedCategory = 'Featured Headlines'; //The currently selected category

export default class Headlines extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: 'Featured Headlines',
            refreshing: false,
            loading: false,
            dataSource: new ListView.DataSource({
              rowHasChanged: function(row1, row2) {
                return row1.key !== row2.key;
              },
            }),
        };
        // this.data = []; //A list of all current data
        this.currPosts = {}; //A hash of all current posts
        for (var category in categories) {
          // skip loop if the property is from prototype
          if (!categories.hasOwnProperty(category)) continue;
          // this.data.push({category: category, page: 1, posts:[]});
          this.currPosts[category] = {page: 1, posts:[], hashed:{}};
        }
        console.log(this.currPosts);
        this.fetchDataIsBusy = true; //Used to handle concurrency
        this.fetchData = _.debounce(this.fetchData, 200); //Sets a gap of at least 200ms between each call to loading more articles
        this.fetchData(false, (' ' + selectedCategory).slice(1)); //Fetches featured headlines and category articles
        this.loadMore = _.debounce(this.loadMore, 200); //Sets a gap of at least 200ms between each call to loading more articles
        this.goToPost = this.goToPost.bind(this); //The function that goes to the post screen
        this._renderRow = this._renderRow.bind(this); //A function used by the listView to render each row
        this.drawerHandler = this.drawerHandler.bind(this); //A function used the header to handle drawer opening

    }

    //Given data, it passes it to Post view
    goToPost(data) {
      this.props.navigation.navigate('Post', { ...data });
    }

    //Opens the drawer
    drawerHandler() {
      this.refs.drawer.open();
    }

    //Converts all fetched data to a map of <Category> => <Article>
    convertDataToMap(category) {
      // this.setState({dataSource: this.state.dataSource.cloneWithRows(newArray)});
      if (category !== selectedCategory) return;
      var newArray = this.currPosts[selectedCategory]["posts"].slice();
      //Puts in some placeholders when needed
      if(newArray.length === 0) {
        newArray.push({category: selectedCategory, postObj: 'placeholder'});
        newArray.push({category: selectedCategory, postObj: 'placeholder'});
      }
      this.setState({dataSource: this.state.dataSource.cloneWithRows(newArray)});
    }

    //Sends the fetch request, populates data with the new articles and alerts listView about potential change
    //Specific to category articles
    async fetchNewCategoryHeadlines(category, categoryURL, loadMore) {
      let response = await fetch(categoryURL);
      let responseData = await response.json();
      var counter = 0;
      var view = this;
      responseData.forEach(function(post) {
        if(view.currPosts[category]["hashed"][post.id] === undefined) {
          view.currPosts[category]["hashed"][post.id] = 1;
          var postObject = {category: category, postObj: post, key: post.id};
          if(loadMore === true) {
            view.currPosts[category]["posts"].push(postObject);
          } else {
            view.currPosts[category]["posts"].splice(counter,0,postObject);
            counter += 1;
          }
        }
      });
      this.convertDataToMap(category);
      return counter;
    }

    //Determines the page and code for the category fetching, and calls the above function
    async handleCategoryFetching(counter, loadMore, category) {
      let categoryURL = "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=2&page="+counter+"&categories="+categories[category];
      if(category === "All") {
        categoryURL = "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=2&page="+counter;
      }
      return await this.fetchNewCategoryHeadlines(category, categoryURL, loadMore);
    }

    //Handles all requests to fetch more data, and figures out whether it should get category only or also featured headlines too
    async fetchData(loadMore, category) {
      console.log(category);
      if (loadMore || this.currPosts[category]["page"] === 1) {
        await this.handleCategoryFetching(this.currPosts[category]["page"],loadMore,category);
      } else {
        var counter = 1;
        while (true) {
          var refreshed = await this.handleCategoryFetching(counter,loadMore,category);
          if (refreshed !== 2) break;
          counter += 1;
        }
      }
      this.fetchDataIsBusy = false;
    }

    //Handles loading more articles
    async loadMore(event) {
      if(!this.state.loading) {
        this.state.loading = true;
        if(!this.fetchDataIsBusy) {
          this.fetchDataIsBusy = true;
          await this.fetchData(true, (' ' + selectedCategory).slice(1));
          this.currPosts[selectedCategory]["page"] += 1;
        }
        this.state.loading = false;
      }
    }

    //Handles refreshing
    async _onRefresh() {
      this.fetchDataIsBusy = true;
      this.setState({refreshing: true});
      await this.fetchData(false, (' ' + selectedCategory).slice(1));
      this.setState({refreshing: false});
    }

    //Changes category, clears old posts, and sends a new request to fetch more posts
    setCategory(value) {
      if (value === selectedCategory) return;
      this.currPosts[selectedCategory]["page"] = 1;
      selectedCategory = value;
      this.setState({selectedCategory: value});
      this.currPosts[selectedCategory] = {page: 1, posts:[], hashed:{}};
      this.convertDataToMap((' ' + selectedCategory).slice(1));
      this.fetchDataIsBusy = true;
      this.fetchData(false, (' ' + selectedCategory).slice(1));
    }

    //Renders the headers for the sections
    renderSectionHeader(sectionData, category) {
       return (
         <View style={{height: 45, backgroundColor:'white', alignItems:"center", justifyContent:"center"}}>
           <View style={{flexDirection: 'row', marginTop: 4}}>
             <Text style={{fontFamily:"Century", fontSize:28}}>
               {selectedCategory}
             </Text>
           </View>
         </View>
     )
   }

   //Handles rendering rows by calling the NewsFeedItem and passing data to it
  _renderRow(data) {
    if(data.postObj !== 'placeholder') {
      return <NewsFeedItem key={data.key} data={data} onPress={this.goToPost}/>
    } else {
      return (
        <View>
          <Placeholder />
        </View>
      );
    }
  }

  constructSideMenuList() {
    var categoriesList = [];
    for (var category in categories) {
      // skip loop if the property is from prototype
      if (!categories.hasOwnProperty(category)) continue;
      categoriesList.push({key: category});
    }
    return categoriesList;
  }

  setTextStyle(category) {
    if (category === selectedCategory) {
      return {color: "#94171C"};
    }
    return {color: "#4E4E4E"};
  }
  //A method to render the drawer/side menu
  sideMenu() {
    return (
      <View style={styles.sideMenuContainer}>
        <View style={styles.sideBarTitle}>
          <Text style={styles.sideBarTitleText}> Categories </Text>
        </View>
        <FlatList
          data={this.constructSideMenuList()}
          style={styles.flatListStyle}
          renderItem={({item}) =>
            <TouchableOpacity onPress={() => {this.setCategory(item.key); this.refs.drawer.close()}}>
              <View style={styles.sideMenuItem}>
                <Text style={this.setTextStyle(item.key)}>{item.key}</Text>
              </View>
            </TouchableOpacity>
          }
        />
      </View>
    )
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
      <Drawer
      type="static"
      ref='drawer'
      content={this.sideMenu()}
      openDrawerOffset={0.25}
      styles={drawerStyles}
      tweenHandler={Drawer.tweenPresets.parallax}
      captureGestures={true}
      negotiatePan={true}
      tapToClose={true}
      onOpenStart={() => StatusBar.setHidden(true)}
      onCloseStart={() => StatusBar.setHidden(false)}
      >
        <View ref='view' style={{flex: 1, backgroundColor:'ghostwhite'}}>
        <StatusBar
          ref="statusBar"
          barStyle="light-content"
        />
        <Header ref='Header' drawerHandler={this.drawerHandler}/>
        <ListView
            removeClippedSubviews={false}
            refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                />
            }
            onEndReached={this.loadMore.bind(this)}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
            renderSectionHeader={(sectionData, category) => this.renderSectionHeader(sectionData, category)}
            enableEmptySections={true}
            stickySectionHeadersEnabled={true}
            renderFooter={() => <ActivityIndicator style={styles.loadingIndicator}/>}
        />
        </View>
      </Drawer>
    )
  }
}
const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
}
