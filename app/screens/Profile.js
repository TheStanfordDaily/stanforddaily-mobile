'use strict';

import React, {Component} from 'react';
import ReactNative from 'react-native';
import Lightbox from 'react-native-lightbox';
import _ from 'lodash';
import RNFetchBlob from 'react-native-fetch-blob'
import ImagePicker from 'react-native-image-crop-picker';
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
  ScrollView,
  Dimensions,
  ListView,
  ActionSheetIOS
} = ReactNative;

import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import PostItem from './common/post-item';

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob
const {width, height} = Dimensions.get('window');

var currUser = "";
var profileId = "";
export default class Profile extends Component {

  constructor(props) {
    super(props);
    this.items = [];
    this.loading = false;
    this.listenForItems = _.debounce(this.listenForItems, 150);
    this.allLoadedPosts = {};
    this.goToPost = this.goToPost.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.handleDeletion = this.handleDeletion.bind(this);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: function(row1, row2) {
          return row1.key !== row2.key;
        },
      }),
      displayName: "",
      imageURI: "",
      imageExists: false
    }
  }

  componentWillMount() {
    var firebaseApp = firebase.apps[0];
    currUser = this.props.navigation.state.params.currUser;
    profileId = this.props.navigation.state.params.profileId;
    this.itemsRef = firebaseApp.database().ref().child('Users/'+profileId+'/publicPosts');
    if (currUser === profileId) this.itemsRef = firebaseApp.database().ref().child('Users/'+profileId+'/posts');
    var displayName = firebaseApp.database().ref("/Users/"+profileId + "/name");
    var view = this;
    firebase.storage().ref('profile_pictures').child(profileId).getDownloadURL()
      .then(function(url) {
        view.setState({imageURI: url, imageExists: true});
      })
      .catch(function(error){

      });
    displayName.once('value', (snap) => {
      view.setState({ displayName: snap.val()});
    });
  }

  componentDidMount() {
    var firebaseApp = firebase.apps[0];
    this.listenForItems(this.itemsRef, true);
  }

  currUserVote(childJSON) {
    if (typeof childJSON.voters !== "undefined") {
      if (currUser in childJSON.voters) {
        return childJSON.voters[currUser];
      }
    }
    return "0";
  }

  update(view) {
    var newArr = view.items.slice();
    view.setState({
      dataSource: view.state.dataSource.cloneWithRows(newArr),
    });
  }

  refToItems(itemsRef, refresh) {
    if (refresh || this.items.length === 0) {
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
          var postObject = {
            key: child.key,
          };
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

  signOut() {
    firebase.auth().signOut();
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Chatter'}),]
    });
    this.props.navigation.dispatch(resetAction);
    // this.props.navigation.state.params.clear();
    // this.dismissModal();

  }

  dismissModal() {
    this.props.navigation.dispatch(NavigationActions.back());
  }

  loadMore() {
    var firebaseApp = firebase.apps[0];
    this.listenForItems(this.itemsRef, false);
  }

  goToPost(data, author) {
    this.props.navigation.navigate("DetailedPost", {
      ...{data: data, currUser: currUser, name: author, visible: false},
    });
  }

  goToProfile(userId) {
    console.log(userId);
    if (userId !== currUser && userId !== profileId && userId !== null) {
      this.props.navigation.navigate("Profile", {...{currUser: currUser, profileId: userId, myProfile: false}});
    }
    console.log(this.loading);
  }

  deletePost(key) {
    var firebaseApp = firebase.apps[0];
    firebaseApp.database().ref().child('Users/'+currUser+'/posts').child(key).remove();
    firebaseApp.database().ref().child('Users/'+currUser+'/publicPosts').child(key).remove();
    firebaseApp.database().ref().child('posts').child(key).remove();
    firebaseApp.database().ref().child('postsBodies').child(key).remove();
    firebaseApp.database().ref().child('replies').child(key).remove();
    firebaseApp.database().ref().child('repliesBodies').child(key).remove();
    // this.items = [];
    // this.update(this);
    // this.listenForItems(firebaseApp.database().ref().child('Users/'+currUser+'/posts'), false);
  }

  handleDeletion(key) {
    for(var i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].key === key) {
        this.items.splice(i, 1);
        this.update(this);
        break;
      }
    }
  }

  uploadImage(uri, mime = 'application/octet-stream') {
    return new Promise((resolve, reject) => {
      const uploadUri = uri.replace('file://', '');
      let uploadBlob = null;
      var firebaseApp = firebase.apps[0];
      const imageRef = firebaseApp.storage().ref('profile_pictures').child(currUser);

      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` });
        })
        .then((blob) => {
          uploadBlob = blob;
          return imageRef.put(blob, { contentType: mime });
        })
        .then(() => {
          uploadBlob.close();
          ImagePicker.clean().then(() => {
            console.log('removed all tmp images from tmp directory');
          }).catch(e => {
            alert(e);
          });
          return imageRef.getDownloadURL();
        })
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          reject(error);
      });
    });
  }

  uploadOptions() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Upload From Library', 'Upload From Camera', 'Delete', 'Cancel'],
      cancelButtonIndex: 3,
      destructiveButtonIndex: 2,
      title: 'Picture Source'
    },
    (buttonIndex) => {
      var options = {
        width: width,
        height: width,
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
        includeBase64: true
      };
      if (buttonIndex === 0) {
        var view = this;
        ImagePicker.openPicker(options).then(image => {
          view.uploadImage(image.path)
              .then(url => console.log('uploaded'))
              .catch(error => console.log(error));
        });
      } else if (buttonIndex === 1) {
        ImagePicker.openCamera(options).then(image => {
          view.uploadImage(image.path)
              .then(url => console.log('uploaded'))
              .catch(error => console.log(error));
        });
      }
    });
  }

  _renderItem(item) {
    var context = 'list';
    if (this.props.navigation.state.params.myProfile) {
      context = 'profile';
    }
    return (
      <View style={{borderTopColor: "#C8C8C8", borderTopWidth: 1}}>
          <PostItem
          key={item.key}
          item={item}
          firebase={firebase}
          currUser={this.props.navigation.state.params.currUser}
          goToPost={this.goToPost}
          goToProfile={this.goToProfile}
          context={context}
          deletePost={this.deletePost}
          handleDeletion={this.handleDeletion}/>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBarBackground}/>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.closeWrapper}>
            <Icon name="ios-arrow-back" style={styles.back} size={34} color="#ffffff" onPress={this.dismissModal.bind(this)}/>
            {!this.state.imageExists && <Image style={styles.profileImage} source={require('../media/anon_big.png')}>
              {this.props.navigation.state.params.myProfile && (
                <TouchableWithoutFeedback onPress={this.uploadOptions.bind(this)}>
                  <View style={styles.editPhoto}>
                    <Image style={styles.edit} defaultSource={require('../media/anon_small.png')} source={require('../media/edit.png')}/>
                    <Text> Edit </Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </Image>}
            {this.state.imageExists && <Image style={styles.profileImage} source={{uri: this.state.imageURI}}>
              {this.props.navigation.state.params.myProfile && (
                <TouchableWithoutFeedback onPress={this.uploadOptions.bind(this)}>
                  <View style={styles.editPhoto}>
                    <Image style={styles.edit} source={require('../media/edit.png')}/>
                    <Text> Edit </Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </Image>}
            {this.props.navigation.state.params.myProfile && (
              <TouchableWithoutFeedback onPress={this.signOut.bind(this)}>
                <Image style={styles.signout} source={require('../media/signout.png')}/>
              </TouchableWithoutFeedback>
            )}
            {!this.props.navigation.state.params.myProfile && (
              <View style={styles.signout}/>
            )}
          </View>
          <View style={styles.imageMargin}/>
          <Text style={styles.displayName}>{this.state.displayName}</Text>
          <ListView
            onEndReached={this.loadMore.bind(this)}
            dataSource={this.state.dataSource}
            renderRow={this._renderItem.bind(this)}
            enableEmptySections={true}
            style={styles.listview}/>
        </ScrollView>
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
    scrollView: {
      alignItems: 'center'
    },
    back: {
      marginLeft: 14,
    },
    signout: {
      width: 26,
      height: 24,
      marginTop: 8,
      tintColor: 'white',
      marginRight: 14,
      top: 0,
    },
    closeWrapper: {
      height: height/6.6,
      backgroundColor: '#94171C',
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 0,
      width: '100%'
    },
    statusBarBackground: {
      height: 20,
      backgroundColor: '#94171C',
    },
    header:{
      height: height/6.6,
      backgroundColor: '#94171C',
    },
    profileImage: {
      width: 0.46667 * width,
      height: 0.46667 * width,
      borderRadius: (0.46667 * width)/2,
      borderWidth: 2,
      top: 8,
      borderColor: 'white',
      justifyContent: 'flex-end'
    },
    imageMargin: {
      backgroundColor: 'white',
      zIndex: 0,
      height: (0.46667 * width)/2,
    },
    displayName: {
      fontFamily: "Helvetica Neue",
      fontSize: 20,
      color: "#4E4E4E",
      fontWeight: '500',
      marginTop: 6,
      marginBottom: 8
    },
    lightBox: {
      width: 0.46667 * width,
      height: 0.46667 * width,
      borderRadius: (0.46667 * width)/2,
      borderWidth: 0,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    editPhoto: {
      height: '18%',
      width: '100%',
      backgroundColor: 'white',
      opacity: 0.75,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row'
    },
    edit: {
      height: 14,
      width: 14,
    }
})
