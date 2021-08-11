import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Search from '../screens/Search';
import Post from '../screens/Post';

const Stack = createNativeStackNavigator();

export default function ContentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      {/* <Stack.Screen name="Search" component={Search} /> */}
      {/* <Stack.Screen name="Post" component={Post} /> */}
      {/* <Stack.Screen name="Category" component={Settings} /> */}
      {/* <Stack.Screen name="Author" component={Author} /> */}
    </Stack.Navigator>
  );
}