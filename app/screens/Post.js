/**
 * Post Template
 */
'use strict';

//Pre-made Components imports
import React, {Component} from 'react';
import {STRINGS, KEYS} from '../assets/constants.js';
import Icon from 'react-native-vector-icons/Ionicons';
import RNAmplitute from 'react-native-amplitude-analytics';
import {
  View,
  WebView,
  StatusBar,
  Dimensions,
  Linking,
  ActivityIndicator
} from 'react-native';

//Components for this app imports
import Header from './common/header';

const amplitude = new RNAmplitute(KEYS.AMPLITUDE_API);
const {width, height} = Dimensions.get('window'); //Dimensions of the current device screen

class Post extends Component {
  constructor(props) {
     super(props);
     this.goBack = this.goBack.bind(this);
     this.state = {
       post: {}
     }
   }

   //A function that triggers going back to headlines
   goBack() {
     this.props.navigation.goBack();
   }

   //Ince components load, load data. All data is passed down from previous screen
   componentDidMount() {
     this.fetchData();
   }

   //Adds HTML styling to the content and the featured media to look as expected
   assembleHTML(title, featuredMedia, content) {
    content = "<body id=\"top\" class=\"post-template-default single single-post single-format-standard\" data-gr-c-s-loaded=\"true\"><div id=\"main-content\" class=\"container\"><div class=\"content\"><div class=\"post-inner\">" + title + featuredMedia + "<div class=\"entry\">" + content + "</div></div></div></div></body>";
    content = '<head><script src=\"https://apis.google.com/_/scs/apps-static/_/js/k=oz.gapi.en.0v_3Mrbs2Mw.O/m=iframes_styles_bubble_mobile,plusone/rt=j/sv=1/d=1/ed=1/am=AQ/rs=AGLTcCMPIPQ446UAo7_guFQaxpH994u6LA/cb=gapi.loaded_0\" async=\"\"></script><meta charset=\"UTF-8\"><meta property=\"og:type\" content=\"article\"><meta property=\"og:site_name\" content=\"Stanford Daily\"><link rel=\"stylesheet\" id=\"tie-style-css\" href=\"https://dl.dropbox.com/s/w5h0k2rqf8m2d4i/custom-sahifa.css?dl=0\" type=\"text/css\" media=\"all\"><style type=\"text/css\" media=\"screen\"> .post-title{font-family: \'PT Serif\';font-weight: bold;}h2.post-box-title, h2.post-box-title a{font-family: \'PT Serif\';font-size : 22px;font-weight: bold;}h3.post-box-title, h3.post-box-title a{font-family: \'PT Serif\';font-size : 15px;} body.single .entry, body.page .entry{font-family: \'PT Serif\';font-size : 16px;}.ei-title h2 , .slider-caption h2 a, .content .slider-caption h2 a, .slider-caption h2, .content .slider-caption h2, .content .ei-title h2{font-family: \'PT Serif\';font-size : 22px;font-weight: bold;}.entry .share-post span.new-post-meta span {    display: inline-block;    margin-right: 10px;}.post-inner .entry, .post-title {margin-left: 10px; margin-right:10px;}.widget-container .simplePullQuote {width: 100% !important; max-width: 275px; margin:0px;}.news-pic .attachment-related-posts {height: 126px !important; width: 126px !important;}.post-listing .item-list .attachment-related-posts {height: 100px !important; width: 100px !important;}.football-roster .uber-grid-hover-text{text-shadow:-1px 0 black, 0 -1px black, 1px 0 black, 0 1px black; text-align:center; font-size:1.1em !important; line-height:1.4em !important; }.football-roster .uber-grid-hover-title{text-shadow:3px 3px 5px #000000; }.football-roster .uber-grid-cell-title small{position:absolute; bottom:5px; padding:5px; }.football-roster a {text-decoration: none !important;}@media only screen and (max-width: 985px) and (min-width: 768px){.footer-widgets-box { width:100% !important; margin-right:4% !important;}img.footer-logo {width: 183px; height: 23px;}}@media only screen and (max-width: 767px) and (min-width: 480px){.sidebyside p {text-align: left;}.evcal_evdata_img {display: none;}.ikes-grid {display:none;}img.footer-logo {width: 90%; height: inherit; padding: 10px 0px 10px 0px;} /* Make logo fit on phone */}@media only screen and (max-width: 479px) and (min-width: 320px){.sidebyside p {text-align: left;}.evcal_evdata_img {display: none;}.ikes-grid {display:none;}img.footer-logo {width: 90%; height: inherit; padding: 10px 0px 10px 0px;} /* Make logo fit on phone */}</style></head>' + content;
    return content;
  }

  //Adds HTML styling to the title and author to look as expected
  makeTitleHTML(title, author, date) {
    return '<h1 class="name post-title entry-title" itemprop="itemReviewed" itemscope="" ><span itemprop="name">'+title+'</span></h1> <p style="text-align:left; margin-top: 6px; margin-bottom: 10px; margin-left: 10px; margin-right: 10px;font-family:PT Serif; font-size: 12px; color: #666666">'+author+'<span style="float:right;">'+date+'</span></p>';
  }

  //Gets data and makes it look as expected
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
        id: postData.id,
    });
    console.log(postData.id);
    amplitude.logEvent(STRINGS.ARTICLE_FULL_LOADED, {ArticleId: postData.id})
  }

  //Required ReactNative function
  //For this screen we render
  /* <View for the page>
     <Set Status Bar props>
     <Show the header>
     <Webview to handle all html (The post)>
  */
  render() {
    return (
      <View style={{flex:1}}>
        <StatusBar
          barStyle="light-content"
        />
        <Header ref='postHeader' share={true} postID={this.state.id} goBack={this.goBack}/>
        <WebView
         scalesPageToFit={false}
         renderLoading={() => <ActivityIndicator/>}
         ref={'webview'}
         source={{html: this.state.post.content}}
         onNavigationStateChange={(event) => {
           if (event.url !== 'about:blank') { //Handles opening links by sending them to the default browser
             this.refs.webview.stopLoading();
             Linking.openURL(event.url);
           }
         }}
        />
      </View>
    );
  }
};

export default Post;
