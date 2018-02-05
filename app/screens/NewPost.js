import React, {Component} from 'react';
import firebase from 'firebase';

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
  Image,
  TouchableOpacity,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Switch,
  Button,
  Dimensions,
} from 'react-native';
import styles from './styles/newpost.js';
import {NavigationActions} from 'react-navigation';
import {STRINGS, CONSTANT_NUMS, HEIGHTS, Images, COLORS} from '../assets/constants.js';

export default class NewPost extends Component {

  constructor(props) {
    super(props);
    this.state = {
      anon: false,
      imageExists: false,
      imageURI: '',
      post: ''
    };
  }

  showAlert(title, message) {
    AlertIOS.alert(
      title,
      message
    );
  }

  componentWillMount() {
    if (this.props.navigation.state.params.image !== "") {
      this.setState({imageExists: true, imageURI: this.props.navigation.state.params.image})
    } else {
      var view = this;
      firebase.storage().ref(STRINGS.PROFILE_PICTURES).child(this.props.navigation.state.params.user).getDownloadURL()
        .then(function(url) {
          currUserThumbnail = url;
          view.setState({imageURI: url, imageExists: true});
        }).catch(function(error){

        });
    }
  }

  createPost() {
    //Push body
    //Wait then push everything else
    //Exit
    if(this.state.post === undefined || this.state.post === null || this.state.post.length === 0) {
      this.showAlert("Empty Post", "You cannot upload an empty post");
      return;
    }
    var firebaseApp = firebase.apps[0];
    // firebase.apps[0].database().ref().once('value', (snap) =>  {
    //   console.log(snap.val());
    // });
    var bodies = firebaseApp.database().ref(STRINGS.POSTS_BODIES);
    var posts = firebaseApp.database().ref(STRINGS.POSTS);
    var userPosts = firebaseApp.database().ref(STRINGS.USERS).child(this.props.navigation.state.params.user);
    var key = posts.push().key;
    bodies.child(key).set({body: this.state.post});
    var long = STRINGS.NO;
    if(this.state.post.length > CONSTANT_NUMS.CHATTER_LIMIT) long = STRINGS.YES;
    var anonString = STRINGS.NO;
    if (this.state.anon) anonString = STRINGS.YES;
    var postDetails = {
      TimeStamp: firebase.database.ServerValue.TIMESTAMP,
      anon: anonString,
      author: this.props.navigation.state.params.user,
      body: key,
      long: long,
      repliesCount: 0,
      votes: 0,
      score: 0
    };

    var view = this;
    posts.child(key).set(postDetails, function () {
      firebaseApp.database().ref(STRINGS.POSTS).child(key).once(STRINGS.VAL, (snap) => {
          const timestamp = snap.val().TimeStamp;
          var sortDate = timestamp * -1;
          postDetails.sortDate = sortDate;
          userPosts.child(STRINGS.POSTS).child(key).set({post: key, sortDate: sortDate});
          if (anonString === STRINGS.NO) userPosts.child(STRINGS.PUBLIC_POSTS).child(key).set({post: key, sortDate: sortDate});
          posts.child(key).set(postDetails, function () {
            view.props.navigation.state.params.update();
            view.props.navigation.dispatch(NavigationActions.back());
          });
      });
    });
  }

  decideColor(type) {
    if (this.state.anon) {
      if(type === 'text') {
        return styles.activeAnonLabel;
      } else {
        return styles.activeAnon;
      }
    } else {
      if(type === 'text') {
        return styles.inactiveAnonLabel;
      } else {
        return styles.inactiveAnon;
      }
    }
  }

  render() {
    return (
      <View style={styles.container} onLayout={ this.onChangeLayout }>
        <StatusBar
          hidden={true}/>
        <View style={styles.header}>
          {(!this.state.imageExists || this.state.anon) && <Image style={styles.userImage} source={Images.ANON_SMALL}/>}
          {(this.state.imageExists && !this.state.anon) && <Image style={styles.userImage} source={{uri: this.state.imageURI}}/>}
          <Text style={styles.title}>Write an update</Text>
          <TouchableOpacity onPress={() => this.props.navigation.dispatch(NavigationActions.back())}>
          <Image style={styles.close} source={Images.CLOSE}/>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView style={{flex: 1, justifyContent: 'center'}} behavior={STRINGS.PAD}>
          <TextInput
            style={styles.textInput}
            multiline = {true}
            autoFocus={true}
            placeholder={"Share how was campus today..."}
            placeholderTextColor={COLORS.LIGHT_GRAY}
            selectionColor={COLORS.CARDINAL}
            onChangeText={(text) => this.setState({post: text})}
          />
          <View style={styles.actionView}>

            <TouchableHighlight
              style={styles.postButton}
              onPress={this.createPost.bind(this)}
              underlayColor={COLORS.DARK_GRAY}>
                <Text style={styles.postText}>Post</Text>
              </TouchableHighlight>
          </View>
        </KeyboardAvoidingView>

      </View>
    );
  }

}
