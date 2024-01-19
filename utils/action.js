import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform, Share, UIManager } from "react-native";

/**
 * Use this function to open a share sheet for an article on iOS or Android.
 * @function
 * @param {string} url - The URL to share.
 * @param {string} title - The title of the content to share.
 * @returns {Promise<void>} A promise that resolves when the sharing action is complete.
 */
export const onShare = async (url, title) => {
  try {
    const result = await Share.share({ url, message: `${title} | The Stanford Daily` });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // Shared successfully with activity type of `result.activityType`.
      } else {
        // Shared successfully.
      }
    } else if (result.action === Share.dismissedAction) {
      // Dismissed.
    }
  } catch (error) {
    alert(error.message);
  }
};

/**
 * Register the current device for push notifications. If registration fails, the promise resolves to null.
 * @function
 * @returns {Promise<string | undefined>} A promise that resolves to the Expo push token if the user agrees to receive notifications.
 */
export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get token for push notification.");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications.");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

/**
 * Allows for automatic animation for views whose position will change in the next render.
 * Use this API before state updates to avoid visual inconsistencies.
 * https://reactnative.dev/docs/layoutanimation
 * @function
 */
export function enableAnimationExperimental() {
  if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true); // Without setting this flag, the animations do not work on Android.
  }
}
