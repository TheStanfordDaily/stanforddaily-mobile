/**
 * Created by ggoma on 12/17/16.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Dimensions,
    RefreshControl,
    ListView,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';
import Header from './common/header';
import NewsFeedItem from './common/newsfeed-item';
import Placeholder from './common/placeholder';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';

const {width, height} = Dimensions.get('window');
const categories = {
    "All" : '',
    "Featured Headlines": '1485',
    "News": '3',
    "Sports": '23',
    "Opinions": '24',
    "Arts & Life": '25',
    "The Grind": '32278'
};
const currentPosts = {};
const data = [];
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
const selectedCategory = 'All';
const currentPage = 1;

export default class Headlines extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            loading: false,
            dataSource: ds.cloneWithRowsAndSections(this.convertDataToMap())
        };
        this.fetchData();
        this.offsetY = 0;
        this.loadMore = _.debounce(this.loadMore, 200);
        this.goToPost = this.goToPost.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this.fetchDataIsBusy = false;
    }

    goToPost(data) {
      // console.log(data);
      this.props.navigation.navigate('Post', { ...data });
    }

    convertDataToMap() {
      var dataCategoryMap = {"Featured Headlines":[]}; // Create the blank map
      dataCategoryMap[selectedCategory] = [];
      data.forEach(function(dataItem) {
        // if(!dataCategoryMap[dataItem.category]) {
          // dataCategoryMap[dataItem.category] = [];
        // }
        console.log("General log", selectedCategory);
        if(dataItem.category === "Featured Headlines") {
          dataCategoryMap["Featured Headlines"].push(dataItem);
        } else if(dataItem.category === selectedCategory) {
          dataCategoryMap[selectedCategory].push(dataItem);
        } else {
          console.log("Problem log", dataItem.category);
        }
        // if(dataIte.category !== selectedCategory && dataItem.category !== "Featured Headlines")
      });
      if(dataCategoryMap[selectedCategory] !== undefined) {
        // console.log(dataCategoryMap[selectedCategory]);
        dataCategoryMap[selectedCategory].push({category: selectedCategory, postObj: 'placeholder'});
      }
      if(currentPosts[1129933] !== undefined) {
        console.log("It's fetched")
      }
      return dataCategoryMap;
    }

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
      this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataToMap())});
    }

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

    async handleCategoryFetching(counter, loadMore) {
      console.log(counter);
      let categoryURL = "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=2&page="+counter+"&categories="+categories[selectedCategory];
      if(selectedCategory === "All") {
        categoryURL = "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=2&page="+counter;
      }
       return await this.fetchNewCategoryHeadlines(categoryURL, loadMore);
    }

    async fetchData(loadMore) {
      if(loadMore !== true) {
        await this.fetchFeaturedHeadlines();
      }
      await this.handleCategoryFetching(currentPage,loadMore);
      currentPage += 1;
      this.fetchDataIsBusy = false;
    }

    async addNewData() {
      await this.fetchFeaturedHeadlines();
      //Make a while loop to handle multiple
      var newDataCounter = 1;
      while (true) {
        var returnResult = this.handleCategoryFetching(newDataCounter);
        if (returnResult === null) break;
        newDataCounter += 1;
      }
    }

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

    _onRefresh() {
        this.setState({refreshing: true});
        for(var i = data.length-1; i >= 0; i--) {
          if(data[i].category === "Featured Headlines") {
            delete currentPosts[data[i].id];
            data.splice(i, 1);
          }
        }
        this.addNewData();
        this.setState({refreshing: false});
    }

    setCategory(value) {
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

    renderSectionHeader(sectionData, category) {
      if(category === "Featured Headlines") {
        return (
          <View style={{height: 45, backgroundColor:'white', alignItems:"center", justifyContent:"center"}}>
            <Text style={{fontFamily:"Century", fontSize:28}}>
              {category}
            </Text>
          </View>
        )
    } else {
      return (
        <View style={{height: 45, backgroundColor:'white', alignItems:"center", justifyContent:"center"}}>
          <Menu onSelect={(value) => this.setCategory(value)}>
            <MenuTrigger>
              <View style={{flexDirection: 'row'}}>
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

  _renderRow(data) {
    // console.log("called");
    // console.log(event);
    if(data.postObj !== 'placeholder') {
      return <NewsFeedItem data={data} onPress={this.goToPost}/>
    } else {
      return (
        <View>
          <Placeholder />
          <Placeholder />
        </View>
      );
    }
  }

    render() {

        return (
            <View ref='view' style={{flex: 1}}>
            <StatusBar
              barStyle="light-content"
            />
            <View ref='view' style={styles.container}>
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
                renderFooter={() => <ActivityIndicator style={{marginTop: 8, marginBottom: 8}}/>}
            />
            </MenuContext>
            </View>
            </View>
        )
    }
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        width,
        height,
    },
    fade: {
        height,
        backgroundColor: 'black',
        width: width * 4/5,
    },
    drawer: {
        height,
        padding: 8,
        paddingTop: 20,
        width: width * 4/5,
        position: 'absolute',
        // backgroundColor: 'Colors.chat_bg',
        right: 0

    },
})
