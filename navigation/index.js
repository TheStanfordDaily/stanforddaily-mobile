// If you are not familiar with React Navigation, check out the "Fundamentals" guide:
// https://reactnavigation.org/docs/getting-started
 
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Platform, PlatformColor } from 'react-native';
import { createNavigationContainerRef } from '@react-navigation/native';

// import { RootStackParamList } from '../types';
import ContentStack from './ContentStack';
import SearchStack from './SearchStack';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const RootStack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Content" component={ContentStack} />
      <RootStack.Screen name="Search" component={SearchStack} options={{ title: 'Oops!' }} />
    </RootStack.Navigator>
  );
}

export const navigationRef = createNavigationContainerRef()