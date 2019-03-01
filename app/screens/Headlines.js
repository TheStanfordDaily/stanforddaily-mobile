import {STRINGS, CATEGORIES, REFS, KEYS, ALIGNMENTS, FONTS, COLORS} from '../assets/constants.js';
import React, {Component} from 'react';
import {Image} from 'react-native';
import Modal from "react-native-modal"
import ToggleSwitch from 'toggle-switch-react-native'
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
    TouchableOpacity,
    SectionList
} from 'react-native';
import Drawer from 'react-native-drawer'

//Components for this app imports
import Header from './common/header';
import NewsFeedItem from './common/newsfeed-item';
import Placeholder from './common/placeholder';
import _ from 'lodash';

//Styles for the page
import styles from './styles/headlines';

import {Amplitude} from 'expo';

const amplitude = Amplitude.initialize(KEYS.AMPLITUDE_API);

//A map between categories names and their codes
const {width, height} = Dimensions.get('window');
var selectedCategory = STRINGS.FEATURED_HEADLINES; //The currently selected category

export default class Headlines extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOnBreakingNews: false,
            isOnEveryDay: false,
            isOnEveryWeek: false,
            isModalVisible: true,
            selectedCategory: STRINGS.FEATURED_HEADLINES,
            refreshing: false,
            loading: false,
            selectedCategoryData: [
              {category: selectedCategory, postObj: STRINGS.PLACEHOLDER, key: 'p1'},
              {category: selectedCategory, postObj: STRINGS.PLACEHOLDER, key: 'p2'}
            ],
            width: width <= height ? width : height,
            height: Dimensions.get('window').height,
        };
        // this.data = []; //A list of all current data
        this.currPosts = {}; //A hash of all current posts
        for (var category in CATEGORIES) {
          // skip loop if the property is from prototype
          if (!CATEGORIES.hasOwnProperty(category)) continue;
          // this.data.push({category: category, page: 1, posts:[]});
          this.currPosts[category] = {page: 1, posts:[], hashed:{}};
        }
        // console.log(this.currPosts);
        this.fetchDataIsBusy = true; //Used to handle concurrency
        // this.fetchData = _.debounce(this.fetchData, 200); //Sets a gap of at least 200ms between each call to loading more articles
        this.fetchData(false, (' ' + selectedCategory).slice(1)); //Fetches featured headlines and category articles
        // this.loadMore = _.debounce(this.loadMore, 200); //Sets a gap of at least 200ms between each call to loading more articles
        this.goToPost = this.goToPost.bind(this); //The function that goes to the post screen
        this._renderRow = this._renderRow.bind(this); //A function used by the listView to render each row
        this.drawerHandler = this.drawerHandler.bind(this); //A function used the header to handle drawer opening
        this.searchHandler = this.searchHandler.bind(this);

        Dimensions.addEventListener('change', () => {
          const {width, height} = Dimensions.get('window')
          this.setState({width: width <= height ? width : height, height: height});
          // console.warn("orientation changed");
        });
    }

    //Given data, it passes it to Post view
    goToPost(data) {
      this.props.navigation.navigate(STRINGS.POST, { ...data });
    }


    componentDidMount() {
      // console.log('hihi');
      // tracker.setUser('12345678');
      var currentdate = new Date();
     // log an event
     Amplitude.logEvent(STRINGS.APP_OPENED);
    //  console.log("Logged");
    }

    //Opens the drawer
    drawerHandler() {
      this.refs.drawer.open();
    }

    searchHandler() {
      this.props.navigation.navigate(STRINGS.SEARCH, {});
    }

    //Converts all fetched data to a map of <Category> => <Article>
    convertDataToMap(category) {
      // this.setState({dataSource: this.state.dataSource.cloneWithRows(newArray)});
      if (category !== selectedCategory) return;
      var newArray = this.currPosts[selectedCategory][STRINGS.POSTS].slice();
      //Puts in some placeholders when needed
      if(newArray.length === 0) {
        newArray.push({category: selectedCategory, postObj: STRINGS.PLACEHOLDER, key: 'p1'});
        newArray.push({category: selectedCategory, postObj: STRINGS.PLACEHOLDER, key: 'p2'});
      }
      Amplitude.logEvent(STRINGS.ARTICLES_PREVIEW_REQUEST, {category: selectedCategory});
      this.setState({selectedCategoryData: newArray});
    }

    //Sends the fetch request, populates data with the new articles and alerts listView about potential change
    //Specific to category articles
    async fetchNewCategoryHeadlines(category, categoryURL, loadMore) {
      let response = await fetch(categoryURL);
      let responseData = await response.json();
      var counter = 0;
      var view = this;
      responseData.forEach(function(post) {
        if(view.currPosts[category][STRINGS.HASHED][post.id] === undefined) {
          view.currPosts[category][STRINGS.HASHED][post.id] = 1;
          var postObject = {category: category, postObj: post, key: post.id};
          if(loadMore === true) {
            view.currPosts[category][STRINGS.POSTS].push(postObject);
          } else {
            view.currPosts[category][STRINGS.POSTS].splice(counter,0,postObject);
            counter += 1;
          }
        }
      });
      this.convertDataToMap(category);
      return counter;
    }

    //Determines the page and code for the category fetching, and calls the above function
    async handleCategoryFetching(counter, loadMore, category) {
      let categoryURL = STRINGS.REQUEST_SMALL_PAGE +counter+STRINGS.CATEGORIES_URL+CATEGORIES[category];
      if(category === STRINGS.ALL) {
        categoryURL = STRINGS.REQUEST_SMALL_PAGE+counter;
      }
      return await this.fetchNewCategoryHeadlines(category, categoryURL, loadMore);
    }

    //Handles all requests to fetch more data, and figures out whether it should get category only or also featured headlines too
    async fetchData(loadMore, category) {
      if (loadMore || this.currPosts[category][STRINGS.PAGE] === 1) {
        await this.handleCategoryFetching(this.currPosts[category][STRINGS.PAGE],loadMore,category);
      } else {
        var counter = 1;
        while (true) {
          var refreshed = await this.handleCategoryFetching(counter,loadMore,category);
          if (refreshed !== 3) break;
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
          this.currPosts[selectedCategory][STRINGS.PAGE] += 1;
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
    async setCategory(value) {
      if (value === selectedCategory) return;
      // this.currPosts[selectedCategory]["page"] = 1;
      selectedCategory = value;
      this.setState({selectedCategory: value});
      Amplitude.logEvent(STRINGS.CATEGORY_CHANGED, {category: selectedCategory});
      // this.currPosts[selectedCategory] = {page: 1, posts:[], hashed:{}};
      this.convertDataToMap((' ' + selectedCategory).slice(1));
      this.refs.listview.scrollToLocation({animated: false, sectionIndex:0, itemIndex:0, viewPosition:2});
      this.fetchDataIsBusy = true;
      await this.fetchData(false, (' ' + selectedCategory).slice(1));
    }

    //Renders the headers for the sections
    renderSectionHeader() {
       return (
         <View style={styles.categoriesHeaderContainer}>
           <View style={{flexDirection: ALIGNMENTS.ROW}}>
             <Text style={styles.categoriesText}>
               {selectedCategory}
             </Text>
           </View>
         </View>
     )
   }

   //Handles rendering rows by calling the NewsFeedItem and passing data to it
  _renderRow(data) {
    // console.log("This is my id", data.item.key);
    if(data.item.postObj !== STRINGS.PLACEHOLDER) {
      return <NewsFeedItem key={data.item.key} postID={data.item.key} data={data.item} onPress={this.goToPost} context={STRINGS.HEADLINES}
      onAuthorPress = {authorID=>this.props.navigation.navigate("AuthorDetail", { id: authorID})} />

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
    for (var category in CATEGORIES) {
      // skip loop if the property is from prototype
      if (!CATEGORIES.hasOwnProperty(category)) continue;
      categoriesList.push({key: category});
    }
    return categoriesList;
  }

  setTextStyle(category) {
    if (category === selectedCategory) {
      return {color: COLORS.CARDINAL, fontFamily: FONTS.CENTURY, textAlign: ALIGNMENTS.CENTER};
    }
    return {color: COLORS.DARK_GRAY, fontFamily: FONTS.CENTURY, textAlign: ALIGNMENTS.CENTER};
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

  _toggleModal = () =>
  this.setState({ isModalVisible: !this.state.isModalVisible });

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
      type={STRINGS.STATIC}
      ref={REFS.DRAWER}
      content={this.sideMenu()}
      openDrawerOffset={0.4}
      styles={drawerStyles}
      tweenHandler={Drawer.tweenPresets.parallax}
      captureGestures={true}
      negotiatePan={true}
      tapToClose={true}
      onOpenStart={() => StatusBar.setHidden(true)}
      onCloseStart={() => StatusBar.setHidden(false)}
      >
          <Modal 
          style = {{
            backgroundColor: 'white'}}
            isVisible={this.state.isModalVisible}>

        {/* Header */}
        <View 
          style = {{
            marginTop: 40,
            borderBottomWidth: 4,
            borderColor: 'grey',
            alignItems: 'center',
            flex: 0.4, 
          }}> 
          
          <Text style= {{
            fontFamily: 'PT Serif', 
            fontSize: 24
          }}>Notifications</Text>
          
          <Text style= {{
            fontFamily: 'PT Serif'
          }}>How often do you want to hear from The Daily?</Text>
        
        </View>

        <View 
          style = {{
            flex: 1, 
            backgroundColor: 'white',
          }}> 

          <View style = {{ flex: 1 , flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'grey'}}> 
            <View style = {{margin: 10, flex: 1, alignItems: 'center'}}>
              <Image 
              style={{ width: 35, height: 35 }}
              source={require('../media/breaking.png')}></Image>
            </View>

            <View style = {{flex: 4, margin: 5}}>
              <Text style = {{fontSize: 16, fontFamily: 'PT Serif'}}>Breaking News</Text>
              <Text style = {{fontSize: 13, fontFamily: 'PT Serif'}}>Important stories, as they happen</Text>
            </View>

            <View style = {{margin: 15, flex: 1, alignItems: 'center'}}>
            <ToggleSwitch
              isOn={this.state.isOnBreakingNews}
              onColor='maroon'
              offColor='grey'
              size='small'
              onToggle={ isOnBreakingNews => this.setState(( {isOnBreakingNews})) }/>
            </View>

          </View>



          <View style = {{ flex: 1 , flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'grey'}}> 
            <View style = {{margin: 10, flex: 1, alignItems: 'center'}}>
              <Image 
              style={{ width: 35, height: 35 }}
              source={require('../media/sunicon.png')}></Image>
            </View>

            <View style = {{flex: 4, margin: 5}}>
              <Text style = {{fontSize: 16, fontFamily: 'PT Serif'}}>Every day</Text>
              <Text style = {{fontSize: 13, fontFamily: 'PT Serif'}}>Daily news roundup</Text>
            </View>

            <View style = {{margin: 15, flex: 1, alignItems: 'center'}}>
            <ToggleSwitch
              isOn={this.state.isOnEveryDay}
              onColor='maroon'
              offColor='grey'
              size='small'
              onToggle={ isOnEveryDay => this.setState(( {isOnEveryDay})) }/>
            </View>

          </View>



          <View style = {{ flex: 1 , flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'grey'}}> 
            <View style = {{margin: 10, flex: 1, alignItems: 'center'}}>
              <Image 
              style={{ width: 32, height: 32 }}
              source={require('../media/calendaricon.png')}></Image>
            </View>

            <View style = {{flex: 4, margin: 5}}>
              <Text style = {{fontSize: 16, fontFamily: 'PT Serif'}}>Every week</Text>
              <Text style = {{fontSize: 13, fontFamily: 'PT Serif'}}>Weekly Leland's Digest</Text>
            </View>

            <View style = {{margin: 15, flex: 1, alignItems: 'center'}}>
            <ToggleSwitch
              isOn={this.state.isOnEveryWeek}
              onColor='maroon'
              offColor='grey'
              size='small'
              onToggle={ isOnEveryWeek => this.setState(( {isOnEveryWeek})) }/>
            </View>

          </View>





        </View>

        <View 
          style = {{
            flex: 3, 
            backgroundColor: 'white',
          }}> 
        </View>

        <View style = {{margin: 20, alignItems: 'center'}}>
            <TouchableOpacity 
              style = {{ 
                height: 40,
                width: 200,
                padding: 10,
                borderRadius: 10,
                alignItems: 'center',
                backgroundColor:'maroon'}}
              onPress={this._toggleModal}>
              <Text style={{
                alignSelf: 'center', 
                color: 'white',
                fontFamily: 'Arial'
                }}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* <View style = {{flex: 0.2}}>
          </View> */}

        </Modal>

        <Header ref={REFS.HEADER} drawerHandler={this.drawerHandler} searchHandler={this.searchHandler}/>
        <View ref={REFS.VIEW} style={{flex: 1, backgroundColor:COLORS.GHOST_WHITE, alignItems:'center'}}>
        <StatusBar
          ref={REFS.STATUS_BAR}
          barStyle={STRINGS.LIGHT_CONTENT}
        />
        <SectionList
            ref={REFS.LIST}
            removeClippedSubviews={false}
            disableVirtualization={true}
            refreshing={this.state.refreshing}
            keyExtractor={item => item.key}
            onRefresh={this._onRefresh.bind(this)}
            onEndReached={this.loadMore.bind(this)}
            sections={[{data: this.state.selectedCategoryData, key: this.state.selectedCategory}]}
            renderItem={this._renderRow}
            renderSectionHeader={() => this.renderSectionHeader()}
            ListFooterComponent={() => <ActivityIndicator style={styles.loadingIndicator}/>}
            contentContainerStyle={{width: this.state.width}}
        />
        </View>
      </Drawer>

    )
  }
}
const drawerStyles = {
  drawer: { shadowColor: COLORS.BLACK, shadowOpacity: 0.8, shadowRadius: 3},
}
