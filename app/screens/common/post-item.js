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
        this._mounted = false;
    }

    componentWillMount() {
      this.setState(this.props.item);
      var view = this;
      setInterval(function(){
        view.calculateTime(view.props.item.timeStamp);
      },60000);
      this.setState({body: "", author: ""});
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
      console.log("mounted");
      this._mounted = true;
      var view = this;
      this.calculateTime(this.state.timeStamp);
      this.props.firebase.database().ref(this.props.item.body).once('value').then(function(snapshot) {
          view.setState({body : snapshot.val().body});
      });
      if(this.state.anon === "no") {
        this.props.firebase.database().ref(this.props.item.author).once('value').then(function(snapshot) {
            view.setState({author : snapshot.val().name});
        });
      } else {
        this.setState({author: "Anonymous"})
      }
      if(this.state.long === "yes" && this.props.context === 'list') {
        this.setState({collapsed : true});
      } else {
        this.setState({collapsed : false});
      }
      this.props.firebase.database().ref("/posts/"+this.props.item.key).on('value', function(snapshot) {
          view.setState({
            repliesCount: snapshot.val().repliesCount,
            votes: snapshot.val().votes,
            userVote: view.currUserVote(snapshot.val(), view.props.currUser),
          });
      });
    }

    componentWillUnmount() {
      this._mounted = false;
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
      var refToVotes = this.props.firebase.database().ref("/posts/"+this.props.item.key+"/votes");
      var refToVoters = this.props.firebase.database().ref("/posts/"+this.props.item.key+"/voters");
      var view = this;
      if(this.state.userVote === newVote) {
        this.setState({userVote : 0});
        refToVotes.transaction(function(currentVotes) {
          return (currentVotes || 0) - newVote;
        });
        this.props.firebase.database().ref("/posts/"+this.props.item.key+"/voters/"+this.props.currUser).remove();
      } else {
        refToVotes.transaction(function(currentVotes) {
          return (currentVotes || 0) + (newVote-view.state.userVote);
        });
        this.props.firebase.database().ref("/posts/"+this.props.item.key+"/voters/"+this.props.currUser).set(newVote);
        this.setState({userVote : newVote});
      }
    }

    containerStyle(context) {
      var style = styles.li;
      console.log(context);
      if(context === 'list') {
        return styles.li;
      } else {
        return styles.detailed;
      }
    }

    calculateTime(TimeStamp) {
      var time = moment(TimeStamp).fromNow();
      this.setState({timeStamp: time});
    }

    render() {
      if(this.props.context === "list") {
        this.state.preview = this.state.body;
        if (this.state.long === "yes") {
          this.state.preview = this.state.preview.substring(0, 180);
          this.state.preview += "..."
        }
      }

      return (
        <TouchableWithoutFeedback onPress={() => this.props.goToPost !== undefined ? this.props.goToPost(this.props.item, this.state.author) : console.log('none')}>
          <View style={this.containerStyle(this.props.context)}>
            <View style={styles.post}>
              <View style={styles.content}>
                <View style={styles.author}>
                  <Image style={styles.authorImage} source={require('../../media/abood.jpg')}/>
                  <View style={styles.postInfo}>
                    <Text style={styles.authorName}>{this.state.author}</Text>
                    <Text style={styles.timeStamp}>{this.state.timeStamp}</Text>
                  </View>
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
            {this.props.context === 'list' && (
            <View style={styles.reply}>
              <View style={styles.writeAReply}>
                <Image style={{width: 19.5, height:17.3}} source={require('../../media/Messages.png')}/>
                <Text style={styles.replyPlaceHolder}>Write a reply…</Text>
              </View>
              <View style={styles.repliesCounter}>
                <Text style={styles.count}>{this.state.repliesCount + " Replies"}</Text>
              </View>
            </View>)}
          </View>
          </TouchableWithoutFeedback>
      );
    }
}
