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
  Dimensions
} from 'react-native';

const {width, height} = Dimensions.get('window');
import Header from './common/header';
// var REQUEST_URL = 'http://stanforddaily.com/wp-json/wp/v2/posts/1129378';
var MEDIA_URL = 'http://stanforddaily.com/wp-json/wp/v2/media/';


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
    //  console.log(this.props.navigation.state.params);
    //  this.setState({postObj : this.props.navigation.state.params.postObj});
     this.fetchData();
   }


assembleHTML(title, featuredMedia, content) {
    content = "<body id=\"top\" class=\"post-template-default single single-post single-format-standard\" data-gr-c-s-loaded=\"true\"><div id=\"main-content\" class=\"container\"><div class=\"content\"><div class=\"post-inner\">" + title + featuredMedia + "<div class=\"entry\">" + content + "</div></div></div></div></body>";
    content = '<head><script src=\"https://apis.google.com/_/scs/apps-static/_/js/k=oz.gapi.en.0v_3Mrbs2Mw.O/m=iframes_styles_bubble_mobile,plusone/rt=j/sv=1/d=1/ed=1/am=AQ/rs=AGLTcCMPIPQ446UAo7_guFQaxpH994u6LA/cb=gapi.loaded_0\" async=\"\"></script><meta charset=\"UTF-8\"><link rel=\"profile\" href=\"http://gmpg.org/xfn/11\"><link rel=\"pingback\" href=\"http://www.stanforddaily.com/xmlrpc.php\"><meta property=\"og:type\" content=\"article\"><meta property=\"og:site_name\" content=\"Stanford Daily\"><link rel=\"dns-prefetch\" href=\"//app.newsatme.com\"><link rel=\"dns-prefetch\" href=\"//platform.twitter.com\"><link rel=\"dns-prefetch\" href=\"//fonts.googleapis.com\"><link rel=\"dns-prefetch\" href=\"//s.w.org\"><link rel=\"alternate\" type=\"application/rss+xml\" title=\"Stanford Daily » Feed\" href=\"http://www.stanforddaily.com/feed/\"><link rel=\"alternate\" type=\"application/rss+xml\" title=\"Stanford Daily » Comments Feed\" href=\"http://www.stanforddaily.com/comments/feed/\"><style type=\"text/css\">img.wp-smiley,img.emoji {display: inline !important;border: none !important;box-shadow: none !important;height: 1em !important;width: 1em !important;margin: 0 .07em !important;vertical-align: -0.1em !important;background: none !important;padding: 0 !important;}</style><link rel=\"stylesheet\" id=\"tie-style-css\" href=\"https://dl.dropbox.com/s/w5h0k2rqf8m2d4i/custom-sahifa.css?dl=0\" type=\"text/css\" media=\"all\"><link rel=\"stylesheet\" id=\"PT+Serif-css\" href=\"http://fonts.googleapis.com/css?family=PT+Serif%3Aregular%2Citalic%2C700%2C700italic&amp;ver=4.7.5\" type=\"text/css\" media=\"all\"><link rel=\"stylesheet\" id=\"Droid+Sans-css\" href=\"http://fonts.googleapis.com/css?family=Droid+Sans%3Aregular%2C700&amp;ver=4.7.5\" type=\"text/css\" media=\"all\"><link rel=\"stylesheet\" id=\"evcal_google_fonts-css\" href=\"//fonts.googleapis.com/css?family=Oswald%3A400%2C300%7COpen+Sans%3A400%2C300&amp;ver=4.7.5\" type=\"text/css\" media=\"screen\"><link rel=\"stylesheet\" type=\"text/css\" media=\"all\" href=\"http://stanforddaily.wpengine.netdna-cdn.com/wp-content/plugins/bwp-minify/min/?f=wp-includes/css/dashicons.min.css,wp-content/plugins/uber-grid/assets/css/uber-grid.css,wp-content/plugins/baslider/css/style.css,wp-content/plugins/contact-form-7/includes/css/styles.css,wp-content/plugins/ditty-news-ticker/assets/fontastic/styles.css,wp-content/plugins/ditty-news-ticker/assets/css/style.css,wp-content/plugins/numbers-box/style.css,wp-content/plugins/sports-scoreboard/style.css,wp-content/plugins/vr-views/public/css/vr-views-public.css,wp-content/plugins/wordpress-social-stream/css/dcwss.css,wp-content/plugins/wp-polls/polls-css.css,wp-content/plugins/ubermenu/standard/styles/basic.css,wp-content/plugins/ubermenu/custom/custom.css,wp-content/plugins/eventON/assets/css/eventon_styles.css,wp-content/plugins/eventON/assets/fonts/font-awesome.css,wp-content/plugins/popular-widget/_css/pop-widget.css,wp-content/plugins/simple-lightbox/client/css/app.css,wp-content/plugins/ditty-twitter-ticker/assets/css/style.css,wp-content/plugins/tablepress/css/default.min.css,wp-content/plugins/eventon-full-cal/assets/fc_styles.css&amp;ver=2.5\"><link rel=\"stylesheet\" type=\"text/css\" media=\"all\" href=\"http://stanforddaily.wpengine.netdna-cdn.com/wp-content/plugins/bwp-minify/min/?f=wp-content/plugins/wp-html-sitemap/css/sitemap.css&amp;ver=2.5\"><link rel=\"https://api.w.org/\" href=\"http://www.stanforddaily.com/wp-json/\"><link rel=\"wlwmanifest\" type=\"application/wlwmanifest+xml\" href=\"http://www.stanforddaily.com/wp-includes/wlwmanifest.xml\"> <script type=\"text/javascript\">var $mbas1 = jQuery.noConflict();$mbas1(document).ready(function() {$mbas1(\".beforeAfterSlidebar\").mousemove(function(e) {var offset =  $mbas1(this).offset();var iTopLeft = (e.pageX - offset.left);var iTopImgLeft = -(iTopLeft+2);if(!$mbas1(this).hasClass(\'traditional_slider\')){$mbas1(this).find(\".topImage\").css(\'left\',iTopLeft);$mbas1(this).find(\".topImg\").css(\'left\',iTopImgLeft);}elsecheck_for_traditional();});function check_for_traditional(){$mbas1(\".beforeAfterSlidebar\").each(function(index,value){if($mbas1(this).hasClass(\'traditional_slider\'))$mbas1(this).find(\".topImg\").css(\'left\',\'0px\');});  }})</script> <link type=\"text/css\" rel=\"stylesheet\" href=\"http://stanforddaily.wpengine.netdna-cdn.com/wp-content/plugins/simple-pull-quote/css/simple-pull-quote.css\"><script type=\"text/javascript\">var tievar = {\'go_to\' : \'Go to...\'};var tie = {\"ajaxurl\":\"https://www.stanforddaily.com/wp-admin/admin-ajax.php\" , \"your_rating\":\"Your Rating:\"};</script><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no\"><style type=\"text/css\" media=\"screen\"> ::-webkit-scrollbar {width: 8px; height:8px; }.post-title{font-family: \'PT Serif\';font-weight: bold;}h2.post-box-title, h2.post-box-title a{font-family: \'PT Serif\';font-size : 22px;font-weight: bold;}h3.post-box-title, h3.post-box-title a{font-family: \'PT Serif\';font-size : 15px;}p.post-meta, p.post-meta a{font-family: \'PT Serif\';font-size : 15px;}body.single .entry, body.page .entry{font-family: \'PT Serif\';font-size : 16px;}.ei-title h2 , .slider-caption h2 a, .content .slider-caption h2 a, .slider-caption h2, .content .slider-caption h2, .content .ei-title h2{font-family: \'PT Serif\';font-size : 22px;font-weight: bold;}#main-nav,.cat-box-content,#sidebar widget-container,.post-listing {border-bottom-color: #aa0000;}.search-block .search-button,#topcontrol,#main-nav ul li.current-menu-item a,#main-nav ul li.current-menu-item a:hover,#main-nav ul li.current-menu-parent a,#main-nav ul li.current-menu-parent a:hover,#main-nav ul li.current-page-ancestor a,#main-nav ul li.current-page-ancestor a:hover,.pagination span.current,.share-post span.share-text,.flex-control-paging li a.flex-active,.ei-slider-thumbs li.ei-slider-element,.review-percentage .review-item span span,.review-final-score ,.woocommerce span.onsale, .woocommerce-page span.onsale ,.woocommerce .widget_price_filter .ui-slider .ui-slider-handle, .woocommerce-page .widget_price_filter .ui-slider .ui-slider-handle  {background-color:#aa0000 !important;}::-webkit-scrollbar-thumb{background-color:#aa0000 !important;}footer#theme-footer, .top-nav, .top-nav ul li.current-menu-item:after,#main-nav ul li.mega-menu .mega-menu-block, #main-nav ul ul {border-top-color: #aa0000;}.search-block:after {border-right-color:#aa0000;}#main-nav ul > li.parent-list:hover > a:after{border-color:transparent transparent #aa0000;}::-moz-selection { background: #aa0000;}::selection { background: #aa0000; }.breaking-news span {background: #aa0000;}@media only screen and (min-width: 768px) {.phone-authors {display: none;}}@media only screen and (max-width: 767px) {.new-post-authors {display: none;}}p.post-author-name {font-family:PT Serif;font-size: 16px;font-weight: bold;}p.post-author-name a:hover {border-bottom: 1px #000 dotted;}p.post-author-position {font-family:PT Serif;font-size: 14px;}table.post-author-data {border: 1px solid #f2f2f2;}.new-post-authors {border-bottom:1px solid #f2f2f2;padding-bottom:5px;margin-bottom: 10px;}td.post-author-image img {vertical-align: middle;}.entry .share-post span.new-post-meta {color:#555;margin:7px 0;font-size:15px;display: initial;}.entry .share-post span.new-post-meta a {color: #555;}.entry .share-post span.new-post-meta a:hover {border-bottom: 1px #000 dotted;color:#000;text-decoration:none;}.entry .share-post span.new-post-meta span {    display: inline-block;    margin-right: 10px;}.share-post span.new-post-meta {display: none;}/* New author box phones on blog template */.item-list .phone-authors p.post-meta {font-size: 15px;border-bottom:1px solid #f2f2f2;padding-bottom:5px;}.sidebyside-share {text-align: center;}.sidebyside-share .share-post li {top: 0px;}.sidebyside p {text-align: justify;}.sidebyside .page-head h2 {text-align: center;}.eventon_sort_line { display: none;}.eventon_filter_line {border-left: none !important;}.evcal_evdata_img {background-size: contain !important;background-repeat: no-repeat !important;}.evorow.lastrow {padding-right: 0px !important;}.event_description .evcal_close {display: none;}#related_posts .related-item{vertical-align: top;}.footer-menu ul, .footer-menu li, .footer-menu {border-bottom: none !important; border-top: none !important;}.footer-menu li {display: inline; font-weight: bold; font-size: 15px; padding-left: 12px;}.footer-menu {text-align: center;}.post-inner .entry a {text-decoration: none; pointer-events: none;}.post-inner .entry, .post-title {margin-left: 10px; margin-right:10px;}.widget-container .simplePullQuote {width: 100% !important; max-width: 275px; margin:0px;}.menu-columnist img.attachment-thumbnail {height: 75px; width: 75px; float: left; padding-right: 10px; padding-top: 10px;}.menu-columnist h2.entry-title {font-family: PT Serif; font-size: 19.5px !important; font-weight: bold; line-height: 20px; padding: 5px 0;}.menu-columnist .entry-summary p {color: #333333; font-family: PT Serif; font-size: 15px; line-height: 17px;}.menu-columnist p.byline {color: #555555; display: block; font-family: PT Serif; font-size: 13px; padding: 5px 0 12px;}.hot-topic img.attachment-thumbnail {height: 75px; width: 75px; float: left; padding-right: 10px; padding-top: 10px;}.hot-topic h2.entry-title {font-family: PT Serif; font-size: 19.5px !important; font-weight: bold; line-height: 20px; padding: 5px 0;}.hot-topic p.byline {color: #555555; display: block; font-family: PT Serif; font-size: 13px; padding: 5px 0 12px;}.hot-topic {min-height:100px;}.wpmega-nonlink div.wpcf7 p {font-size: 13px;font-family:PT Serif;}.news-pic .attachment-related-posts {height: 126px !important; width: 126px !important;}.post-listing .item-list .attachment-related-posts {height: 100px !important; width: 100px !important;}.ikes-grid .uber-grid-hover{background-color: rgba(170, 0, 0, 0.6) !important;}.ikes-grid .uber-grid-hover-text{text-shadow:-1px 0 black, 0 -1px black, 1px 0 black, 0 1px black; text-align:center; font-size:0.85em !important;}.ikes-grid .uber-grid-hover-title{text-shadow:-1px 0 black, 0 -1px black, 1px 0 black, 0 1px black; text-align:center;}.post-listing article.item-list .entry a {text-decoration: underline;}.football-roster .uber-grid-hover-text{text-shadow:-1px 0 black, 0 -1px black, 1px 0 black, 0 1px black; text-align:center; font-size:1.1em !important; line-height:1.4em !important; }.football-roster .uber-grid-hover-title{text-shadow:3px 3px 5px #000000; }.football-roster .uber-grid-cell-title small{position:absolute; bottom:5px; padding:5px; }.football-roster a {text-decoration: none !important;}@media only screen and (max-width: 985px) and (min-width: 768px){.footer-widgets-box { width:100% !important; margin-right:4% !important;}img.footer-logo {width: 183px; height: 23px;}}@media only screen and (max-width: 767px) and (min-width: 480px){.sidebyside p {text-align: left;}.evcal_evdata_img {display: none;}.ikes-grid {display:none;}img.footer-logo {width: 90%; height: inherit; padding: 10px 0px 10px 0px;} /* Make logo fit on phone */}@media only screen and (max-width: 479px) and (min-width: 320px){.sidebyside p {text-align: left;}.evcal_evdata_img {display: none;}.ikes-grid {display:none;}img.footer-logo {width: 90%; height: inherit; padding: 10px 0px 10px 0px;} /* Make logo fit on phone */}</style> <link rel=\"apple-touch-icon-precomposed\" sizes=\"144x144\" href=\"https://www.stanforddaily.com/wp-content/uploads/2014/03/favicon144x1441.png\"><link rel=\"apple-touch-icon-precomposed\" sizes=\"120x120\" href=\"https://www.stanforddaily.com/wp-content/uploads/2014/03/favicon120x1201.png\"><link rel=\"apple-touch-icon-precomposed\" sizes=\"72x72\" href=\"https://www.stanforddaily.com/wp-content/uploads/2014/03/favicon72x721.png\"><link rel=\"apple-touch-icon-precomposed\" href=\"https://www.stanforddaily.com/wp-content/uploads/2014/03/favicon57x571.png\"><script src=\"https://securepubads.g.doubleclick.net/gpt/pubads_impl_124.js\" async=\"\"></script><link rel=\"stylesheet\" type=\"text/css\" href=\"//a.mailmunch.co/app/v1/styles.css\"></head>' + content;
    return content;
}

makeTitleHTML(oldTitle, author, date) {
  return '<h1 class="name post-title entry-title" itemprop="itemReviewed" itemscope="" itemtype="http://schema.org/Thing"><span itemprop="name">'+oldTitle+'</span></h1> <p style="text-align:left; margin-top: 6px; margin-bottom: 10px; margin-left: 10px; margin-right: 10px;font-family:PT Serif; font-size: 12px; color: #666666">'+author+'<span style="float:right;">'+date+'</span></p>';
}
async fetchData() {
  console.log(this.props.navigation.state.params);
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
  this.refs.postHeader.hide();
  }

  onSwipeDown(gestureState) {
    this.refs.postHeader.show();
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
    // console.log(this)
    const config = {
      velocityThreshold: 0,
      directionalOffsetThreshold: 30
    };
    return (
      <View style={{flex:1}}>
      <StatusBar
    //  backgroundColor="#94171C"
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
          <WebView scalesPageToFit={false} startInLoadState={false} scrollEnabled={true} ref={'webview'} source={{html: this.state.post.content}}/>
          </GestureRecognizer>
      </View>
    );
  }
};

export default Post;
