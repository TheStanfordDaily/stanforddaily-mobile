import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import {Image, View, TouchableOpacity} from 'react-native';
// const myIcon = ()

import Headlines from '../screens/Headlines';
import Post from '../screens/Post';
import Chatter from '../screens/Chatter';
import NewPost from '../screens/NewPost';
import SignIn from '../screens/SignIn';
import DetailedPost from '../screens/DetailedPost';
import Profile from '../screens/Profile';

export const NewsStack = StackNavigator({
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

export const ChatterStack = StackNavigator({
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

export const Tabs = TabNavigator({
  News: {
    screen: NewsStack,
    navigationOptions: {
      tabBarLabel: 'Daily News',
      tabBarIcon: ({ tintColor }) => <Image
        source={require('../media/Daily.png')}
        style={{tintColor: tintColor, width: 30, height: 27, marginTop: 5}}
      />,
    },
  },
Chatter: {
  screen: ChatterStack,
  navigationOptions: {
    tabBarLabel: 'Chatter',
    tabBarIcon: ({ tintColor }) => <Image
      source={require('../media/Community.png')}
      style={{tintColor: tintColor, width: 30, height: 27, marginTop: 5}}
    />,
  },
}
},{
  tabBarOptions: {
    activeTintColor: '#A82029',
    inactiveTintColor: '#000000',
    inactiveBackgroundColor: 'white',
    activeBackgroundColor: 'white',
    labelStyle: {
      fontFamily: 'PT Serif',
      marginBottom: 3,
    }
  },
  lazy: true
});

export const NewPostStack = StackNavigator({
  NewPost: {
    screen: NewPost,
    navigationOptions: {
      title: 'New Post',
    },
  },
}, {
  headerMode: 'none',
});

export const SignInStack = StackNavigator({
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
  }
}, {
  mode: 'modal',
  headerMode: 'none'
});
