import React, {Component} from 'react';
import ReactNative from 'react-native';
import styles from './styles/detailedpost.js';
import firebase from 'firebase';

import {
  TextInput,
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  AlertIOS
} from 'react-native';

import PostItem from './common/post-item';
import ReplyItem from './common/reply-item';
import Header from './common/header';
import {STRINGS,CONSTANT_NUMS, REFS, PATHS, Images, KEYS} from '../assets/constants.js';
// import RNAmplitute from 'react-native-amplitude-analytics';

const amplitude = new RNAmplitute(KEYS.AMPLITUDE_API);
const {width, height} = Dimensions.get('window');


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

  showAlert(title, message) {
    AlertIOS.alert(
      title,
      message
    );
  }

  goToProfile(userId) {
    // console.log(userId);
    var currUser = this.props.navigation.state.params.currUser;
    if (userId === currUser || userId === null) {
      // console.log("Now looking at currUser", currUser);
      this.props.navigation.navigate(STRINGS.PROFILE, {...{currUser: currUser, profileId: currUser, myProfile: true}});
    } else {
      this.props.navigation.navigate(STRINGS.PROFILE, {...{currUser: currUser, profileId: userId, myProfile: false}});
    }
    // console.log(this.loading);
  }

  goBack() {
    this.props.navigation.goBack();
  }

  listenForDeletes() {
    var view = this;
    var firebaseApp = firebase.apps[0];
    firebaseApp.database().ref().child(STRINGS.POSTS).on(STRINGS.CHILD_REMOVED, function(data) {
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
    firebaseApp.database().ref(STRINGS.REPLIES+'/'+postKey).off();
    // console.log("Turn off listeners");
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
      var body = STRINGS.REPLIES_BODIES + '/' + postKey + '/' + childJSON.body;
      var postObject = {
        body: body,
        long: childJSON.long,
        timeStamp : childJSON.TimeStamp,
        anon: childJSON.anon,
        key: child.key,
      };
      if (childJSON.anon === STRINGS.NO) {
        postObject.author = childJSON.author;
      } else {
        postObject.author = STRINGS.ANON;
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
      // console.log("Reached the end");
      firebaseApp.database().ref(STRINGS.REPLIES+'/'+postKey).on(STRINGS.VAL, (snap) => {
        view.processData(snap,view,postKey);
      });
    }
  }

  determineRef(postKey) {
    var firebaseApp = firebase.apps[0];
    console.log("Hiiiiiii");
    console.log(this.items[this.items.length - 1]);
    if (this.items.length === 0) {
      return firebaseApp.database().ref(STRINGS.REPLIES+'/'+postKey).orderByChild(STRINGS.TIMESTAMP).limitToFirst(CONSTANT_NUMS.REPLIES_LIMIT);
    } else {
      return firebaseApp.database().ref(STRINGS.REPLIES+'/'+postKey).orderByChild(STRINGS.TIMESTAMP).startAt(this.items[this.items.length - 1].timeStamp).limitToFirst(CONSTANT_NUMS.REPLIES_LIMIT);
    }
  }

  fetchMoreReplies() {
    if(!this.loading) {
      this.loading = true;
      var view = this;
      var postKey = this.props.navigation.state.params.data.key;
      var repliesRef = this.determineRef(postKey);
      // console.log("Reached the end");
      repliesRef.once(STRINGS.VAL, (snap) => {
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
    if(this.state.post.length === 0) {
      this.showAlert("Empty Reply", "You cannot have an empty Reply");
      return;
    }
    var firebaseApp = firebase.apps[0];
    // firebase.apps[0].database().ref().once('value', (snap) =>  {
    //   console.log(snap.val());
    // });
    var bodies = firebaseApp.database().ref(STRINGS.REPLIES_BODIES);
    var replies = firebaseApp.database().ref(STRINGS.REPLIES);
    var postKey = this.props.navigation.state.params.data.key;
    var replyKey = replies.push().key;
    bodies.child(postKey).child(replyKey).set({body: this.state.text});
    var long = STRINGS.NO;
    if(this.state.text.length > CONSTANT_NUMS.CHATTER_LIMIT) long = STRINGS.YES;
    var anonString = STRINGS.NO;
    if (this.state.anon) anonString = STRINGS.YES;
    var replyDetails = {
      TimeStamp: firebase.database.ServerValue.TIMESTAMP,
      anon: anonString,
      author: this.props.navigation.state.params.currUser,
      body: replyKey,
      long: long,
    };
    var view = this;
    firebaseApp.database().ref(STRINGS.POSTS).child(postKey).child(STRINGS.REPLIES_COUNT).transaction(function(currentReplies) {
      return (currentReplies || 0) + 1;
    });
    replies.child(postKey).child(replyKey).set(replyDetails, function () {
      view.fetchMoreReplies();
    });
    this.setState({text: '', height: 0});
    amplitude.logEvent(STRINGS.NEW_REPLY, {post: postKey});
  }

  _renderItem(item) {
    return (
      <ReplyItem item={item} goToProfile={this.goToProfile} firebase={firebase}/>
    );
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex:1, alignItems: 'center'}}>
      <View style={{width: '100%'}}>
        <Header title={this.props.navigation.state.params.name + STRINGS.CHATTER_POST_SUFFIX} goBack={this.goBack} ref={REFS.HEADER}/>
      </View>
        <View style={styles.container}>
          <ScrollView>
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
            <View style={styles.mainView}>
              <PostItem
                item={this.props.navigation.state.params.data}
                currUser={this.props.navigation.state.params.currUser}
                removeAtIndex={() => this.goBack()}
                goToProfile={this.goToProfile}
                context={STRINGS.DETAILED_POST}
                firebase={firebase}
              />
            </View>
            </TouchableOpacity>
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
          <View contentContainerStyle={styles.writeAReply} behavior={STRINGS.PAD}>
            <View style={[styles.writeAReply, {height: Math.min(height/4, Math.max(52, this.state.height+20))}]}>
              <View style={[styles.textInputWrapper, {height: Math.min(height/4-20, Math.max(32, this.state.height))}]}>
                <TextInput
                  {...this.props}
                  multiline={true}

                  onChangeText={(text) => this.setState({text:text})}
                  onContentSizeChange={(size) => this.setState({height: size.nativeEvent.contentSize.height+10})}
                  style={[styles.textInput, {height: Math.min(height/4-20, Math.max(32, this.state.height))}]}
                  value={this.state.text}
                  placeholder={STRINGS.REPLY_PLACEHOLDER}
                />
              </View>
              <TouchableOpacity onPress={this.createAReply.bind(this)}>
                <Image style={styles.post} source={Images.SEND}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
