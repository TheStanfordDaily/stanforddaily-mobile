import * as React from 'react';
import { Image, Text, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Search from '../screens/Search';
import Post from '../screens/Post';
import Author from '../screens/Author';
import Category from '../screens/Category';
import Icon from '@expo/vector-icons/Ionicons';
import { TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import { Strings } from '../constants'
import { SearchBar } from 'react-native-elements'

const Stack = createNativeStackNavigator();

export default function ContentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={({ route, navigation }) => ({
        headerTitle: () => (<Image style={{ width: 260, height: 30 }} source={require("../assets/media/DailyLogoCardinal.png")} />),
        headerRight: () => (<TouchableOpacity onPress={() => navigation.navigate(Strings.search)}><Icon name={(Platform.OS === 'ios' ? 'ios' : 'md') + "-search"} size={25} color="#000" /></TouchableOpacity>)
      })}/>
      <Stack.Screen name="Search" component={Search} options={({ route, navigation }) => ({
        headerBackTitle: "",
      })}/>
      <Stack.Screen name="Post" component={Post} options={({ route }) => ({
        headerBackTitle: "",
        headerTitle: Platform.OS === 'ios' ? '' : () => (<Image style={{ width: 260, height: 30 }} source={require("../assets/media/DailyLogoCardinal.png")} />),
        // headerShown: false,
        headerTransparent: Platform.OS === "ios",
        headerTintColor: Platform.OS === "ios" ? "#fff" : "#000",
      })}/>
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen name="Author" component={Author} />
    </Stack.Navigator>
  );
}