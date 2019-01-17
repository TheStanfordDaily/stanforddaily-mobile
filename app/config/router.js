import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import {Image, View, TouchableOpacity, Dimensions} from 'react-native';
import {STRINGS, MARGINS, HEIGHTS, KEYS} from '../assets/constants.js';
// import TabBarComponent from "../TabBarComponent"

// const myIcon = ()

import Headlines from '../screens/Headlines';
import Search from '../screens/Search';
import Post from '../screens/Post';
import Chatter from '../screens/Chatter';
import NewPost from '../screens/NewPost';
import SignIn from '../screens/SignIn';
import DetailedPost from '../screens/DetailedPost';
import Profile from '../screens/Profile';
import AuthorList from "../screens/authors/AuthorList";
import AuthorDetail from "../screens/authors/AuthorDetail";
import Map from "../screens/map/Map";
import {Amplitude} from 'expo';
import {FONTS} from "../assets/constants";

const amplitude = Amplitude.initialize(KEYS.AMPLITUDE_API);
const iphone_x = Dimensions.get('window').height == 812;
const labelBottomMargin = iphone_x ? MARGINS.IPHONEX_HEADER_ADDITION+3 : 3;
const tabBarHeight = iphone_x ? MARGINS.IPHONEX_HEADER_ADDITION+HEIGHTS.TAB_BAR_HEIGHT : HEIGHTS.TAB_BAR_HEIGHT;

const SearchStack = createStackNavigator({
  Search: {
    screen: Search,
    navigationOptions: {
      title: 'Search',
    },
  },
  Post: {
    screen: Post,
    navigationOptions: {
      title: 'Post',
    },
  },
}, {
  headerMode: 'none',
});

const NewsStack = createStackNavigator({
  Headlines: {
    screen: Headlines,
    navigationOptions: {
      title: 'Headlines',
    },
  },
  Post: {
    screen: Post,
    navigationOptions: {
      title: 'Post',
    },
  },
}, {
  headerMode: 'none',
});

const ChatterStack = createStackNavigator({
  Chatter: {
    screen: Chatter,
    navigationOptions: {
      title: 'Chatter',
      headerStyle: {backgroundColor: '#A82029'},
      headerTintColor: 'white',
    },
  },
  DetailedPost: {
    screen: DetailedPost,
    navigationOptions: ({navigation}) => ({
      headerStyle: {backgroundColor: '#A82029'},
      headerTintColor: 'white',
      title: navigation.state.params.name + "'s Post",
    }),
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      title: 'Profile',
    },
  },
}, {
  headerMode: 'none',
});

const AuthorStack = createStackNavigator({
AuthorList: {
    screen: AuthorList,
    navigationOptions: {
      title: 'Author List',
    },
  },
  AuthorDetail: {
    screen: AuthorDetail,
    navigationOptions: {
      title: 'Author Detail',
    },
  },  
}, {
  headerMode: 'none',
});

const MapStack = createStackNavigator({
  Map: {
      screen: Map,
      navigationOptions: {
        title: 'Map',
      },
    },  
  }, {
    headerMode: 'none',
  });
  

export const Tabs = createBottomTabNavigator({
  News: {
    screen: NewsStack,
    navigationOptions: {
      tabBarLabel: 'Daily News',
      tabBarIcon: ({ tintColor }) => <Image
        source={require('../media/Daily.png')}
        style={{tintColor: tintColor, width: 30, height: 27, marginTop: 5}}
      />,
      // tabBarOnPress: (scene, jumpToIndex) => {
      //     Amplitude.logEvent(STRINGS.SWITCHED_SCREEN, {NewScreen: STRINGS.NEWS});
      //     jumpToIndex(scene.index);
      // },
    },
  },
  Author: {
    screen: AuthorStack,
    navigationOptions: {
      tabBarLabel: 'Authors',
      tabBarIcon: ({ tintColor }) => <Image
        source={require('../media/Community.png')}
        style={{tintColor: tintColor, width: 30, height: 27, marginTop: 5}}
      />
    },
  },
  Map: {
    screen: MapStack,
    navigationOptions: {
      tabBarLabel: 'Map',
      tabBarIcon: ({ tintColor }) => <Image
        source={require('../media/Community.png')}
        style={{tintColor: tintColor, width: 30, height: 27, marginTop: 5}}
      />
    },
  },
// Chatter: {
//   screen: ChatterStack,
//   navigationOptions: {
//     tabBarLabel: 'Chatter',
//     tabBarIcon: ({ tintColor }) => <Image
//       source={require('../media/Community.png')}
//       style={{tintColor: tintColor, width: 30, height: 27, marginTop: 5}}
//     />,
//     tabBarOnPress: (scene, jumpToIndex) => {
//         Amplitude.logEvent(STRINGS.SWITCHED_SCREEN, {NewScreen: STRINGS.CHATTER});
//         jumpToIndex(scene.index);
//     },
//   },
// }
},{
  // tabBarComponent: TabBarComponent,
  tabBarOptions: {
    activeTintColor: '#A82029',
    inactiveTintColor: '#000000',
    inactiveBackgroundColor: 'white',
    activeBackgroundColor: 'white',
    labelStyle: {
      fontFamily: FONTS.PT_SERIF,
      marginBottom: labelBottomMargin
    },
    style: {
      height: tabBarHeight,
      marginBottom: iphone_x ? -34 : 0
    }
  },
  lazy: true
});

const NewPostStack = createStackNavigator({
  NewPost: {
    screen: NewPost,
    navigationOptions: {
      title: 'New Post',
    },
  },
}, {
  headerMode: 'none',
});

const SignInStack = createStackNavigator({
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      title: 'Sign In',
    },
  },
}, {
  headerMode: 'none',
});

export const Root = createStackNavigator({
  Tabs: {
    screen: Tabs,
  },
  NewPost: {
    screen: NewPostStack,
  },
  SignIn: {
    screen: SignInStack,
  },
  Search: {
    screen: SearchStack,
  },
}, {
  mode: 'modal',
  headerMode: 'none'
});
