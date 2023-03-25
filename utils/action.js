import { Share } from "react-native"
import * as Notifications from "expo-notifications"
import * as Device from "expo-device"

export const onShare = async (url, title) => {
    try {
        const result = await Share.share({
        url: url,
        message: title + " | The Stanford Daily"
        })
        
        if (result.action === Share.sharedAction) {
        if (result.activityType) {
            // Shared successfully with activity type of result.activityType.
        } else {
            // Shared successfully.
        }
        } else if (result.action === Share.dismissedAction) {
        // Dismissed.
        }
    } catch (error) {
        alert(error.message)
    }
}

export async function registerForPushNotificationsAsync() {
    let token
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      if (finalStatus !== "granted") {
        alert("Failed to get token for push notification.")
        return
      }
      token = (await Notifications.getExpoPushTokenAsync()).data
    } else {
      alert("Must use physical device for Push Notifications.")
    }
  
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C"
      })
    }
  
    return token
}