import { Platform, PlatformColor } from "react-native";

export const Alignments = {
  row: "row",
  column: "column",
  spaceBetween: "space-between",
  spaceAround: "space-around",
  flexEnd: "flex-end",
  flexStart: "flex-start",
  center: "center",
  middle: "middle",
};

export const Fonts = {
  century: "Century",
  PTSerif: "PT Serif",
  PTSerifBold: "PT Serif Bold",
  PTSerifItalic: "PT Serif Italic",
  helveticaNeue: "Helvetica Neue",
  openSans: "Open Sans",
  openSansBold: "Open Sans Bold",
  minion: {
    // Minion Pro
    MinionProRegular: require("../assets/fonts/Minion_Pro/MinionPro-Regular.ttf"),
    MinionProBold: require("../assets/fonts/Minion_Pro/MinionPro-Bold.ttf"),
    MinionProBoldIt: require("../assets/fonts/Minion_Pro/MinionPro-BoldIt.ttf"),
    MinionProIt: require("../assets/fonts/Minion_Pro/MinionPro-It.ttf"),
    MinionProMedium: require("../assets/fonts/Minion_Pro/MinionPro-Medium.ttf"),
    MinionProMediumIt: require("../assets/fonts/Minion_Pro/MinionPro-MediumIt.ttf"),
    MinionProSemibold: require("../assets/fonts/Minion_Pro/MinionPro-Semibold.ttf"),
    MinionProSemiboldIt: require("../assets/fonts/Minion_Pro/MinionPro-SemiboldIt.ttf"),
    // Minion Pro Display
    MinionProDisp: require("../assets/fonts/Minion_Pro_Display/MinionPro-Disp.ttf"),
    MinionProItDisp: require("../assets/fonts/Minion_Pro_Display/MinionPro-ItDisp.ttf"),
    MinionProBoldDisp: require("../assets/fonts/Minion_Pro_Display/MinionPro-BoldDisp.ttf"),
    MinionProBoldItDisp: require("../assets/fonts/Minion_Pro_Display/MinionPro-BoldItDisp.ttf"),
    MinionProMediumDisp: require("../assets/fonts/Minion_Pro_Display/MinionPro-MediumDisp.ttf"),
    MinionProMediumItDisp: require("../assets/fonts/Minion_Pro_Display/MinionPro-MediumItDisp.ttf"),
    MinionProSemiboldDisp: require("../assets/fonts/Minion_Pro_Display/MinionPro-SemiboldDisp.ttf"),
    MinionProSemiboldItDisp: require("../assets/fonts/Minion_Pro_Display/MinionPro-SemiboldItDisp.ttf"),
  },
  libre: {
    LibreFranklinRegular: require("../assets/fonts/Libre_Franklin/LibreFranklin-Regular.ttf"),
    LibreFranklinBold: require("../assets/fonts/Libre_Franklin/LibreFranklin-Bold.ttf"),
    LibreFranklinItalic: require("../assets/fonts/Libre_Franklin/LibreFranklin-Italic.ttf"),
  },
};

export const FontSizes = {
  small: 12,
  mediumSmall: 14,
  medium: 16,
  smallMedium: 18,
  large: 20,
  extraLarge: 24,
};

export const Heights = {
  appHeader: 48,
  appHeaderTop: 15,
  sideMenuHeaderTop: 24,
  sideMenuItem: 45,
  titleLineHeight: 35,
  descriptionLine: 23.4,
  tabBar: 49,
  iPhoneX: 812,
  signInCard: 303,
  signUpCard: 365,
};

export const Margins = {
  defaultSmall: 4,
  default: 8,
  articleSides: 16,
  defaultSmallMedium: 18,
  defaultLarge: 22,
  normalHeaders: 13,
  iPhoneXHeaderAddition: 24,
};

export const PlatformPalette = Platform.select({
  ios: {
    label: PlatformColor("label"),
    background: PlatformColor("systemBackground"),
  },
  android: {
    label: PlatformColor("?android:attr/textColor"),
    background: PlatformColor("?attr/background"),
  },
  default: { label: "black" },
});

