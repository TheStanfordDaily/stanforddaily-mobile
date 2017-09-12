/**
 * Created by ggoma on 12/17/16.
 */
 import React, {Component} from 'react';
 import ReactNative from 'react-native';
 const firebase = require('firebase');
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
   Dimensions
 } = ReactNative;

export default class ReplyItem extends Component {
    constructor() {
        super();
        this._mounted = false;
        this.state = {
          body: '',
          preview: ''
        }
    }

    componentWillMount() {
      this.setState(this.props.item);
      var view = this;
      setInterval(function(){
        view.calculateTime(view.props.item.timeStamp);
      },60000);
      this.setState({body: "", author: ""});
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
      if(this.state.long === "yes") {
        this.setState({collapsed : true});
      } else {
        this.setState({collapsed : false});
      }
    }

    componentWillUnmount() {
      this._mounted = false;
      clearInterval();
    }

    viewMoreStyle() {
      var style = styles.messageText;
      style.fontWeight = 'bold';
    }

    calculateTime(TimeStamp) {
      var time = moment(TimeStamp).fromNow();
      if(this._mounted) {
        this.setState({timeStamp: time});
      }
    }

    render() {
      this.state.preview = this.state.body;
      if (this.state.long === "yes") {
        this.state.preview = this.state.preview.substring(0, 180);
        this.state.preview += "..."
      }

      return (
          <View style={styles.container}>
            <Image style={styles.authorImage} source={require('../../media/abood.jpg')}/>
            <View style={styles.post}>
              <View style={styles.postInfo}>
                <Text style={styles.authorName}>{this.state.author}</Text>
                <Text style={styles.timeStamp}>{this.state.timeStamp}</Text>
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
          </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingLeft: 18,
    paddingRight: 14,
    paddingTop: 6,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#C8C8C8',
    width: Dimensions.get('window').width,
  },
  authorImage: {
    height:35.6,
    width: 35.6,
    borderRadius: 17.8,
    marginRight: 9.4
  },
  post: {
    flexDirection: 'column',
    flex: 1
  },
  postInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  authorName: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Helvetica Neue',
    marginRight: 4
  },
  timeStamp: {
    color: '#A5A5A5',
    fontSize: 9,
    fontFamily: 'Helvetica Neue',
  },
  messageText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Helvetica Neue',
    fontWeight: '200'
  }
});
