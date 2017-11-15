'use strict';

import React, {Component} from 'react';
import firebase from 'firebase';
import styles from './styles/chatter.js';
import _ from 'lodash';
import {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
  Image,
  TouchableWithoutFeedback,
  RefreshControl
} from 'react-native';

//A module for time stamps
import moment from 'moment';
moment().format();

import PostItem from './common/post-item'; //Post items
import Header from './common/header'; //The header
import {STRINGS, FIREBASE_CONFIG, REFS, Images} from '../assets/constants.js'; //Constants

const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG); //Configuring firebase

var currUser = "";
var currUserThumbnail = "";

export default class Chatter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: function(row1, row2) {
          return row1.key !== row2.key;
        },
      }),
      userStatus: STRINGS.NONE,
      refreshing: false,
      imageURI: "",
      imageExists: false
    };
    this.itemsRef = firebaseApp.database().ref().child(STRINGS.POSTS); //A reference to all posts
    this.items = [STRINGS.NEW_POST]; //The current items. Only "create new post" is initially loaded
    this.loading = false; //True if app is loading more posts. False if not
    this.goToPost = this.goToPost.bind(this); //A function to handle going to posts
    this.goToProfile = this.goToProfile.bind(this); //A function to handle going to profile
    this.startNewPost = this.startNewPost.bind(this); //A function to handle going to NEWPOST view
    this.listenForItems = _.debounce(this.listenForItems, 150); //A function to regulate fetching from Firebase (places a 150ms interval at least between 2 calls)
    this.allLoadedPosts = {}; //A hashmap of all of the current posts
  }

  goToProfile(userId) {
    // console.log(userId);
    if (userId === currUser || userId === null) { //Trying to access my own profile
      // console.log("Now looking at currUser", currUser);
      this.props.navigation.navigate(STRINGS.PROFILE, {...{currUser: currUser, profileId: currUser, myProfile: true}});
    } else { //Trying to access someone else's profile
      this.props.navigation.navigate(STRINGS.PROFILE, {...{currUser: currUser, profileId: userId, myProfile: false}});
    }
    // console.log(this.loading);
  }

  update(view) { //Handles updating the list view (Not sending requests to Firebase)
    var newArr = view.items.slice();
    view.setState({
      dataSource: view.state.dataSource.cloneWithRows(newArr),
    });
  }

  currUserVote(childJSON) { //A small subroutine to handle showing the current user vote as a string
    if (typeof childJSON.voters !== STRINGS.UNDEFINED) {
      if (currUser in childJSON.voters) {
        return childJSON.voters[currUser];
      }
    }
    return "0";
  }

  refToItems(itemsRef, refresh) { //Figures out the correct reference to Firebase.
    if (refresh) { //Get the posts from the beginning
      return itemsRef.orderByChild(STRINGS.NEWEST_TO_OLDEST).limitToFirst(3);//The number doesn't really matter
    } else { //Load more posts to waht exists
      return itemsRef.orderByChild(STRINGS.NEWEST_TO_OLDEST).startAt(this.items[this.items.length - 1].sortDate).limitToFirst(4); //The number doesn't really matter
    }
  }

  listenForItems(itemsRef,refresh) { //Sends requests to Firebase
    if(!this.loading && !(this.allLoaded && !refresh)) { //Basically if it's not currently loading and not all is loaded, or if it's a refresh
      this.loading = true; //Block anymore requests till the next one
      var view = this; //A reference to the current "this" object (Common JS practice for callbacks)
      var currInsertIdx = 1; //For refresh
      var ref = this.refToItems(itemsRef, refresh); //The reight reference
      ref.once(STRINGS.VAL, (snap) => { //Send a request
        snap.forEach((child) => { //Loop through children (posts)
          var childJSON = child.val(); //Get the JSON value
          var body = '/'+ STRINGS.POSTS_BODIES + '/' + childJSON.body; //Get the body url
          var postObject = { //An object that has all of the necessary post data to create a list item
            body: body,
            repliesCount: childJSON.repliesCount,
            votes: childJSON.votes,
            long: childJSON.long,
            timeStamp : childJSON.TimeStamp,
            anon: childJSON.anon,
            key: child.key,
            sortDate: childJSON.sortDate,
          };
          if (childJSON.anon === STRINGS.NO) { //Anonymous or not
            postObject.author = childJSON.author;
          } else {
            postObject.author = STRINGS.ANON;
          }
          postObject.userVote = view.currUserVote(childJSON); //User vote on the specific post
          if(view.allLoadedPosts[child.key] !== 1) { //Ensuring that no duplicates happen
            if(refresh) { //If refresh we add at the top
              view.items.splice(currInsertIdx,0,postObject);
              currInsertIdx += 1;
              view.allLoadedPosts[child.key] = 1;
            } else if (view.items[view.items.length - 1].key !== child.key) { //if not, append at the end
              view.items.push(postObject);
              view.allLoadedPosts[child.key] = 1;
            }
          }
        });
        view.update(view, refresh); //Update the view after looping
        view.loading = false; //Unlock this function for more requests
      });
    }
  }

  componentDidMount() {
    this.makeSureUserSignedIn(); //Check sign in status
    // firebase.auth().signOut();
  }

  _onRefresh() { //Handles refreshes
    this.items = [STRINGS.NEW_POST];
    this.allLoadedPosts = {};
    this.allLoaded = false;
    this.setState({refreshing: true});
    this.makeSureUserSignedIn();
    this.setState({refreshing: false});
  }

  loadMore() { //Handles loading more
    this.listenForItems(firebaseApp.database().ref().child(STRINGS.POSTS), false);
  }

  pointToSignIn() { //Shows a simple view asking user to sign in
    var view = this;
    var onpressFunc = () => this.props.navigation.navigate(STRINGS.SIGN_IN, {...{loadPosts: view.makeSureUserSignedIn.bind(view)}});
    return (
      <View style={styles.container}>
        <Header title={STRINGS.CHATTER} ref={REFS.HEADER}/>
        <TouchableWithoutFeedback onPress={onpressFunc}>
          <View style={styles.failedLoginContainer}>
            <Text style={styles.failedLoginText}>Please sign in/up to use this service</Text>
            <Text style={styles.failedLoginText}>Tap anywhere to go to sign in/up page</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  pointToVerify() { //Shows a simple view asking user to verify their account
    return (
      <View style={styles.container}>
        <Header title={STRINGS.CHATTER} ref={REFS.HEADER}/>
        <TouchableWithoutFeedback onPress={this.makeSureUserSignedIn.bind(this)}>
          <View style={styles.failedLoginContainer}>
            <Text style={styles.failedLoginText}>Please verify your email to use this service</Text>
            <Text style={styles.failedLoginText}>Tap anywhere once verified to load</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  loadTheView() { //Loads the list view
    return (
      <View style={styles.container}>
        <Header title={STRINGS.CHATTER} toProfile={this.goToProfile} ref={REFS.HEADER}/>
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
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}/>

      </View>
    );
  }

  render() { //Renders the right view based on user status
    if(this.state.userStatus === STRINGS.NONE) {
      return this.pointToSignIn();
    } else if (this.state.userStatus === STRINGS.SIGNED_IN) {
      return this.pointToVerify();
    } else {
      return this.loadTheView()
    }
  }

  // create the user object and push to database
  addUserToDatabase(newUser) {
    var usersRef = firebaseApp.database().ref(STRINGS.USERS);
      usersRef.child(newUser.uid).once(STRINGS.VAL, function(snapshot) {
        if (snapshot.val() === null) {
          var key = newUser.uid;
          var user = {name: newUser.displayName};
          usersRef.child(key).set(user, function () {
          });
        }
      });
  }

  listenForDeletes() { //Keeps an eye on deletes that other people make to avoid interacting with deleted posts
    var view = this;
    firebaseApp.database().ref().child(STRINGS.POSTS).on(STRINGS.CHILD_REMOVED, function(data) {
      var key = data.key;
      if (view.allLoadedPosts[key]) {
        for(var i = view.items.length - 1; i >= 0; i--) {
          if (view.items[i].key === key) {
            view.items.splice(i, 1);
            view.update(view);
            break;
          }
        }
      }
    });
  }

  makeSureUserSignedIn() { //Checks user status using firebase authentication
    var view = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        user.reload().then(function() {
            currUser = user.uid;
            if(user.emailVerified) {
              view.addUserToDatabase(user);
              view.setState({userStatus : STRINGS.VERIFIED});
              view.listenForItems(firebaseApp.database().ref().child(STRINGS.POSTS), true);
              view.listenForDeletes();
            } else {
              view.setState({userStatus : STRINGS.SIGNED_IN});
            }
        });
      } else {
        view.setState({userStatus : STRINGS.NONE});
        view.props.navigation.navigate(STRINGS.SIGN_IN, {...{loadPosts: view.makeSureUserSignedIn.bind(view)}});
      }
    });
  }

  updateAfterComingBack() { //Updates the view after user creates a post
    // this.items = ["NewPost"];
    // this.allLoadedPosts = {};
    this.makeSureUserSignedIn();
  }

  startNewPost() { //Prepares starting a new post segue
    // console.log("Navigate to new post");
    // this.items = [];
    var dataToPass = {user: currUser, image: currUserThumbnail, update: this.updateAfterComingBack.bind(this)};
    this.props.navigation.navigate(STRINGS.NEW_POST, {
      ...dataToPass,
    });
  }

  goToPost(data, author) { //Segues to post
    this.props.navigation.navigate(STRINGS.DETAILED_POST, {
      ...{data: data, currUser: currUser, name: author, visible: false},
    });
  }

  _renderItem(item) { //Renders a single list item
    if(item !== STRINGS.NEW_POST) { //Regular post
      return <PostItem
              key={item.key}
              item={item}
              firebase={firebase}
              currUser={currUser}
              goToPost={this.goToPost}
              goToProfile={this.goToProfile}
              context={STRINGS.LIST}
              />
    } else {
      //The top "Create new post" item
      return <NewPostItem startNewPost={this.startNewPost}/>;
    }
  }

}

//CHATTER VIEW ENDS HERE. BELOW IS NEW POST ITEM IMPLEMENTATION

class NewPostItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageExists: false,
      imageURI: ""
    };
  }

  componentWillMount() {
    var view = this;
    firebase.storage().ref().child(STRINGS.PROFILE_PICTURES+'/'+currUser).getDownloadURL()
      .then(function(url) {
        currUserThumbnail = url;
        view.setState({imageURI: url, imageExists: true});
      }).catch(function(error){

      });
  }

  render () {
    return (
      <TouchableWithoutFeedback onPress={() => this.props.startNewPost()}>
        <View style={styles.newPost}>
          {!this.state.imageExists && <Image style={styles.userImage} source={Images.ANON_SMALL}/>}
          {this.state.imageExists && <Image style={styles.userImage} source={{uri: this.state.imageURI}}/>}
          <Text style={styles.placeHolder}>Share how was campus today…</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
