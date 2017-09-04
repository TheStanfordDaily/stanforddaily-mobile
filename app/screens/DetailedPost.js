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

export default class DetailedPost extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: function(row1, row2) {
          console.log(row1.key + " Compared to " + row2.key);
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
  }

  componentDidMount() {
    this.listenForReplies();
  }

  componentWillUnmount() {
    var firebaseApp = firebase.apps[0];
    var postKey = this.props.navigation.state.params.data.key;
    firebaseApp.database().ref('/replies/'+postKey).off();
  }

  update(view) {
    // var newArr = view.items.slice();
    // console.log(newArr);
    view.setState({
      dataSource: view.state.dataSource.cloneWithRows(view.items),
    });
  }

  determineRef(postKey) {

  }

  listenForReplies(itemsRef,refresh) {
    if(!this.loading) {
      this.loading = true;
      var view = this;
      var firebaseApp = firebase.apps[0];
      var postKey = this.props.navigation.state.params.data.key;
      var repliesRef = this.determineRef(postKey);
      firebaseApp.database().ref('/replies/'+postKey).on('child_added', (child) => {

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
            postObject.author = '/Users/' + childJSON.author;
          } else {
            postObject.author = "Anonymous";
          }
          if(view.allLoadedReplies[child.key] !== 1) {
            // if(refresh) {
            //   view.items.splice(currInsertIdx,0,postObject);
            //   currInsertIdx += 1;
            //   view.allLoadedPosts[child.key] = 1;
            // } else if (view.items[view.items.length - 1].key !== child.key) {

            view.items.push(postObject);
            view.allLoadedReplies[child.key] = 1;
            // }
          }
          view.update(view, refresh);
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
      view.listenForReplies();
    });
    this.setState({text: ''});
  }

  _renderItem(item) {
    console.log("Found a child with body", item.body);
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ReplyItem item={item} firebase={firebase}/>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    return (
        <View style={styles.container}>
          <ScrollView>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.mainView}>
              <PostItem item={this.props.navigation.state.params.data} currUser={this.props.navigation.state.params.currUser} context={'DetailedPost'} firebase={firebase}/>
            </View>
            </TouchableWithoutFeedback>
            <ListView
              // onEndReached={this.loadMore.bind(this)}

              style={{flex:1}}
              dataSource={this.state.dataSource}
              renderRow={this._renderItem.bind(this)}
              enableEmptySections={true}
              contentContainerStyle={styles.listview}
            />
            </ScrollView>
          <KeyboardAvoidingView keyboardVerticalOffset={64} contentContainerStyle={styles.writeAReply} behavior={"padding"}>
            <View style={[styles.writeAReply, {height: Math.min(height/4, Math.max(52, this.state.height+20))}]}>
              <View style={[styles.textInputWrapper, {height: Math.min(height/4-20, Math.max(32, this.state.height))}]}>
                <TextInput
                  {...this.props}
                  multiline={true}
                  
                  onChangeText={(text) => this.setState({text:text})}
                  onContentSizeChange={(size) => this.setState({height: size.nativeEvent.contentSize.height})}
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
    paddingTop: 2,
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
