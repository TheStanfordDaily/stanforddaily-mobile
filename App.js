import React, { useState, useEffect, useRef } from "react";
import { Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation, { navigate } from "./navigation";
import * as Font from "expo-font";
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { initializeApp } from "firebase/app"; 
import { getDatabase, ref, push, set } from "firebase/database"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { APIKEY, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID, FIREBASE_PASSWORD, SERVICE_ACCOUNT_ID } from "@env"
import { getPostAsync } from "./helpers/wpapi"
import { Strings } from "./constants"
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry, useTheme } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { DailyBread as bread } from "./theme"
import { default as mapping } from "./mapping.json"
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ContentStack from "./navigation/ContentStack";
import SearchStack from "./navigation/SearchStack";
import Post from "./screens/Post";
import Home from "./screens/Home";
import Section from "./screens/Section";
import { ThemeContext } from "./theme-context";
import Author from "./screens/Author";
import { minion } from "./custom-fonts";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  })
})

const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: "daily-mobile-app-notifications.firebaseapp.com",
  databaseURL: "https://daily-mobile-app-notifications-default-rtdb.firebaseio.com",
  projectId: "daily-mobile-app-notifications",
  storageBucket: "daily-mobile-app-notifications.appspot.com",
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
  serviceAccountId: SERVICE_ACCOUNT_ID
}

const cardinalLogo = require("./assets/media/DailyLogoCardinal.png")
const whiteLogo = require("./assets/media/DailyLogoWhite.png")
const Stack = createStackNavigator()

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [expoPushToken, setExpoPushToken] = useState("")
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()
  // const isLoadingComplete = useLoadedAssets();
  // const colorScheme = useColorScheme();
  const [theme, setTheme] = useState("light")
  
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)
  }

  const headerOptions = {
    headerTitle: () => (
      <Image
        style={{ width: 260, height: 30 }}
        source={theme === "light" ? cardinalLogo : whiteLogo}
      />
    ),
    headerStyle: {
      backgroundColor: bread[theme]["background-basic-color-1"]
    },
    headerTintColor: eva[theme]["color-primary-500"]
  }

  const detailHeaderOptions = {
    headerTitle: "",
    headerTransparent: true,
    headerTintColor: "white",
    headerBackTitleVisible: false
  }

  const sectionHeaderOptions = {
    headerStyle: {
      backgroundColor: bread[theme]["background-basic-color-1"]
    },
    headerTintColor: bread[theme]["color-primary-500"],
    headerTitleStyle: {
      color: eva[theme][theme === "light" ? "color-basic-800" : "color-basic-100"]
    }
  }

  useEffect(() => {
    // Loads fonts from static resource.
    Font.loadAsync(minion).then(setFontsLoaded(true))
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token)
      if (Object.keys(firebaseConfig).length > 0) {
        const app = initializeApp(firebaseConfig)
        const db = getDatabase(app)
        var matches = expoPushToken.match(/\[(.*?)\]/)
        if (matches) {
          var submatch = matches[1]
          const auth = getAuth(app)
          signInWithEmailAndPassword(auth, "tech@stanforddaily.com", FIREBASE_PASSWORD).then((userCredential) => {
            const tokenRef = ref(db, "ExpoPushTokens/" + submatch, userCredential)
            set(tokenRef, Date())
          }).catch((error) => {
            console.log("Could not sign in: ", error)
          })
        }
      }
    })

    // This listener is fired whenever a notification is received while the app is foregrounded.
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification)
    })

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded or killed).
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      getPostAsync(response.notification.request.trigger.payload.body.postID).then(result => {
        navigate(Strings.post, { item: result })
      })
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

      return (fontsLoaded &&
        <NavigationContainer>
          <IconRegistry icons={EvaIconsPack}/>
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <ApplicationProvider {...eva} theme={{...eva[theme], ...bread[theme]}} customMapping={mapping}>
              <SafeAreaProvider>
                <StatusBar/>
                <Stack.Navigator initialRouteName="Home">
                  <Stack.Screen
                    name="Home"
                    component={Home}
                    options={headerOptions}
                  />
                  <Stack.Screen
                    name="Post"
                    component={Post}
                    options={detailHeaderOptions}
                  />
                  <Stack.Screen
                    name="Section"
                    component={Section}
                    options={({ route }) => ({ title: route.params.category.name, ...sectionHeaderOptions })}
                  />
                  <Stack.Screen
                    name="Author"
                    component={Author}
                    options={({ route }) => ({ title: route.params.name })}
                  />
                </Stack.Navigator>
              </SafeAreaProvider>
            </ApplicationProvider>
          </ThemeContext.Provider>
        </NavigationContainer>
      )
}

async function registerForPushNotificationsAsync() {
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