// If you are not familiar with React Navigation, check out the "Fundamentals" guide:
// https://reactnavigation.org/docs/getting-started
 
import { createNavigationContainerRef } from '@react-navigation/native';
import LinkingConfiguration from './LinkingConfiguration';

export const navigationRef = createNavigationContainerRef()

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export const logoAssets = {
  "light": require("../assets/media/DailyLogoCardinal.png"),
  "dark": require("../assets/media/DailyLogoWhite.png")
}
