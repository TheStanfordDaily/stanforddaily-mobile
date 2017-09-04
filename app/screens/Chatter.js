/**
 * Sample Firebase & React Native App
 * https://github.com/davideast/firebase-react-native-sample
 */
'use strict';

import React, {Component} from 'react';
import ReactNative from 'react-native';
const firebase = require('firebase');
const styles = require('../assets/styles.js')
const moment = require('moment');
moment().format();

const {
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
} = ReactNative;

import PostItem from './common/post-item';

const firebaseConfig = {
    apiKey: "AIzaSyBIUCWibwkLZtyVKZ8cQ5E4uc51OXpn3iA",
    authDomain: "grocerytest-95615.firebaseapp.com",
    databaseURL: "https://grocerytest-95615.firebaseio.com",
    storageBucket: "grocerytest-95615.appspot.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
var currUser = "";
var currUserImage = "../media/abood.jpg";
import _ from 'lodash';

export default class Chatter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: function(row1, row2) {
          console.log(row1.key + " Compared to " + row2.key);
          return row1.key !== row2.key;
        },
      }),
      userStatus: 'none',
      refreshing: false,
    };
    this.itemsRef = this.getRef().child('posts');
    this.items = ["newPost"];
    this.currNum = 0;
    this.callbackNum = 0;
    this.error = false;
    this.loading = false;
    this.goToPost = this.goToPost.bind(this);
    this.listenForItems = _.debounce(this.listenForItems, 150);
    this.allLoadedPosts = {};
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  update(view) {
    var newArr = view.items.slice();
    view.setState({
      dataSource: view.state.dataSource.cloneWithRows(newArr),
    });
  }

  currUserVote(childJSON) {
    if (typeof childJSON.voters !== "undefined") {
      if (currUser in childJSON.voters) {
        return childJSON.voters[currUser];
      }
    }
    return "0";
  }

  refToItems(itemsRef, refresh) {
    if (refresh) {
      return itemsRef.orderByChild('sortDate').limitToFirst(3);
    } else {
      return itemsRef.orderByChild('sortDate').startAt(this.items[this.items.length - 1].sortDate).limitToFirst(4);
    }
  }

  listenForItems(itemsRef,refresh) {
    if(!this.loading && !(this.allLoaded && !refresh)) {
      this.loading = true;
      var view = this;
      var currInsertIdx = 1;
      var ref = this.refToItems(itemsRef, refresh);
      ref.once('value', (snap) => {
        snap.forEach((child) => {
          var childJSON = child.val();
          var body = '/postsBodies/' + childJSON.body;
          var postObject = {
            body: body,
            repliesCount: childJSON.repliesCount,
            votes: childJSON.votes,
            long: childJSON.long,
            timeStamp : childJSON.TimeStamp,
            anon: childJSON.anon,
            key: child.key,
            sortDate: childJSON.sortDate,
          };
          if (childJSON.anon === "no") {
            postObject.author = '/Users/' + childJSON.author;
          } else {
            postObject.author = "Anonymous";
          }
          postObject.userVote = view.currUserVote(childJSON);
          if(view.allLoadedPosts[child.key] !== 1) {
            if(refresh) {
              view.items.splice(currInsertIdx,0,postObject);
              currInsertIdx += 1;
              view.allLoadedPosts[child.key] = 1;
            } else if (view.items[view.items.length - 1].key !== child.key) {
              view.items.push(postObject);
              view.allLoadedPosts[child.key] = 1;
            }
          }
        });
        view.update(view, refresh);
        view.loading = false;
      });
    }
  }

  componentDidMount() {
    // var view = this;
    this.makeSureUserSignedIn();
    // firebase.auth().signOut();
  }

  _onRefresh() {
    // this.items = ["NewPost"];
    // this.allLoadedPosts = {};
    this.setState({refreshing: true});
    this.makeSureUserSignedIn();
    this.setState({refreshing: false});
  }

  loadMore() {
    console.log("loadingmore")
    this.listenForItems(firebaseApp.database().ref().child('posts'), false);
  }

  pointToSignIn() {
    var view = this;
    var onpressFunc = () => this.props.navigation.navigate("SignIn", {...{loadPosts: view.makeSureUserSignedIn.bind(view)}});
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onpressFunc}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontFamily:"Helvetica Neue", fontSize:16, color:"#4E4E4E"}}>Please sign in/up to use this service</Text>
            <Text style={{fontFamily:"Helvetica Neue", fontSize:16, color:"#4E4E4E"}}>Tap anywhere to go to sign in/up page</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  pointToVerify() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.makeSureUserSignedIn.bind(this)}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontFamily:"Helvetica Neue", fontSize:16, color:"#4E4E4E"}}>Please verify your email to use this service</Text>
            <Text style={{fontFamily:"Helvetica Neue", fontSize:16, color:"#4E4E4E"}}>Tap anywhere once verified to load</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  loadTheView() {
    return (
      <View style={styles.container}>

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

  render() {
    if(this.state.userStatus === 'none') {
      return this.pointToSignIn();
    } else if (this.state.userStatus === 'signedIn') {
      return this.pointToVerify();
    } else {
      return this.loadTheView()
    }
  }

  // create the user object and push to database
  addUserToDatabase(newUser) {
    var usersRef = firebaseApp.database().ref("Users");
      usersRef.child(newUser.uid).once('value', function(snapshot) {
        if (snapshot.val() === null) {
          var key = newUser.uid;
          var user = {name: newUser.displayName, pic: 'lolwut'};
          usersRef.child(key).set(user, function () {
          });
        }
      });
  }

  makeSureUserSignedIn() {
    var view = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        user.reload().then(function() {
            currUser = user.uid;
            if(user.emailVerified) {
              view.addUserToDatabase(user);
              view.setState({userStatus : "verified"});
              view.listenForItems(firebaseApp.database().ref().child('posts'), true);
            } else {
              view.setState({userStatus : "signedIn"});
            }
        });
      } else {
        view.props.navigation.navigate("SignIn", {...{loadPosts: view.makeSureUserSignedIn.bind(view)}});
      }
    });
  }

  updateAfterComingBack() {
    // this.items = ["NewPost"];
    // this.allLoadedPosts = {};
    this.makeSureUserSignedIn();
  }

  startNewPost() {
    // console.log("Navigate to new post");
    // this.items = [];
    var dataToPass = {user: currUser, image: currUserImage, update: this.updateAfterComingBack.bind(this)};
    this.props.navigation.navigate("NewPost", {
      ...dataToPass,
    });
  }

  goToPost(data, author) {
    console.log(data);
    this.props.navigation.navigate("DetailedPost", {
      ...{data: data, currUser: currUser, name: author, visible: false},
    });
  }
  _renderItem(item) {
    if(item !== "newPost") {
      return <PostItem key={item.key} item={item} firebase={firebase} currUser={currUser} goToPost={this.goToPost} context={'list'}/>
    } else {
      return (
        <TouchableWithoutFeedback key={"NewPost"} onPress={this.startNewPost.bind(this)}>
          <View style={styles.newPost}>
            <Image style={styles.userImage} source={require('../media/abood.jpg')}/>
            <Text style={styles.placeHolder}>Share how was campus today…</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }

}
