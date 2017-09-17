/**
 * Created by ggoma on 12/17/16.
 */
 import React, {Component} from 'react';
 import ReactNative from 'react-native';
 const firebase = require('firebase');
 const styles = require('../../assets/styles.js')
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
   TouchableWithoutFeedback
 } = ReactNative;

export default class PostItem extends Component {
    constructor() {
        super();
        this.state = {
          body: "",
          repliesCount: -1,
          votes: -1,
          long: "no",
          timeStamp : -1,
          anon: "yes",
          key: "",
          sortDate: -1,
          author: "",
          userVote: -2,
          hide: false,
          imageExists: false,
          imageURI: ""
        }
        this._mounted = false;
    }

    getData() {
      var firebaseApp = firebase.apps[0];
      var view = this;
      firebaseApp.database().ref().child('posts').child(this.propsCopy.item.key).once('value').then(function(snap){
          var childJSON = snap.val();
          // console.log("JSON", childJSON);
          var body = '/postsBodies/' + childJSON.body;
          var author = "Anonymous";
          if (childJSON.anon === "no") {
            author = childJSON.author;
          }
          var userVote = view.currUserVote(childJSON);
          var postObject = {
            body: body,
            repliesCount: childJSON.repliesCount,
            votes: childJSON.votes,
            long: childJSON.long,
            timeStamp : childJSON.TimeStamp,
            anon: childJSON.anon,
            key: view.propsCopy.item.key,
            sortDate: childJSON.sortDate,
            author: author,
            userVote: userVote,
          };
          view.propsCopy.item.body = body;
          view.propsCopy.item.repliesCount = childJSON.repliesCount;
          view.propsCopy.item.votes = childJSON.votes;
          view.propsCopy.item.long = childJSON.long;
          view.propsCopy.item.timeStamp = childJSON.TimeStamp;
          view.propsCopy.item.anon = childJSON.anon;
          view.propsCopy.item.key = view.propsCopy.item.key;
          view.propsCopy.item.sortDate = childJSON.sortDate;
          view.propsCopy.item.author = author;
          view.propsCopy.item.userVote = userVote;
          view.setState({
            repliesCount: childJSON.repliesCount,
            votes: childJSON.votes,
            long: childJSON.long,
            timeStamp : childJSON.TimeStamp,
            anon: childJSON.anon,
            key: view.propsCopy.item.key,
            sortDate: childJSON.sortDate,
            userVote: userVote
          });
          view.componentDidMount();
      });
    }

    componentWillMount() {
      this._mounted = true;
      this.propsCopy = this.props;
      if(this.propsCopy.item.body === undefined) this.getData();
      else {
        this.setState(this.propsCopy.item);
        var view = this;
        setInterval(function(){
          view.calculateTime(view.propsCopy.item.timeStamp);
        },60000);
        this.setState({body: "", author: ""});
      }
    }

    currUserVote(childJSON, currUser) {
      if (typeof childJSON.voters !== "undefined") {
        if (currUser in childJSON.voters) {
          return childJSON.voters[currUser];
        }
      }
      return "0";
    }

    componentDidMount() {
      this._mounted = true;
      if (this.propsCopy.item.body !== undefined) {
        console.log("I'm here");
        console.log(this.propsCopy.item);
        var view = this;
        this.calculateTime(this.state.timeStamp);
        firebase.database().ref(this.propsCopy.item.body).once('value').then(function(snapshot) {
            view.setState({body : snapshot.val().body});
        });
        if(this.state.anon === "no") {
          firebase.database().ref("/Users/"+this.propsCopy.item.author).once('value').then(function(snapshot) {
              view.setState({author : snapshot.val().name, userId: view.propsCopy.item.author});
          });
          firebase.storage().ref('profile_pictures').child("thumb_"+view.propsCopy.item.author).getDownloadURL()
            .then(function(url) {
              view.setState({imageURI: url, imageExists: true});
            })
            .catch(function(error){

            });
        } else {
          this.setState({author: "Anonymous"})
        }
        if(this.state.long === "yes" && (this.propsCopy.context === 'list' || this.propsCopy.context === 'profile')) {
          this.setState({collapsed : true});
        } else {
          this.setState({collapsed : false});
        }
        firebase.database().ref("/posts/"+this.propsCopy.item.key).on('value', function(snapshot) {
          if(snapshot.val() !== null) {
            view.setState({
              repliesCount: snapshot.val().repliesCount,
              votes: snapshot.val().votes,
              userVote: view.currUserVote(snapshot.val(), view.propsCopy.currUser),
            });
          }
        });
      } else {
        console.log(this.propsCopy.item.key);
      }
    }

    componentWillUnmount() {
      this._mounted = false;
      clearInterval();
    }

    determineColor(vote, image) {
      if (image === 'up') {
        if(vote === 1) {
          return {tintColor: '#8B1316'}
        }
      } else {
        if(vote === -1) {
          return {tintColor: '#8B1316'}
        }
      }
      return null;
    }

    viewMoreStyle() {
      var style = styles.messageText;
      style.fontWeight = 'bold';
    }

