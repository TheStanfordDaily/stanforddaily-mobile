const STRINGS = {
  ALL: "All",
  FEATURED_HEADLINES: "Featured Headlines",
  NEWS: "News",
  SPORTS: "Sports",
  OPINIONS: "Opinions",
  ARTS: "Arts & Life",
  GRIND: "The Grind",
  PLACEHOLDER: "placeholder",
  POST: "Post",
  POSTS: "posts",
  HASHED: "hashed",
  REQUEST_PAGE: "http://stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=3&page=",
  CATEGORIES_URL: "&categories=",
  PAGE: "page",
  STATIC: "static",
  LIGHT_CONTENT: "light-content",
  MORE_TEXT: "...",
  MEDIA_URL: 'http://stanforddaily.com/wp-json/wp/v2/media/',
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
  IMG: "image"
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
  CHATTER: "chatter.js",
  CHATTER_POST: "DetailedPost.js",
  HEADLINES: "Headlines.js",
  NEW_POST: "NewPost.js",
  POST: "Post.js",
  PROFILE: "Profile.js",
  SIGN_IN: "SignIn.js"
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
  LIST: "listview"
};

const COLORS = {
  SIDE_BAR_GRAY: "#F7F7F7",
  LIGHT_GRAY: "#A5A5A5",
  DARK_GRAY: "#4E4E4E",
  NEAR_WHITE: "#FCFCFC",
  PLACEHOLDER_LIGHT: "#F0F0F0",
  PLACEHOLDER_DARK: "#E5E5E5",
};

const ALIGNMENTS = {
  ROW: "row",
  SPACE_BETWEEN: "space-between",
  CENTER: "center"
};

const FONTS = {
  CENTURY: "Century",
  PT_SERIF:"PT Serif"
};

const FONT_SIZES = {
  DEFAULT_MEDIUM: 24,
  DEFAULT_MEDIUM_SMALL: 19,
  DEFAULT_SMALL: 13,
  DEFAULT_LARGE: 32,
};

const MARGINS = {
  DEFAULT_MARGIN: 8,
  ARTICLE_SIDES: 14
};

const HEIGHTS = {
  APP_HEADER: 64,
  SIDE_MENU_ITEM: 45,
  TITLE_LINE_HEIGHT: 35,
  DESC_LINE_HEIGHT: 23.4
};

const CONSTANT_NUMS = {
  SOFT_DESC_LIMIT: 130,
  HARD_DESC_LIMIT: 150,
  REPLIES_LIMIT: 10,
  CHATTER_LIMIT: 180
};

import Images from './modules.js';
module.exports = {STRINGS, CATEGORIES, REFS, COLORS, ALIGNMENTS, FONTS, FONT_SIZES, MARGINS, HEIGHTS, CONSTANT_NUMS, PATHS, Images};
// module.exports = CATEGORIES;
