import * as React from 'react';
import { Image, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Search from '../screens/Search';
import Post from '../screens/Post';
import Author from '../screens/Author';
import Category from '../screens/Category';

const Stack = createNativeStackNavigator();

export default function ContentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{headerTitle: () => (<Image style={{ width: 260, height: 30 }} source={require("../assets/media/DailyLogoCardinal.png")} />)}} />
      {/* <Stack.Screen name="Search" component={Search} /> */}
      <Stack.Screen name="Post" component={Post} options={({ route }) => ({
        headerBackTitle: "",
        headerTitle: false,
        // headerShown: false,
        headerTransparent: true,
        headerTintColor: '#fff',
        headerTitle: ''
        // headerTitle: () => (<Image style={{ width: 260, height: 30 }} source={require("../assets/media/DailyLogoWhite.png")} />),
      })}/>
      {/* <Stack.Screen name="Category" component={Settings} /> */}
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen name="Author" component={Author} />
    </Stack.Navigator>
  );
}