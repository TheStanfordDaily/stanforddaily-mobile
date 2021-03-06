import React from 'react';
import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import {Image, Dimensions} from 'react-native';
import {HEIGHTS, ICONS, COLORS} from '../assets/constants.js';
import { Ionicons } from '@expo/vector-icons';
import Headlines from '../screens/Headlines';
import Search from '../screens/Search';
import Post from '../screens/Post';
import Tips from "../screens/Tips";

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

const TipStack = createStackNavigator({
  Tips: {
    screen: Tips,
    navigationOptions: {
      title: 'Tips',
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
  Tips: {
    screen: TipStack,
    navigationOptions: {
      tabBarLabel: 'Tips',
      tabBarIcon: ({ tintColor }) => <Ionicons name={ICONS.TIPS_PAGE} size={27} color={tintColor} style={{ marginTop: 5 }} />
    },
  }
},{
  tabBarOptions: {
    activeTintColor: COLORS.CARDINAL,
    inactiveTintColor: '#000000',
    inactiveBackgroundColor: 'white',
    activeBackgroundColor: 'white',
    labelStyle: {
      fontFamily: "Open Sans", // FONTS.PT_SERIF
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
