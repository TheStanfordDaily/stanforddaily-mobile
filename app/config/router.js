import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import {Image, View, TouchableOpacity, Dimensions} from 'react-native';
import {STRINGS, MARGINS, HEIGHTS, KEYS} from '../assets/constants.js';
import TabBarComponent from "../TabBarComponent"

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
import Expo from "expo";

const amplitude = Expo.Amplitude.initialize(KEYS.AMPLITUDE_API);
const iphone_x = Dimensions.get('window').height == 812;
const labelBottomMargin = iphone_x ? MARGINS.IPHONEX_HEADER_ADDITION+3 : 3;
const tabBarHeight = iphone_x ? MARGINS.IPHONEX_HEADER_ADDITION+HEIGHTS.TAB_BAR_HEIGHT : HEIGHTS.TAB_BAR_HEIGHT;

const SearchStack = StackNavigator({
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

const NewsStack = StackNavigator({
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

const ChatterStack = StackNavigator({
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

const AuthorStack = StackNavigator({
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

export const Tabs = TabNavigator({
  News: {
    screen: NewsStack,
    navigationOptions: {
      tabBarLabel: 'Daily News',
      tabBarIcon: ({ tintColor }) => <Image
        source={require('../media/Daily.png')}
        style={{tintColor: tintColor, width: 30, height: 27, marginTop: 5}}
      />,
      tabBarOnPress: (scene, jumpToIndex) => {
          amplitude.logEvent(STRINGS.SWITCHED_SCREEN, {NewScreen: STRINGS.NEWS});
          jumpToIndex(scene.index);
      },
    },
  },
  Author: {
    screen: AuthorStack,
    navigationOptions: {
      tabBarLabel: 'Authors',
      tabBarIcon: ({ tintColor }) => <Image
        source={require('../media/Community.png')}
        style={{tintColor: tintColor, width: 30, height: 27, marginTop: 5}}
      />,
      tabBarOnPress: (scene, jumpToIndex) => {
          amplitude.logEvent(STRINGS.SWITCHED_SCREEN, {NewScreen: STRINGS.AUTHORS});
          jumpToIndex(scene.index);
      },
    },
  }
// Chatter: {
//   screen: ChatterStack,
//   navigationOptions: {
//     tabBarLabel: 'Chatter',
//     tabBarIcon: ({ tintColor }) => <Image
//       source={require('../media/Community.png')}
//       style={{tintColor: tintColor, width: 30, height: 27, marginTop: 5}}
//     />,
//     tabBarOnPress: (scene, jumpToIndex) => {
//         amplitude.logEvent(STRINGS.SWITCHED_SCREEN, {NewScreen: STRINGS.CHATTER});
//         jumpToIndex(scene.index);
//     },
//   },
// }
},{
  tabBarComponent: TabBarComponent,
  tabBarOptions: {
    activeTintColor: '#A82029',
    inactiveTintColor: '#000000',
    inactiveBackgroundColor: 'white',
    activeBackgroundColor: 'white',
    labelStyle: {
      fontFamily: 'PT Serif',
      marginBottom: labelBottomMargin,
    },
    style: {
      height: tabBarHeight,
      marginBottom: iphone_x ? -34 : 0
    }
  },
  lazy: true
});

const NewPostStack = StackNavigator({
  NewPost: {
    screen: NewPost,
    navigationOptions: {
      title: 'New Post',
    },
  },
}, {
  headerMode: 'none',
});

const SignInStack = StackNavigator({
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      title: 'Sign In',
    },
  },
}, {
  headerMode: 'none',
});

export const Root = StackNavigator({
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
  }
}, {
  mode: 'modal',
  headerMode: 'none'
});
