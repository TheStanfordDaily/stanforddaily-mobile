/**
 * Sample Firebase & React Native App
 * https://github.com/davideast/firebase-react-native-sample
 */
'use strict';

import React, {Component} from 'react';
import ReactNative from 'react-native';
const firebase = require('firebase');

const {
  TextInput,
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Dimensions,
  Keyboard,
  ScrollView,

} = ReactNative;

import PostItem from './common/post-item';
import ReplyItem from './common/reply-item';
const {width, height} = Dimensions.get('window');
import Header from './common/header';

export default class DetailedPost extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: function(row1, row2) {
          return row1.key !== row2.key;
        },
      }),
      text: '',
      height: 0,
      anon: false
    };
    this.loading = false;
    this.allLoadedReplies = {};
    this.items = [];
    this.goBack = this.goBack.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
  }

  goToProfile(userId) {
    console.log(userId);
    var currUser = this.props.navigation.state.params.currUser;
    if (userId === currUser || userId === null) {
      console.log("Now looking at currUser", currUser);
      this.props.navigation.navigate("Profile", {...{currUser: currUser, profileId: currUser, myProfile: true}});
    } else {
      this.props.navigation.navigate("Profile", {...{currUser: currUser, profileId: userId, myProfile: false}});
    }
    console.log(this.loading);
  }

  goBack() {
    this.props.navigation.goBack();
  }

  listenForDeletes() {
    var view = this;
    var firebaseApp = firebase.apps[0];
    firebaseApp.database().ref().child('posts').on('child_removed', function(data) {
      if (data.key === view.props.navigation.state.params.data.key) view.goBack();
    });
  }

  componentDidMount() {
    this.fetchMoreReplies();
    this.listenForDeletes();
  }

  componentWillUnmount() {
    var firebaseApp = firebase.apps[0];
    var postKey = this.props.navigation.state.params.data.key;
    firebaseApp.database().ref('/replies/'+postKey).off();
    console.log("Turn off listeners");
    clearInterval();
  }

  update(view) {
    view.setState({
      dataSource: view.state.dataSource.cloneWithRows(view.items),
    });
  }

  processData(snap, view, postKey) {
    var counter = 0;
    snap.forEach((child) => {
      var childJSON = child.val();
      var body = '/repliesBodies/' + postKey + '/' + childJSON.body;
      var postObject = {
        body: body,
        long: childJSON.long,
        timeStamp : childJSON.TimeStamp,
        anon: childJSON.anon,
        key: child.key,
      };
      if (childJSON.anon === "no") {
        postObject.author = childJSON.author;
      } else {
        postObject.author = "Anonymous";
      }
      if(view.allLoadedReplies[child.key] !== 1) {
        view.items.push(postObject);
        counter += 1;
        view.allLoadedReplies[child.key] = 1;
      }
    });
    view.update(view);
    return counter;
  }

  listenForReplies() {
    if(!this.loading) {
      var firebaseApp = firebase.apps[0];
      this.loading = true;
      var view = this;
      var postKey = this.props.navigation.state.params.data.key;
      console.log("Reached the end");
      firebaseApp.database().ref('/replies/'+postKey).on('value', (snap) => {
        view.processData(snap,view,postKey);
      });
    }
  }

  determineRef(postKey) {
    var firebaseApp = firebase.apps[0];
    console.log("Hiiiiiii");
    console.log(this.items[this.items.length - 1]);
    if (this.items.length === 0) {
      return firebaseApp.database().ref('/replies/'+postKey).orderByChild("TimeStamp").limitToFirst(10);
    } else {
      return firebaseApp.database().ref('/replies/'+postKey).orderByChild("TimeStamp").startAt(this.items[this.items.length - 1].timeStamp).limitToFirst(10);
    }
  }

  fetchMoreReplies() {
    if(!this.loading) {
      this.loading = true;
      var view = this;
      var postKey = this.props.navigation.state.params.data.key;
      var repliesRef = this.determineRef(postKey);
      console.log("Reached the end");
      repliesRef.once('value', (snap) => {
        if (view.processData(snap, view, postKey) === 0) {
          view.loading = false;
          view.listenForReplies();
        }
        view.loading = false;
      });
    }
  }

  decideColor(type) {
    if (this.state.anon) {
      return styles.activeAnon;
    } else {
      return styles.inactiveAnon;
    }
  }

  createAReply() {
    //Push body
    //Wait then push everything else
    //Exit
    var firebaseApp = firebase.apps[0];
    // firebase.apps[0].database().ref().once('value', (snap) =>  {
    //   console.log(snap.val());
    // });
    var bodies = firebaseApp.database().ref("repliesBodies/");
    var replies = firebaseApp.database().ref("replies/");
    var postKey = this.props.navigation.state.params.data.key;
    var replyKey = replies.push().key;
    bodies.child(postKey).child(replyKey).set({body: this.state.text});
    var long = "no";
    if(this.state.text.length > 180) long = "yes";
    var anonString = "no";
    if (this.state.anon) anonString = "yes";
    var replyDetails = {
      TimeStamp: firebase.database.ServerValue.TIMESTAMP,
      anon: anonString,
      author: this.props.navigation.state.params.currUser,
      body: replyKey,
      long: long,
    };
    var view = this;
    firebaseApp.database().ref('posts/'+postKey+'/repliesCount').transaction(function(currentReplies) {
      return (currentReplies || 0) + 1;
    });
    replies.child(postKey).child(replyKey).set(replyDetails, function () {
      view.fetchMoreReplies();
    });
    this.setState({text: '', height: 0});
  }

  _renderItem(item) {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ReplyItem item={item} goToProfile={this.goToProfile} firebase={firebase}/>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    return (
        <View style={styles.container}>
          <Header title={this.props.navigation.state.params.name + "'s post"} goBack={this.goBack} ref='Header'/>
          <ScrollView>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.mainView}>
              <PostItem
                item={this.props.navigation.state.params.data}
                currUser={this.props.navigation.state.params.currUser}
                goToProfile={this.goToProfile}
                context={'DetailedPost'}
                firebase={firebase}
              />
            </View>
            </TouchableWithoutFeedback>
            <ListView
              // onEndReached={this.loadMore.bind(this)}

              style={{flex:1}}
              dataSource={this.state.dataSource}
              renderRow={this._renderItem.bind(this)}
              enableEmptySections={true}
              contentContainerStyle={styles.listview}
              onEndReached={this.fetchMoreReplies.bind(this)}
            />
            </ScrollView>
          <KeyboardAvoidingView contentContainerStyle={styles.writeAReply} behavior={"padding"}>
            <View style={[styles.writeAReply, {height: Math.min(height/4, Math.max(52, this.state.height+20))}]}>
              <View style={[styles.textInputWrapper, {height: Math.min(height/4-20, Math.max(32, this.state.height))}]}>
                <TextInput
                  {...this.props}
                  multiline={true}

                  onChangeText={(text) => this.setState({text:text})}
                  onContentSizeChange={(size) => this.setState({height: size.nativeEvent.contentSize.height+10})}
                  style={[styles.textInput, {height: Math.min(height/4-20, Math.max(32, this.state.height))}]}
                  value={this.state.text}
                  placeholder={"Write a reply..."}
                />
                <TouchableWithoutFeedback onPress={() => this.setState({anon : !this.state.anon})}>
                  <Image style={this.decideColor('image')} source={require('../media/anon.png')}/>
                </TouchableWithoutFeedback>
              </View>
              <TouchableWithoutFeedback onPress={this.createAReply.bind(this)}>
                <Image style={styles.post} source={require('../media/send.png')}/>
              </TouchableWithoutFeedback>
            </View>
          </KeyboardAvoidingView>
        </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between"
  },
  writeAReply: {
    width: "100%",
    backgroundColor: "white",
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  textInputWrapper: {
    flex:1,
    borderWidth: 1,
    borderColor: '#A5A5A5',
    borderRadius: 7,
    marginLeft: 14,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  textInput: {
    color: '#4e4e4e',
    height: 28,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    flex: 1,
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
  },
  inactiveAnon: {
    height: 20,
    width: 17,
    tintColor: '#A5A5A5',
    marginRight: 6,
    marginBottom: 6
  },
  activeAnon: {
    height: 20,
    width: 17,
    tintColor: '#94171C',
    marginRight: 6,
    marginBottom: 6
  },
  post: {
    height: 30,
    width: 30,
    tintColor: '#94171C',
    marginRight: 8,
    marginBottom: 11,
    marginLeft: 4
  },
  listview: {
    flex: 1,
  },
});
