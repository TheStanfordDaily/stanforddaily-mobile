import * as React from 'react';
import { Image, Text, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Post from '../screens/Post';
import Author from '../screens/Author';
import Category from '../screens/Section';

const Stack = createNativeStackNavigator();

export default function ContentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{headerTitle: () => (<Image style={{ width: 260, height: 30 }} source={require("../assets/media/DailyLogoCardinal.png")} />)}} />
      {/* <Stack.Screen name="Search" component={Search} /> */}
      <Stack.Screen name="Post" component={Post} options={({ route }) => ({
        headerBackTitle: "",
        headerTitle: Platform.OS === 'ios' ? '' : () => (<Image style={{ width: 260, height: 30 }} source={require("../assets/media/DailyLogoCardinal.png")} />),
        // headerShown: false,
        headerTransparent: Platform.OS === "ios",
        headerTintColor: Platform.OS === "ios" ? "#fff" : "#000",
        // headerTitle: false
        // headerTitle: () => (<Image style={{ width: 260, height: 30 }} source={require("../assets/media/DailyLogoWhite.png")} />),
      })}/>
      {/* <Stack.Screen name="Category" component={Settings} /> */}
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen name="Author" component={Author} />
    </Stack.Navigator>
  );
}