import { Platform } from 'react-native';

const STRINGS = {
  ALL: "All",
  FEATURED_HEADLINES: "Featured Headlines",
  NEWS: "News",
  SPORTS: "Sports",
  OPINIONS: "Opinions",
  ARTS: "Arts & Life",
  GRIND: "The Grind",
  HEADLINES: "headlines",
  PLACEHOLDER: "placeholder",
  POST: "Post",
  POSTS: "posts",
  HASHED: "hashed",
  REQUEST_SMALL_PAGE: "https://www.stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=3&page=",
  REQUEST_LARGE_PAGE: "https://www.stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=10&page=",
  SEARCH_URL: "&search=",
  CATEGORIES_URL: "&categories=",
  CATEGORY_CHANGED: "Category Changed",
  PAGE: "page",
  STATIC: "static",
  LIGHT_CONTENT: "light-content",
  MORE_TEXT: "...",
  MEDIA_URL: 'https://www.stanforddaily.com/wp-json/wp/v2/media/',
  DAILY_URL: 'https://www.stanforddaily.com/',
  PROFILE: "Profile",
  CHILD_REMOVED: "child_removed",
  REPLIES: "replies",
  REPLIES_BODIES: "repliesBodies",
  REPLIES_COUNT: "repliesCount",
  NO: "no",
  YES: "yes",
  ANON: "Anonymous",
  VAL: "value",
  TIMESTAMP: "TimeStamp",
  CHATTER_POST_SUFFIX: "'s post",
  DETAILED_POST: "DetailedPost",
  PAD: "padding",
  REPLY_PLACEHOLDER: "Write a reply...",
  IMG: "image",
  APP_OPENED: "App opened",
  ARTICLES_PREVIEW_REQUEST: "Article preview request",
  ARTICLE_FULL_LOADED: "Article Clicked",
  NONE: "none",
  UNDEFINED: "undefined",
  NEWEST_TO_OLDEST: "sortDate",
  POSTS_BODIES: "postsBodies",
  AUTHORS: "Authors",
  CHATTER: "Chatter",
  SIGNED_IN: "signedIn",
  USERS: "Users",
  VERIFIED: "verified",
  LIST: "list",
  PROFILE_PICTURES: "profile_pictures",
  SWITCHED_SCREEN: "Switched Screen",
  LOAD_CHATTER_POSTS: "Request for more chatter posts",
  VOTE_CHANGED: "New vote",
  NEW_REPLY: "New Reply",
  UP: "up",
  DOWN: "down",
  BOLD: "bold",
  VOTES: "votes",
  VOTERS: "voters",
  PUBLIC_POSTS: "publicPosts",
  NAME: "name",
  SEARCH: "Search",
  REPLY: "Reply"
}

const PATHS = {
  COMMON_TO_APP: "../../",
  SCREENS_TO_APP: "../",
  CONFIG_TO_APP: "../",
  APP_TO_ASSETS: "assets/",
  APP_TO_MEDIA: "media/",
  APP_TO_CONFIG: "config/",
  APP_TO_SCREENS: "screens/",
  APP_TO_COMMON: "screens/common",
  APP_TO_STYLES: "screens/styles",
  CONSTANTS: "constants.js",
  STYLES: "styles.js",
  ROUTER: "router.js",
  HEADER: "header.js",
  NEWSFEED_ITEM: "newsfeed-item.js",
  PLACEHOLDER: "placeholder.js",
  CHATTER_POST_ITEM: "post-item.js",
  REPLY_ITEM: "reply-item.js",
  HEADLINES_STYLE: "headlines.js",
  NEWSFEED_STYLE: "newsfeeditem.js",
  CHATTER_POST: "DetailedPost.js",
  HEADLINES: "Headlines.js",
  POST: "Post.js",
  PROFILE: "Profile.js"
}

const CATEGORIES = {
  "All" : '',
  "Featured Headlines": '1485',
  "News": '3',
  "Sports": '23',
  "Opinions": '24',
  "Arts & Life": '25',
  "The Grind": '32278'
};

const REFS = {
  DRAWER: "drawer",
  VIEW: "view",
  STATUS_BAR: "statusBar",
  HEADER: "Header",
  LIST: "listview",
  CONTAINER: "container",
  TITLE: "title"
};

