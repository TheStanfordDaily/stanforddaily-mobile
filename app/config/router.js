import React from 'react';
import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import {Image, View, TouchableOpacity, Dimensions} from 'react-native';
import {STRINGS, MARGINS, HEIGHTS, KEYS, ICONS, COLORS} from '../assets/constants.js';
import { Ionicons } from '@expo/vector-icons';
import Headlines from '../screens/Headlines';
import Search from '../screens/Search';
import Post from '../screens/Post';
import AuthorList from "../screens/authors/AuthorList";
import AuthorDetail from "../screens/authors/AuthorDetail";
import Map from "../screens/map/Map";
import * as Amplitude from 'expo-analytics-amplitude';
import {FONTS} from "../assets/constants";

const amplitude = Amplitude.initialize(KEYS.AMPLITUDE_API);
const iphone_x = Dimensions.get('window').height == 812;
const labelBottomMargin = 3;
const tabBarHeight = HEIGHTS.TAB_BAR_HEIGHT;

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
        style={{tintColor: tintColor, width: 25, height: 25, marginTop: 6}}
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
      tabBarIcon: ({ tintColor }) => <Ionicons name={ICONS.AUTHORS_PAGE} size={27} color={tintColor} style={{ marginTop: 5 }} />
    },
  },
  Map: {
    screen: MapStack,
    navigationOptions: {
      tabBarLabel: 'Map',
      tabBarIcon: ({ tintColor }) => <Ionicons name={ICONS.MAP_PAGE} size={27} color={tintColor} style={{ marginTop: 5 }} />
    },
  }
},{
  tabBarOptions: {
    activeTintColor: COLORS.CARDINAL,
    inactiveTintColor: '#000000',
    inactiveBackgroundColor: 'white',
    activeBackgroundColor: 'white',
    labelStyle: {
      fontFamily: FONTS.PT_SERIF,
      marginBottom: labelBottomMargin
    },
    style: {
      height: tabBarHeight,
      // Ref:
      // https://github.com/react-navigation/react-navigation/issues/3882
      // https://github.com/react-navigation/react-navigation/issues/3055
      // So we have to hard-code the marginBottom to avoid extra gap.
      marginBottom: iphone_x ? -34 : 0
    }
  },
  lazy: true
});

const Root = createStackNavigator({
  Tabs: {
    screen: Tabs,
  },
  Search: {
    screen: SearchStack,
  },
}, {
  mode: 'modal',
  headerMode: 'none'
});

// https://reactnavigation.org/docs/en/app-containers.html
export const RootContainer = createAppContainer(Root);
