/**
 * Created by ggoma on 12/17/16.
 */
import React, {Component} from 'react';
import {
    Animated,
    View,
    Text,
    Dimensions,
    RefreshControl,
    Modal,
    ScrollView,
    ListView,
    StyleSheet,
    Image,
    StatusBar,
    LayoutAnimation,
    TouchableOpacity
} from 'react-native';

const {width, height} = Dimensions.get('window');

import Menu, { MenuContext, MenuOptions, MenuOption, MenuTrigger } from 'react-native-menu';
import Header from './common/header';
import NewsFeedItem from './common/newsfeed-item';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';

//1 is regular post, 2 is image
// const dropDownData = ["All", "News","Sports","Opinions","Arts & Life","The Grind"];
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
        this._onScroll = this._onScroll.bind(this);
        this.loadMore = _.debounce(this.loadMore, 200);
        this._renderRow = this._renderRow.bind(this);
        this.goToPost = this.goToPost.bind(this);
    }

    goToPost(data) {
      console.log(data);
      this.props.navigation.navigate('Post', { ...data });
    }

    convertDataToMap() {
      var dataCategoryMap = {"Featured Headlines":[]}; // Create the blank map
      data.forEach(function(dataItem) {
        if(!dataCategoryMap[dataItem.category]) {
          dataCategoryMap[dataItem.category] = [];
        }
        dataCategoryMap[dataItem.category].push(dataItem);
      });
      return dataCategoryMap;
    }

    async fetchFeaturedHeadlines(featuredURL) {
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

    async fetchCategoryHeadlines(categoryURL) {
      let response = await fetch(categoryURL);
      let responseData = await response.json();
      responseData.forEach(function(post) {
        if(!currentPosts[post.id]) {
        currentPosts[post.id] = selectedCategory;
          data.push({
            category: selectedCategory,
            postObj: post
          });
        }
      });
    }

    async fetchData() {
      let featuredURL = "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=2&page=1&categories="+categories['Featured Headlines'];
      await this.fetchFeaturedHeadlines(featuredURL);
      let categoryURL = "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=2&page="+currentPage+"&categories="+categories[selectedCategory];
      if(selectedCategory === "All") {
        categoryURL = "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=2&page="+currentPage;
      }
      currentPage += 1;
      await this.fetchCategoryHeadlines(categoryURL);
    }

    async fetchNewCategoryHeadlines(categoryURL) {
      let response = await fetch(categoryURL);
      let responseData = await response.json();
      responseData.forEach(function(post) {
        if(!currentPosts[post.id]) {
        currentPosts[post.id] = selectedCategory;
          data.unshift({
            category: selectedCategory,
            postObj: post
          });
        } else if (currentPosts[post.id] === selectedCategory) {
          return;
        }
      });
      this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataToMap())});
      return {Nonempty: 1};
    }

    async addNewData() {
      let featuredURL = "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=2&page=1&categories="+categories['Featured Headlines'];
      await this.fetchFeaturedHeadlines(featuredURL);
      //Make a while loop to handle multiple
      var newDataCounter = 1;
      while (true) {
        let categoryURL = "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=2&page="+newDataCounter+"&categories="+categories[selectedCategory];
        if(selectedCategory === "All") {
          categoryURL = "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=2&page="+newDataCounter;
        }
        if (await this.fetchNewCategoryHeadlines(categoryURL) === undefined) break;
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



    _renderRow(data) {
      console.log("called");
      // console.log(event);
        return <NewsFeedItem data={data} onPress={this.goToPost}/>
    }

    async loadMore(event) {
      this.setState({loading: true});
        let categoryURL = "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=2&page="+currentPage+"&categories="+categories[selectedCategory];
        if(selectedCategory === "All") {
          categoryURL = "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=2&page="+currentPage;
        }
        currentPage += 1;
        await this.fetchCategoryHeadlines(categoryURL);
        this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataToMap())});
        this.setState({loading: false});
    }

    _onScroll(event) {
        // const e = event.nativeEvent;
        // const l_height = e.contentSize.height;
        // const offset = e.contentOffset.y;
        //
        // if(offset === 0)this.refs.Header.show();
        // if(offset > this.offsetY) {
        //     console.log('scrolling down');
        //     if(!(offset < 56)) {
        //         this.refs.Header.hide();
        //     }
        //     this.offsetY = offset;
        //     //if
        // } else if (offset < this.offsetY - 20) {
        //     console.log('scrolling up');
        //     this.offsetY = offset;
        //     this.refs.Header.show();
        // }
    }

    setCategory(value) {
      selectedCategory = value;
      for (var i = data.length - 1; i >= 0; i--) {
        if (data[i].category !== "Featured Headlines") {
          delete currentPosts[data[i].postObj.id];
          data.splice(i, 1);
        }
      }
      console.log("Category: ", selectedCategory);
      console.log("currentPosts: ", currentPosts);
      currentPage = 1;
      this.setState({dataSource: ds.cloneWithRowsAndSections(this.convertDataToMap())});
      this.loadMore();
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

    }
})