export const Sections = {
  FEATURED: {
    name: "Featured",
    slug: "featured",
    id: 1485,
  },
  NEWS: {
    name: "News",
    slug: "news",
    id: 3,
    desks: {
      ACADEMICS: {
        name: "Academics",
        slug: "academics-news",
        id: 4408,
      },
      SCITECH: {
        name: "Science & Technology",
        slug: "science-and-technology-news",
        id: 16821,
      },
      CAMPUS_LIFE: {
        name: "Campus Life",
        slug: "campus-life-news",
        id: 4423,
      },
      GRADUATE_STUDENTS: {
        name: "Graduate Students",
        slug: "graduate-students",
        id: 75212,
      },
      UNIVERSITY: {
        name: "University",
        slug: "university-news",
        id: 4424,
      },
    },
  },
  SPORTS: {
    name: "Sports",
    slug: "sports",
    id: 23,
  },
  OPINIONS: {
    name: "Opinions",
    slug: "opinions",
    id: 24,
  },
  THE_GRIND: {
    name: "The Grind",
    slug: "theGrind",
    id: 32278,
  },
  ARTS_LIFE: {
    name: "Arts & Life",
    slug: "artsAndLife",
    id: 25,
    desks: {
      CULTURE: {
        name: "Culture",
        slug: "culture",
      },
      MUSIC: {
        name: "Music",
        slug: "music-intermission",
      },
      READS: {
        name: "Reads",
        slug: "reads",
      },
      SCREEN: {
        name: "Screen",
        slug: "screen",
      },
    },
  },
  CARTOONS: {
    name: "Cartoons",
    slug: "cartoons",
    id: 41527,
  },
  HUMOR: {
    name: "Humor",
    slug: "humor",
    id: 55796,
  },
  PODCASTS: {
    name: "Podcasts",
    slug: "podcasts",
  },
  MORE_FROM_DAILY: {
    name: "More from The Daily",
    slug: "moreFromTheDaily",
  },
};

export const Spacing = {
  extraSmall: 2,
  small: 4,
  medium: 8,
  large: 16,
  extraLarge: 24,
};

export const Routing = {
  home: "Home",
  post: "Post",
  section: "Section",
  author: "Author",
  search: "Search",
};

export const Labels = {
  all: "All",
  featuredHeadlines: "Featured Headlines",
  news: "News",
  sports: "Sports",
  opinions: "Opinions",
  arts: "Arts & Life",
  grind: "The Grind",
  humor: "Humor",
  data: "Data",
  headlines: "headlines",
  placeholder: "placeholder",
  post: "Post",
  section: "Section",
  posts: "posts",
  category: "Category",
  hashed: "hashed",
  requestSmallPage: "https://www.stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=3&page=",
  requestLargePage: "https://www.stanforddaily.com/wp-json/wp/v2/posts/?_embed&per_page=10&page=",
  searchURL: "&search=",
  categoriesURL: "&categories=",
  categoryChanged: "Category Changed",
  page: "page",
  static: "static",
  lightContent: "light-content",
  moreText: "...",
  mediaURL: "https://www.stanforddaily.com/wp-json/wp/v2/media/",
  dailyURL: "https://www.stanforddaily.com/",
  profile: "Profile",
  childRemoved: "child_removed",
  replies: "replies",
  repliesBodies: "repliesBodies",
  repliesCount: "repliesCount",
  no: "no",
  yes: "yes",
  anon: "Anonymous",
  val: "value",
  timestamp: "TimeStamp",
  navigatesToFullTextArticle: "Navigates to a view with full text for article",
  featureImage: "Feature image",
  chatterPostSuffix: "'s post",
  detailedPost: "DetailedPost",
  pad: "padding",
  replyPlaceholder: "Write a reply...",
  img: "image",
  appOpened: "App opened",
  articlesPreviewRequest: "Article preview request",
  articleFullLoaded: "Article Clicked",
  none: "none",
  undefined: "undefined",
  newestToOldest: "sortDate",
  postsBodies: "postsBodies",
  author: "Author",
  authors: "Authors",
  chatter: "Chatter",
  signedIn: "signedIn",
  users: "Users",
  verified: "verified",
  list: "list",
  profilePictures: "profile_pictures",
  switchedScreen: "Switched Screen",
  loadChatterPosts: "Request for more chatter posts",
  voteChanged: "New vote",
  newReply: "New Reply",
  up: "up",
  down: "down",
  bold: "bold",
  votes: "votes",
  voters: "voters",
  publicPosts: "publicPosts",
  name: "name",
  search: "Search",
  reply: "Reply",
  tipsFormURL: "https://docs.google.com/forms/d/e/1FAIpQLSfrUp-7TeCqe_Whw9LRCttG2It3unK8rJfxNLu9IXZdcbeDIA/viewform?embedded=true",
  tipsFormURLPrefix: "https://docs.google.com/forms/d/e/1FAIpQLSfrUp-7TeCqe_Whw9LRCttG2It3unK8rJfxNLu9IXZdcbeDIA",
  wordPressURL: "https://stanforddaily.com",
};
