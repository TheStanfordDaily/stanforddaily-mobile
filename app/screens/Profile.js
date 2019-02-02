import React, {Component} from 'react';
import ReactNative from 'react-native';
import _ from 'lodash';
import ImagePicker from 'react-native-image-crop-picker';
import firebase from 'firebase';

import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ListView,
  ActionSheetIOS,
  Dimensions
} from 'react-native';

import {NavigationActions} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import PostItem from './common/post-item';
import {STRINGS, Images, ICONS, COLORS} from '../assets/constants.js';
import styles from './styles/profile.js';
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
    this.removeAtIndex = this.removeAtIndex.bind(this);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: function(row1, row2) {
          return row1.key !== row2.key;
        },
      }),
      displayName: "",
      imageURI: "",
      imageExists: false,
      loadAllowed: true
    }
  }

  //Load initial data and set the initial values for the variables
  componentWillMount() {
    var firebaseApp = firebase.apps[0];
    currUser = this.props.navigation.state.params.currUser;
    profileId = this.props.navigation.state.params.profileId;
    this.itemsRef = firebaseApp.database().ref().child(STRINGS.USERS).child(profileId).child(STRINGS.PUBLIC_POSTS);
    if (currUser === profileId) this.itemsRef = firebaseApp.database().ref().child(STRINGS.USERS).child(profileId).child(STRINGS.POSTS);
    var displayName = firebaseApp.database().ref(STRINGS.USERS).child(profileId).child(STRINGS.NAME);
    var view = this;
    firebase.storage().ref(STRINGS.PROFILE_PICTURES).child(profileId).getDownloadURL()
      .then(function(url) {
        view.setState({imageURI: url, imageExists: true});
      })
      .catch(function(error){

      });
    displayName.once(STRINGS.VAL, (snap) => {
      view.setState({ displayName: snap.val()});
    });
  }

  //Begin listening for items once the screen is actually loaded
  componentDidMount() {
    var firebaseApp = firebase.apps[0];
    this.listenForItems(this.itemsRef, true);
  }

  //Get the current user vote
  currUserVote(childJSON) {
    if (typeof childJSON.voters !== STRINGS.UNDEFINED) {
      if (currUser in childJSON.voters) {
        return childJSON.voters[currUser];
      }
    }
    return "0";
  }

  //Update the posts list
  update(view) {
    var newArr = view.items.slice();
    view.setState({
      dataSource: view.state.dataSource.cloneWithRows(newArr),
    });
  }

  //Check Chatter.js for comments
  refToItems(itemsRef, refresh) {
    if (refresh || this.items.length === 0) {
      return itemsRef.orderByChild(STRINGS.NEWEST_TO_OLDEST).limitToFirst(3);
    } else {
      return itemsRef.orderByChild(STRINGS.NEWEST_TO_OLDEST).startAt(this.items[this.items.length - 1].sortDate).limitToFirst(4);
    }
  }

  //Check Chatter.js for comments
  listenForItems(itemsRef,refresh) {
    if (!this.state.loadAllowed) return;
    if(!this.loading && !(this.allLoaded && !refresh)) {
      this.loading = true;
      var view = this;
      var currInsertIdx = 1;
      var ref = this.refToItems(itemsRef, refresh);
      ref.once(STRINGS.VAL, (snap) => {
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

  //Signs out from firebase, and performs a back action to the chatter main page
  signOut() {
    firebase.auth().signOut();
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: STRINGS.CHATTER}),]
    });
    this.props.navigation.dispatch(resetAction);
  }

  //Goes back to chatter
  dismissScreen() {
    this.props.navigation.dispatch(NavigationActions.back());
  }

  //Loads more posts
  loadMore() {
    this.listenForItems(this.itemsRef, false);
  }

  //Opens Detailed post view on post click
  goToPost(data, author) {
    this.props.navigation.navigate(STRINGS.DETAILED_POST, {
      ...{data: data, currUser: currUser, name: author, visible: false},
    });
  }

  goToProfile(userId) {
    console.log(userId);
    if (userId !== currUser && userId !== profileId && userId !== null) {
      this.props.navigation.navigate(STRINGS.PROFILE, {...{currUser: currUser, profileId: userId, myProfile: false}});
    }
    // console.log(this.loading);
  }

  //Deletes everything related to a post in the database
  deletePost(key) {
    var firebaseApp = firebase.apps[0];
    firebaseApp.database().ref().child(STRINGS.USERS).child(currUser).child(STRINGS.POSTS).child(key).remove();
    firebaseApp.database().ref().child(STRINGS.USERS).child(currUser).child(STRINGS.PUBLIC_POSTS).child(key).remove();
    firebaseApp.database().ref().child(STRINGS.POSTS).child(key).remove();
    firebaseApp.database().ref().child(STRINGS.POSTS_BODIES).child(key).remove();
    firebaseApp.database().ref().child(STRINGS.REPLIES).child(key).remove();
    firebaseApp.database().ref().child(STRINGS.REPLIES_BODIES).child(key).remove();
  }

  //Image upload to firebase storage code snippet
  uploadImage(uri, mime = 'application/octet-stream') {
    return new Promise((resolve, reject) => {
      const uploadUri = uri.replace('file://', '');
      let uploadBlob = null;
      var firebaseApp = firebase.apps[0];
      const imageRef = firebaseApp.storage().ref(STRINGS.PROFILE_PICTURES).child(currUser);

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

  //Image upload options handler
  uploadOptions() {

  }

  async removeAtIndex(index) {
    var newArr = this.items.slice();
    newArr.splice(index, 1);
    this.state.dataSource = this.state.dataSource.cloneWithRows(newArr);
  }

  //Decides the context based on whether it's the profile of the person viewing it or not then renders a post item
  _renderItem(item,_,index) {
    var context = STRINGS.LIST;
    if (this.props.navigation.state.params.myProfile) {
      context = STRINGS.PROFILE;
    }
    return (
      <View style={styles.postContainer}>
          <PostItem
          key={item.key}
          item={item}
          firebase={firebase}
          removeAtIndex={this.removeAtIndex}
          index={index}
          currUser={this.props.navigation.state.params.currUser}
          goToPost={this.goToPost}
          goToProfile={this.goToProfile}
          context={context}
          deletePost={this.deletePost}/>
      </View>
    );
  }

  render() {
    // console.warn(this.state.dataSource.length);
    return (
      <View style={styles.container}>
        <View style={styles.statusBarBackground}/>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.closeWrapper}>
            <Ionicons name={ICONS.BACK} style={styles.back} size={34} color={COLORS.WHITE} onPress={this.dismissScreen.bind(this)}/>
            {!this.state.imageExists &&
              <Image style={styles.profileImage} source={Images.ANON_BIG}>
                {this.props.navigation.state.params.myProfile && (
                  <TouchableOpacity style={styles.editPhoto} onPress={this.uploadOptions.bind(this)}>
                    <View style={styles.editPhoto}>
                      <Image style={styles.edit} source={Images.EDIT}/>
                      <Text> Edit </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </Image>}
            {this.state.imageExists && <Image style={styles.profileImage} source={{uri: this.state.imageURI}}>
              {this.props.navigation.state.params.myProfile && (
                <TouchableOpacity style={styles.editPhoto} onPress={this.uploadOptions.bind(this)}>
                  <View style={styles.editPhoto}>
                    <Image style={styles.edit} source={Images.EDIT}/>
                    <Text> Edit </Text>
                  </View>
                </TouchableOpacity>
              )}
            </Image>}
            {this.props.navigation.state.params.myProfile && (
              <TouchableOpacity onPress={this.signOut.bind(this)}>
                <Text style={styles.signout}>Sign Out</Text>
              </TouchableOpacity>
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
