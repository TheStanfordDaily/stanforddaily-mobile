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

/**
 * @typedef {Object} Sections
 * @property {Object} FEATURED
 * @property {string} FEATURED.name
 * @property {string} FEATURED.slug
 * @property {number} FEATURED.id
 * @property {Object} NEWS
 * @property {string} NEWS.name
 * @property {string} NEWS.slug
 * @property {number} NEWS.id
 * @property {Object} NEWS.desks
 * @property {Object} NEWS.desks.ACADEMICS
 * @property {string} NEWS.desks.ACADEMICS.name
 * @property {string} NEWS.desks.ACADEMICS.slug
 * @property {number} NEWS.desks.ACADEMICS.id
 * @property {Object} NEWS.desks.SCITECH
 * @property {string} NEWS.desks.SCITECH.name
 * @property {string} NEWS.desks.SCITECH.slug
 * @property {number} NEWS.desks.SCITECH.id
 * @property {Object} NEWS.desks.CAMPUS_LIFE
 * @property {string} NEWS.desks.CAMPUS_LIFE.name
 * @property {string} NEWS.desks.CAMPUS_LIFE.slug
 * @property {number} NEWS.desks.CAMPUS_LIFE.id
 * @property {Object} NEWS.desks.GRADUATE_STUDENTS
 * @property {string} NEWS.desks.GRADUATE_STUDENTS.name
 * @property {string} NEWS.desks.GRADUATE_STUDENTS.slug
 * @property {number} NEWS.desks.GRADUATE_STUDENTS.id
 * @property {Object} NEWS.desks.UNIVERSITY
 * @property {string} NEWS.desks.UNIVERSITY.name
 * @property {string} NEWS.desks.UNIVERSITY.slug
 * @property {number} NEWS.desks.UNIVERSITY.id
 * @property {Object} SPORTS
 * @property {string} SPORTS.name
 * @property {string} SPORTS.slug
 * @property {number} SPORTS.id
 * @property {Object} SPORTS.desks
 * @property {Object} SPORTS.desks.SPORTS_FEATURES
 * @property {string} SPORTS.desks.SPORTS_FEATURES.name
 * @property {string} SPORTS.desks.SPORTS_FEATURES.slug
 * @property {number} SPORTS.desks.SPORTS_FEATURES.id
 * @property {Object} SPORTS.desks.FALL_SPORTS
 * @property {string} SPORTS.desks.FALL_SPORTS.name
 * @property {string} SPORTS.desks.FALL_SPORTS.slug
 * @property {number} SPORTS.desks.FALL_SPORTS.id
 * @property {Object} SPORTS.desks.WINTER_SPORTS
 * @property {string} SPORTS.desks.WINTER_SPORTS.name
 * @property {string} SPORTS.desks.WINTER_SPORTS.slug
 * @property {number} SPORTS.desks.WINTER_SPORTS.id
 * @property {Object} SPORTS.desks.SPRING_SPORTS
 * @property {string} SPORTS.desks.SPRING_SPORTS.name
 * @property {string} SPORTS.desks.SPRING_SPORTS.slug
 * @property {number} SPORTS.desks.SPRING_SPORTS.id
 * @property {Object} SPORTS.desks.THIS_WEEK_IN_SPORTS
 * @property {string} SPORTS.desks.THIS_WEEK_IN_SPORTS.name
 * @property {string} SPORTS.desks.THIS_WEEK_IN_SPORTS.slug
 * @property {number} SPORTS.desks.THIS_WEEK_IN_SPORTS.id
 * @property {Object} OPINIONS
 * @property {string} OPINIONS.name
 * @property {string} OPINIONS.slug
 * @property {number} OPINIONS.id
 * @property {Object} THE_GRIND
 * @property {string} THE_GRIND.name
 * @property {string} THE_GRIND.slug
 * @property {number} THE_GRIND.id
 * @property {Object} ARTS_LIFE
 * @property {string} ARTS_LIFE.name
 * @property {string} ARTS_LIFE.slug
 * @property {number} ARTS_LIFE.id
 * @property {Object} ARTS_LIFE.desks
 * @property {Object} ARTS_LIFE.desks.CULTURE
 * @property {string} ARTS_LIFE.desks.CULTURE.name
 * @property {string} ARTS_LIFE.desks.CULTURE.slug
 * @property {number} ARTS_LIFE.desks.CULTURE.id
 * @property {Object} ARTS_LIFE.desks.MUSIC
 * @property {string} ARTS_LIFE.desks.MUSIC.name
 * @property {string} ARTS_LIFE.desks.MUSIC.slug
 * @property {number} ARTS_LIFE.desks.MUSIC.id
 * @property {Object} ARTS_LIFE.desks.READS
 * @property {string} ARTS_LIFE.desks.READS.name
 * @property {string} ARTS_LIFE.desks.READS.slug
 * @property {number} ARTS_LIFE.desks.READS.id
 * @property {Object} ARTS_LIFE.desks.SCREEN
 * @property {string} ARTS_LIFE.desks.SCREEN.name
 * @property {string} ARTS_LIFE.desks.SCREEN.slug
 * @property {number} ARTS_LIFE.desks.SCREEN.id
 * @property {Object} CARTOONS
 * @property {string} CARTOONS.name
 * @property {string} CARTOONS.slug
 * @property {number} CARTOONS.id
 * @property {Object} HUMOR
 * @property {string} HUMOR.name
 * @property {string} HUMOR.slug
 * @property {number} HUMOR.id
 * @property {Object} PODCASTS
 * @property {string} PODCASTS.name
 * @property {string} PODCASTS.slug
 * @property {number} PODCASTS.id
 * @property {Object} MORE_FROM_DAILY
 * @property {string} MORE_FROM_DAILY.name
 * @property {string} MORE_FROM_DAILY.slug
 *
 * @typedef {Object} Category
 * @property {string} name
 * @property {string} slug
 * @property {number} id
 * @property {Category[]} [desks]
 */
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
    // In some cases we're using "desk" as more of a term of art than a journalistic reference to our organizational structure.
    desks: {
      SPORTS_FEATURES: {
        name: "Sports Features",
        slug: "sports-features",
        id: 57510,
      },
      FALL_SPORTS: {
        name: "Fall Sports",
        slug: "fall-sports",
        id: 45417,
      },
      WINTER_SPORTS: {
        name: "Winter Sports",
        slug: "winter-sports",
        id: 45418,
      },
      SPRING_SPORTS: {
        name: "Spring Sports",
        slug: "spring-sports",
        id: 45419,
      },
      THIS_WEEK_IN_SPORTS: {
        name: "This Week in Sports",
        slug: "this-week-in-sports",
        id: 78545,
      },
    },
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
        id: 40678,
      },
      MUSIC: {
        name: "Music",
        slug: "music-intermission",
        id: 23848,
      },
      READS: {
        name: "Reads",
        slug: "reads",
        id: 40679,
      },
      SCREEN: {
        name: "Screen",
        slug: "screen",
        id: 40640,
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
    id: 61182,
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
