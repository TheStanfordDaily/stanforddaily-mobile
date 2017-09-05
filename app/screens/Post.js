/**
 * Post Template
 */
'use strict';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  WebView,
  LayoutAnimation,
  StatusBar,
  Image,
  Dimensions,
  Linking,
  ActivityIndicator
} from 'react-native';

const {width, height} = Dimensions.get('window');
import Header from './common/header';

class Post extends Component {
  constructor(props) {
     super(props);
     this.headerHeight = 64;
     this.headerTop = 0;
     this.state = {
       post: {},
       postObj: null
     };
     this.goBack = this.goBack.bind(this);
   }

   goBack() {
     this.props.navigation.goBack();
   }

   componentDidMount() {
     this.fetchData();
   }


assembleHTML(title, featuredMedia, content) {
    content = "<body id=\"top\" class=\"post-template-default single single-post single-format-standard\" data-gr-c-s-loaded=\"true\"><div id=\"main-content\" class=\"container\"><div class=\"content\"><div class=\"post-inner\">" + title + featuredMedia + "<div class=\"entry\">" + content + "</div></div></div></div></body>";
    content = '<head><script src=\"https://apis.google.com/_/scs/apps-static/_/js/k=oz.gapi.en.0v_3Mrbs2Mw.O/m=iframes_styles_bubble_mobile,plusone/rt=j/sv=1/d=1/ed=1/am=AQ/rs=AGLTcCMPIPQ446UAo7_guFQaxpH994u6LA/cb=gapi.loaded_0\" async=\"\"></script><meta charset=\"UTF-8\"><meta property=\"og:type\" content=\"article\"><meta property=\"og:site_name\" content=\"Stanford Daily\"><link rel=\"dns-prefetch\" href=\"//app.newsatme.com\"><link rel=\"dns-prefetch\" href=\"//platform.twitter.com\"><link rel=\"dns-prefetch\" href=\"//fonts.googleapis.com\"><link rel=\"dns-prefetch\" href=\"//s.w.org\"><style type=\"text/css\">img.wp-smiley,img.emoji {display: inline !important;border: none !important;box-shadow: none !important;height: 1em !important;width: 1em !important;margin: 0 .07em !important;vertical-align: -0.1em !important;background: none !important;padding: 0 !important;}</style><link rel=\"stylesheet\" id=\"tie-style-css\" href=\"https://dl.dropbox.com/s/w5h0k2rqf8m2d4i/custom-sahifa.css?dl=0\" type=\"text/css\" media=\"all\"><style type=\"text/css\" media=\"screen\"> .post-title{font-family: \'PT Serif\';font-weight: bold;}h2.post-box-title, h2.post-box-title a{font-family: \'PT Serif\';font-size : 22px;font-weight: bold;}h3.post-box-title, h3.post-box-title a{font-family: \'PT Serif\';font-size : 15px;} body.single .entry, body.page .entry{font-family: \'PT Serif\';font-size : 16px;}.ei-title h2 , .slider-caption h2 a, .content .slider-caption h2 a, .slider-caption h2, .content .slider-caption h2, .content .ei-title h2{font-family: \'PT Serif\';font-size : 22px;font-weight: bold;}.entry .share-post span.new-post-meta span {    display: inline-block;    margin-right: 10px;}.post-inner .entry, .post-title {margin-left: 10px; margin-right:10px;}.widget-container .simplePullQuote {width: 100% !important; max-width: 275px; margin:0px;}.news-pic .attachment-related-posts {height: 126px !important; width: 126px !important;}.post-listing .item-list .attachment-related-posts {height: 100px !important; width: 100px !important;}.football-roster .uber-grid-hover-text{text-shadow:-1px 0 black, 0 -1px black, 1px 0 black, 0 1px black; text-align:center; font-size:1.1em !important; line-height:1.4em !important; }.football-roster .uber-grid-hover-title{text-shadow:3px 3px 5px #000000; }.football-roster .uber-grid-cell-title small{position:absolute; bottom:5px; padding:5px; }.football-roster a {text-decoration: none !important;}@media only screen and (max-width: 985px) and (min-width: 768px){.footer-widgets-box { width:100% !important; margin-right:4% !important;}img.footer-logo {width: 183px; height: 23px;}}@media only screen and (max-width: 767px) and (min-width: 480px){.sidebyside p {text-align: left;}.evcal_evdata_img {display: none;}.ikes-grid {display:none;}img.footer-logo {width: 90%; height: inherit; padding: 10px 0px 10px 0px;} /* Make logo fit on phone */}@media only screen and (max-width: 479px) and (min-width: 320px){.sidebyside p {text-align: left;}.evcal_evdata_img {display: none;}.ikes-grid {display:none;}img.footer-logo {width: 90%; height: inherit; padding: 10px 0px 10px 0px;} /* Make logo fit on phone */}</style></head>' + content;
    return content;
}

makeTitleHTML(title, author, date) {
  return '<h1 class="name post-title entry-title" itemprop="itemReviewed" itemscope="" ><span itemprop="name">'+title+'</span></h1> <p style="text-align:left; margin-top: 6px; margin-bottom: 10px; margin-left: 10px; margin-right: 10px;font-family:PT Serif; font-size: 12px; color: #666666">'+author+'<span style="float:right;">'+date+'</span></p>';
}
async fetchData() {
    var postData = this.props.navigation.state.params;
    var author = postData.author;
    var date = postData.date;
    var title = this.makeTitleHTML(postData.title, author, date);
    var featuredMedia = postData.featuredMedia;
    if(featuredMedia !== "") {
        featuredMedia = '<img style="width: '+ width +'px"src="'+featuredMedia+'"/>';
    }
        this.setState({
            post: {content:this.assembleHTML(title, featuredMedia, postData.body) },
        });
}

onSwipeUp(gestureState) {
  }

  onSwipeDown(gestureState) {
  }

  onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    // this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
        this.setState({backgroundColor: 'white'});
        break;
      case SWIPE_DOWN:
        this.setState({backgroundColor: 'white'});
        break;
    }
  }

  render() {
    const config = {
      velocityThreshold: 0,
      directionalOffsetThreshold: 30
    };
    return (
      <View style={{flex:1}}>
          <StatusBar
            barStyle="light-content"
          />
          <Header ref='postHeader' goBack={this.goBack}/>
          <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        onSwipeUp={(state) => this.onSwipeUp(state)}
        onSwipeDown={(state) => this.onSwipeDown(state)}
        onSwipeLeft={(state) => {}}
        onSwipeRight={(state) => {}}
        config={config}
        style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor
        }}
        >
          <WebView
          //  scalesPageToFit={false}
          //  startInLoadState={false}
           renderLoading={() => <ActivityIndicator/>}
           ref={'webview'}
           source={{html: this.state.post.content}}
           onNavigationStateChange={(event) => {
             if (event.url !== 'about:blank') {
               this.refs.webview.stopLoading();
               Linking.openURL(event.url);
             }
           }}
          />
          </GestureRecognizer>
      </View>
    );
  }
};

export default Post;