    changeVote(newVote) {
      var refToVotes = firebase.database().ref("/posts/"+this.propsCopy.item.key+"/votes");
      var refToVoters = firebase.database().ref("/posts/"+this.propsCopy.item.key+"/voters");
      var view = this;
      if(this.state.userVote === newVote) {
        this.setState({userVote : 0});
        refToVotes.transaction(function(currentVotes) {
          return (currentVotes || 0) - newVote;
        });
        this.propsCopy.firebase.database().ref("/posts/"+this.propsCopy.item.key+"/voters/"+this.propsCopy.currUser).remove();
      } else {
        refToVotes.transaction(function(currentVotes) {
          return (currentVotes || 0) + (newVote-view.state.userVote);
        });
        this.propsCopy.firebase.database().ref("/posts/"+this.propsCopy.item.key+"/voters/"+this.propsCopy.currUser).set(newVote);
        this.setState({userVote : newVote});
      }
    }

    containerStyle(context) {
      var style = styles.li;
      if(context === 'list' || context === 'profile') {
        return styles.li;
      } else {
        return styles.detailed;
      }
    }

    calculateTime(TimeStamp) {
      var time = moment(TimeStamp).fromNow();
      this.setState({timeStamp: time});
    }

    toProfile() {
      // console.log(this.state);
      if (this.state.userId) this.props.goToProfile(this.state.userId);
    }

    deletePost() {
      this.props.deletePost(this.props.item.key);
      this.props.handleDeletion(this.props.item.key);
      this.setState({hide: true});
    }

    render() {
      if(this.propsCopy.context === "list" || this.propsCopy.context === "profile") {
        this.state.preview = this.state.body;
        if (this.state.long === "yes") {
          this.state.preview = this.state.preview.substring(0, 180);
          this.state.preview += "..."
        }
      }
      if (this.state.hide) return null;

      return (
        <TouchableWithoutFeedback onPress={() => this.propsCopy.goToPost !== undefined ? this.propsCopy.goToPost(this.propsCopy.item, this.state.author) : console.log('none')}>
          <View style={this.containerStyle(this.propsCopy.context)}>
            <View style={styles.post}>
              <View style={styles.content}>
                <View style={styles.author}>
                  <TouchableWithoutFeedback onPress={this.toProfile.bind(this)}>
                    <View>
                      {!this.state.imageExists && <Image style={styles.authorImage} source={require('../../media/anon_small.png')}/>}
                      {this.state.imageExists && <Image style={styles.authorImage} source={{uri: this.state.imageURI}}/>}
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={this.toProfile.bind(this)}>
                    <View style={styles.postInfo}>
                      <Text style={styles.authorName}>{this.state.author}</Text>
                      <Text style={styles.timeStamp}>{this.state.timeStamp}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <View style={styles.message}>
                  <Text style={styles.messageText}>
                    {this.state.collapsed && this.state.preview + " "}
                    {!this.state.collapsed && this.state.body}
                    {this.state.collapsed && (
                      <View style={{width:70, height:15, marginTop:2}}>
                        <TouchableHighlight underlayColor={"#E5E5E5"} onPress={(event) => this.setState({collapsed : false})} activeOpacity={1}>
                          <Text style={this.viewMoreStyle()}>
                            View more
                          </Text>
                        </TouchableHighlight>
                      </View>
                    )}
                  </Text>
                </View>
              </View>
              <View style={styles.upDown}>
                <TouchableWithoutFeedback onPress={this.changeVote.bind(this,1)}>
                  <Image style={this.determineColor(this.state.userVote,'up')} source={require('../../media/upVote.png')}/>
                </TouchableWithoutFeedback>
                <Text style={styles.votesCount}>{this.state.votes}</Text>
                <TouchableWithoutFeedback onPress={this.changeVote.bind(this,-1)}>
                  <Image style={this.determineColor(this.state.userVote,'down')} source={require('../../media/downVote.png')}/>
                </TouchableWithoutFeedback>
              </View>
            </View>
            {this.propsCopy.context === 'list' && (
              <View style={styles.reply}>
                <View style={styles.writeAReply}>
                  <Image style={{width: 19.5, height:17.3}} source={require('../../media/Messages.png')}/>
                  <Text style={styles.replyPlaceHolder}>Write a reply…</Text>
                </View>
                <View style={styles.repliesCounter}>
                  <Text style={styles.count}>{this.state.repliesCount + " Replies"}</Text>
                </View>
              </View>
            )}
            {this.propsCopy.context === 'profile' && (
              <View style={styles.reply}>
                <View style={styles.profileReplies}>
                  <Image style={{width: 19.5, height:17.3}} source={require('../../media/Messages.png')}/>
                  <Text style={styles.profileOptionsText}>{this.state.repliesCount + " Replies"}</Text>
                </View>
                <TouchableWithoutFeedback onPress={this.deletePost.bind(this)}>
                  <View style={styles.deletePost}>
                    <Image style={{width: 17, height:22, marginTop: 3.5, marginBottom: 3, tintColor: "#A5A5A5"}} source={require('../../media/delete.png')}/>
                    <Text style={styles.profileOptionsText}>Delete Post</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )}
          </View>
          </TouchableWithoutFeedback>
      );
    }
}