const COLORS = {
  WHITE: "#FFFFFF",
  SIDE_BAR_GRAY: "#F7F7F7",
  LIGHT_GRAY: "#A5A5A5",
  DARK_GRAY: "#4E4E4E",
  NEAR_WHITE: "#FCFCFC",
  PLACEHOLDER_LIGHT: "#F0F0F0",
  PLACEHOLDER_DARK: "#E5E5E5",
  CARDINAL: "#94171C",
  GHOST_WHITE: "ghostwhite"
};

const ALIGNMENTS = {
  ROW: "row",
  COLUMN: "column",
  SPACE_BETWEEN: "space-between",
  SPACE_AROUND: "space-around",
  FLEX_END: "flex-end",
  FLEX_START: "flex-start",
  CENTER: "center",
  MIDDLE: "middle"
};

const FONTS = {
  CENTURY: "Century",
  PT_SERIF:"PT Serif",
  PT_SERIF_BOLD:"PT Serif Bold",
  HNEUE: "Helvetica Neue"
  // CENTURY: "Times New Roman",
  // PT_SERIF: "Times New Roman",
  // HNEUE: "Times New Roman"
};

const FONT_SIZES = {
  DEFAULT_MEDIUM: 24,
  DEFAULT_MEDIUM_SMALL: 15,
  DEFAULT_SMALL: 13,
  DEFAULT_SMALL_MEDIUM: 18,
  DEFAULT_LARGE: 24,
};

const MARGINS = {
  DEFAULT_MARGIN: 8,
  ARTICLE_SIDES: 14,
  NORMAL_HEADER_MARGINS: 13,
  IPHONEX_HEADER_ADDITION: 24
};

const HEIGHTS = {
  APP_HEADER: 64,
  APP_HEADER_TOP: 15,
  SIDE_MENU_ITEM: 45,
  TITLE_LINE_HEIGHT: 35,
  DESC_LINE_HEIGHT: 23.4,
  TAB_BAR_HEIGHT: 49,
  IPHONE_X: 812,
  SIGN_IN_CARD: 303,
  SIGN_UP_CARD: 365
};

const CONSTANT_NUMS = {
  SOFT_DESC_LIMIT: 130,
  HARD_DESC_LIMIT: 150,
  SOFT_SEARCH_DESC_LIMIT: 40,
  HARD_SEARCH_DESC_LIMIT: 55,
  REPLIES_LIMIT: 10,
  CHATTER_LIMIT: 180,
  PHONE_MAX_WIDTH: 600
};

const KEYS = {
  AMPLITUDE_API: 'cb7b28e023cfaaba93a588ee34ee9326',
};

const ICONS = Platform.select({
  android: {
    AUTHORS_PAGE: "md-contacts",
    MAP_PAGE: "md-map",
    BACK: "md-arrow-back",
    MENU: "md-menu",
    SEARCH: "md-search",
    SHARE: "md-share",
    CLOSE: "md-close"
  },
  ios: {
    AUTHORS_PAGE: "ios-contacts",
    MAP_PAGE: "ios-map",
    BACK: "ios-arrow-back",
    MENU: "ios-menu",
    SEARCH: "ios-search",
    SHARE: "ios-share",
    CLOSE: "ios-close"
  },
});

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAXEUBb4ygFkI-Gjhtu2pZ8JdkDYSuit9o",
  authDomain: "stanforddailyapp.firebaseapp.com",
  databaseURL: "https://stanforddailyapp.firebaseio.com",
  projectId: "stanforddailyapp",
  storageBucket: "stanforddailyapp.appspot.com",
};

const DEFAULT_IMAGE = 'https://pbs.twimg.com/profile_images/828118030605381636/G3wb0UIB_400x400.jpg';

const PN_RECEIVER_GROUPS = {
  BREAKING: "breaking",
  DAILY: "daily",
  WEEKLY: "weekly"
}

import Images from './modules.js';
module.exports = {STRINGS, CATEGORIES, REFS, COLORS, ALIGNMENTS, FONTS, FONT_SIZES, MARGINS, HEIGHTS, CONSTANT_NUMS, PATHS, Images, KEYS, ICONS, Images, FIREBASE_CONFIG, DEFAULT_IMAGE, PN_RECEIVER_GROUPS};
// module.exports = CATEGORIES;
