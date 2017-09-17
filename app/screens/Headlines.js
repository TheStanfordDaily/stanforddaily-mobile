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
} from 'react-native';
import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';

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
const currentPosts = {}; //Hashes current posts to not duplicate
const data = []; //A list of all current data
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2}); //Special variable that works with the list view. Checl listView docs in React Native
const selectedCategory = 'All'; //The currently selected category
const currentPage = 1; //The last viewed page

export default class Headlines extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            loading: false,
            dataSource: ds.cloneWithRowsAndSections(this.convertDataToMap())
        };
        this.fetchData(); //Fetches featured headlines and category articles
        this.loadMore = _.debounce(this.loadMore, 200); //Sets a gap of at least 200ms between each call to loading more articles
        this.goToPost = this.goToPost.bind(this); //The function that goes to the post screen
        this._renderRow = this._renderRow.bind(this); //A function used by the listView to render each row
        this.fetchDataIsBusy = false; //Used to handle concurrency
    }

    //Given data, it passes it to Post view
    goToPost(data) {
      this.props.navigation.navigate('Post', { ...data });
    }

    //Converts all fetched data to a map of <Category> => <Article>
    convertDataToMap() {
      var dataCategoryMap = {"Featured Headlines":[]}; // Create the blank map
      dataCategoryMap[selectedCategory] = [];
      data.forEach(function(dataItem) {
        if(dataItem.category === "Featured Headlines") {
          dataCategoryMap["Featured Headlines"].push(dataItem);
        } else if(dataItem.category === selectedCategory) {
          dataCategoryMap[selectedCategory].push(dataItem);
        }
      });
      //Puts in some placeholders when needed
      if(dataCategoryMap[selectedCategory] !== undefined) {
        dataCategoryMap[selectedCategory].push({category: selectedCategory, postObj: 'placeholder'});
        dataCategoryMap[selectedCategory].push({category: selectedCategory, postObj: 'placeholder'});
      }
      while (dataCategoryMap["Featured Headlines"].length !== 2) {
        dataCategoryMap["Featured Headlines"].push({category: "Featured Headlines", postObj: 'placeholder'});
      }
      return dataCategoryMap;
    }

    //Sends the fetch request, populates data with the new articles and alerts listView about potential change
    //Specific to featured headlines
    async fetchFeaturedHeadlines() {
      let featuredURL = "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=2&page=1&categories="+categories['Featured Headlines'];
      let response = await fetch(featuredURL);
      let responseData = await response.json();
      responseData.forEach(function(post) {
        if(!currentPosts[post.id]) {
        currentPosts[post.id] = "Featured Headlines";
          data.push({
            category: "Featured Headlines",
            postObj: post
          });
        }
      });
      this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataToMap())}); //Alerting listView
    }

    //Sends the fetch request, populates data with the new articles and alerts listView about potential change
    //Specific to category articles
    async fetchNewCategoryHeadlines(categoryURL, loadMore) {
      let response = await fetch(categoryURL);
      let responseData = await response.json();
      var counter = 2;
      responseData.forEach(function(post) {
        if(!currentPosts[post.id]) {
          currentPosts[post.id] = selectedCategory;
          var postObject = {category: selectedCategory, postObj: post};
          if(loadMore === true) {
            data.push(postObject);
          } else {
            data.splice(counter,0,postObject);
            counter += 1;
          }
        } else if (currentPosts[post.id] === selectedCategory) {
          return null;
        }
      });
      this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataToMap())});
      return {Nonempty: 1};
    }

    //Determines the page and code for the category fetching, and calls the above function
    async handleCategoryFetching(counter, loadMore) {
      let categoryURL = "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=2&page="+counter+"&categories="+categories[selectedCategory];
      if(selectedCategory === "All") {
        categoryURL = "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=2&page="+counter;
      }
       return await this.fetchNewCategoryHeadlines(categoryURL, loadMore);
    }

    //Handles all requests to fetch more data, and figures out whether it should get category only or also featured headlines too
    async fetchData(loadMore) {
      if(loadMore !== true) {
        await this.fetchFeaturedHeadlines();
      }
      await this.handleCategoryFetching(currentPage,loadMore);
      currentPage += 1;
      this.fetchDataIsBusy = false;
    }

    //Handles loading more articles
    async loadMore(event) {
      if(!this.state.loading) {
        this.state.loading = true;
        if(!this.fetchDataIsBusy) {
          this.fetchDataIsBusy = true;
          this.fetchData(true);
        }
        this.state.loading = false;
      }
    }

    //Handles refreshing
    _onRefresh() {
        this.setState({refreshing: true});
        data = [];
        currentPosts = {};
        this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataToMap())});
        this.fetchData();
        this.setState({refreshing: false});
    }

    //Changes category, clears old posts, and sends a new request to fetch more posts
    setCategory(value) {
      if (value === selectedCategory) return;
      selectedCategory = value;
      for (var i = data.length - 1; i >= 0; i--) {
        if (data[i].category !== "Featured Headlines") {
          delete currentPosts[data[i].postObj.id];
          data.splice(i, 1);
        }
      }
      currentPage = 1;
      this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataToMap())});
      if(!this.fetchDataIsBusy) {
        this.fetchDataIsBusy = true;
        this.fetchData();
      }
    }

    //Renders the headers for the sections
    renderSectionHeader(sectionData, category) {
       if(category === "Featured Headlines") {
         return (
           <View style={{height: 45, backgroundColor:'white', alignItems:"center", justifyContent:"center"}}>
             <Text style={{fontFamily:"Century", fontSize:28, marginTop: 4}}>
               {category}
             </Text>
           </View>
         )
     } else {
       return (
         <View style={{height: 45, backgroundColor:'white', alignItems:"center", justifyContent:"center"}}>
           <Menu onSelect={(value) => this.setCategory(value)}>
             <MenuTrigger>
               <View style={{flexDirection: 'row', marginTop: 4}}>
                 <Text style={{fontFamily:"Century", fontSize:28}}>
                   {selectedCategory}
                 </Text>
                 <Icon name="ios-arrow-down" size={34} color="#979797" style={{marginLeft:6, marginTop: 3}}/>
               </View>
             </MenuTrigger>
             <MenuOptions>
               <MenuOption value={'All'}>
                 <Text>All</Text>
               </MenuOption>
               <MenuOption value={'News'}>
                 <Text>News</Text>
               </MenuOption>
               <MenuOption value={'Sports'}>
                 <Text>Sports</Text>
               </MenuOption>
               <MenuOption value={'Arts & Life'}>
                 <Text>Arts & Life</Text>
               </MenuOption>
               <MenuOption value={'The Grind'}>
                 <Text>The Grind</Text>
               </MenuOption>
             </MenuOptions>
           </Menu>
         </View>
     )
     }
   }

   //Handles rendering rows by calling the NewsFeedItem and passing data to it
  _renderRow(data) {
    if(data.postObj !== 'placeholder') {
      return <NewsFeedItem data={data} onPress={this.goToPost}/>
    } else {
      return (
        <View>
          <Placeholder />
        </View>
      );
    }
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
        <View ref='view' style={{flex: 1}}>
        <StatusBar
          barStyle="light-content"
        />
        <Header ref='Header'/>
        <MenuContext style={{ flex: 1 }}>
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
        </MenuContext>
        </View>
    )
  }
}
