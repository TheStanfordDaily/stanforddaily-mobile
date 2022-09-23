// If you are not familiar with React Navigation, check out the "Fundamentals" guide:
// https://reactnavigation.org/docs/getting-started
 
import * as React from 'react';
import { createNavigationContainerRef } from '@react-navigation/native';

// import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import * as Analtyics from "expo-firebase-analytics"

export const navigationRef = createNavigationContainerRef()
navigationRef.addListener('state', async e => {
  const eventState = e.data.state
  const screenName = eventState?.routes[eventState?.index].name
  // await Analtyics.logEvent("screen_view", { screenName } )
})

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export const logoAssets = {
  "light": require("../assets/media/DailyLogoCardinal.png"),
  "dark": require("../assets/media/DailyLogoWhite.png")
}

export const statusBarStyles = {
  ios: {
    light: "light-content",
    dark: "dark-content"
  },
  android: {
    light: "dark-content",
    dark: "light-content"
  }
}

function getActiveRouteName(navigationState) {
  if (!navigationState) return null;
  const route = navigationState.routes[navigationState.index];
  // Parse the nested navigators
  if (route.routes) return getActiveRouteName(route);
  return route.routeName;
}