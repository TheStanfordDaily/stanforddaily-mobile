'use strict';

import React, {Component} from 'react';
import ReactNative from 'react-native';
const firebase = require('firebase');

const {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
  Image,
  TouchableWithoutFeedback,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Switch,
  Button
} = ReactNative;

import {NavigationActions} from 'react-navigation';

export default class NewPost extends Component {

  constructor(props) {
    super(props);
    this.state = {
      anon: false,
      imageExists: false,
      imageURI: ''
    };
  }

  componentWillMount() {
    if (this.props.navigation.state.params.image !== "") {
      this.setState({imageExists: true, imageURI: this.props.navigation.state.params.image})
    } else {
      var view = this;
      firebase.storage().ref('profile_pictures').child(""+this.props.navigation.state.params.user).getDownloadURL()
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
    var firebaseApp = firebase.apps[0];
    // firebase.apps[0].database().ref().once('value', (snap) =>  {
    //   console.log(snap.val());
    // });
    var bodies = firebaseApp.database().ref("postsBodies/");
    var posts = firebaseApp.database().ref("posts/");
    var userPosts = firebaseApp.database().ref("Users/" + this.props.navigation.state.params.user);
    var key = posts.push().key;
    bodies.child(key).set({body: this.state.post});
    var long = "no";
    if(this.state.post.length > 180) long = "yes";
    var anonString = "no";
    if (this.state.anon) anonString = "yes";
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
      firebaseApp.database().ref("posts/"+key).once('value', (snap) => {
          const timestamp = snap.val().TimeStamp;
          var sortDate = timestamp * -1;
          postDetails.sortDate = sortDate;
          userPosts.child('/posts/'+key).set({post: key, sortDate: sortDate});
          if (anonString === 'no') userPosts.child('/publicPosts/'+key).set({post: key, sortDate: sortDate});
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
      <View style={styles.container}>
        <StatusBar
          hidden={true}
        />
        <View style={styles.header}>
          {(!this.state.imageExists || this.state.anon) && <Image style={styles.userImage} source={require('../media/anon_small.png')}/>}
          {(this.state.imageExists && !this.state.anon) && <Image style={styles.userImage} source={{uri: this.state.imageURI}}/>}
          <Text style={styles.title}>Write an update</Text>
          <TouchableWithoutFeedback onPress={() => this.props.navigation.dispatch(NavigationActions.back())}>
          <Image style={styles.close} source={require('../media/Close.png')}/>
          </TouchableWithoutFeedback>
        </View>
        <KeyboardAvoidingView style={{flex: 1}} behavior={"height"}>
          <TextInput
            style={styles.textInput}
            multiline = {true}
            autoFocus={true}
            placeholder={"Share how was campus today..."}
            placeholderTextColor={"#A5A5A5"}
            selectionColor={"#94171C"}
            onChangeText={(text) => this.setState({post: text})}
          />
          <View style={styles.actionView}>
            <TouchableWithoutFeedback onPress={() => this.setState({anon : !this.state.anon})}>
            <View style={styles.anonView}>
              <Image style={this.decideColor('image')} source={require('../media/anon.png')}/>
              <Text style={this.decideColor('text')}>Anonymous</Text>
            </View>
            </TouchableWithoutFeedback>
            <TouchableHighlight
              style={styles.postButton}
              onPress={this.createPost.bind(this)}
              underlayColor='#4e4e4e'>
                <Text style={styles.postText}>Post</Text>
              </TouchableHighlight>
          </View>
        </KeyboardAvoidingView>

      </View>
    );
  }

}

const styles= StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      flexDirection: 'column'
    },
    header: {
      flexDirection: 'row',
      marginRight: 18,
      marginLeft: 18,
      marginTop: 12,
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    userImage: {
      width: 35,
      height: 35,
      borderRadius: 17.5,
    },
    title: {
      color: '#94171C',
      fontSize: 20,
      fontFamily: 'Helvetica Neue',
      paddingRight: 8
    },
    close: {
      width: 17,
      height: 17,
    },
    textInput: {
      flex: 1,
      marginRight: 14,
      marginLeft: 14,
      marginTop: 14,
      fontFamily: 'Helvetica Neue',
      fontSize: 20,
      fontWeight: '200'
    },
    actionView: {
      height: 50,
      borderTopColor: "#BBBBBB",
      borderTopWidth: 1,
      flexDirection: 'row',
      paddingLeft: 10,
      paddingRight: 10,
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    inactiveAnon: {
      height: 20,
      width: 17,
      tintColor: '#A5A5A5',
      marginRight: 6
    },
    activeAnon: {
      height: 20,
      width: 17,
      tintColor: '#94171C',
      marginRight: 6
    },
    anonView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    activeAnonLabel: {
      color: '#94171C'
    },
    inactiveAnonLabel: {
      color: '#A5A5A5'
    },
    postButton: {
      backgroundColor:'#94171C',
      borderRadius:8,
      width: 58,
      height: 28
    },
    postText:{
      color:'#fff',
      textAlign:'center',
      marginTop: 6,
      fontFamily: 'Helvetica Neue',
      fontSize: 14,
  }
})
