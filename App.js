import React, { useState, useEffect, useRef } from "react"
import { Appearance, Image, Platform, Share, StatusBar, TouchableOpacity } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { navigate, logoAssets, statusBarStyles } from "./navigation"
import * as Font from "expo-font"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { initializeApp } from "firebase/app" 
import { getDatabase, ref, push, set } from "firebase/database"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { Strings } from "./constants"
import * as eva from "@eva-design/eva"
import { ApplicationProvider, Icon, IconRegistry, Text } from "@ui-kitten/components"
import { EvaIconsPack } from "@ui-kitten/eva-icons"
import { DailyBread as bread } from "./theme"
import { default as mapping } from "./mapping.json"
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import Post from "./screens/Post"
import Home from "./screens/Home"
import Section from "./screens/Section"
import { ThemeContext } from "./theme-context"
import Author from "./screens/Author"
import { minion } from "./custom-fonts"
import { decode } from "html-entities"
import Model from "./Model"
import Search from "./screens/Search"
import { APIKEY, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID, SERVICE_ACCOUNT_ID } from "@env"

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

const Stack = createStackNavigator()

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [expoPushToken, setExpoPushToken] = useState("")
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()
  const colorScheme = Appearance.getColorScheme()
  const [theme, setTheme] = useState(colorScheme)
  const [deviceType, setDeviceType] = useState(Device.DeviceType.PHONE)
  const [seen, setSeen] = useState(new Set())

  const validateConfig = (config) => {
    return config.apiKey && config.messagingSenderId && config.appId && config.measurementId && config.serviceAccountId
  }
  
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)
    StatusBar.setBarStyle((next === "light" ? "dark" : "light") + "-content")
  }

  const onShare = async (url, title) => {
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

  const navigatorTheme = {
    light: DefaultTheme,
    dark: DarkTheme
  }

  const headerOptions = ({ navigation, route }) => {
    return {
      headerTitle: () => (
        <Image
          style={{ width: 260, height: 30 }}
          source={logoAssets[theme]}
        />
      ),
      /*headerRight: () => (
        <TouchableOpacity style={{ paddingHorizontal: 16 }} onPress={() => navigation.navigate("Search")}>
            <Icon name={ "search-outline"} width={24} height={24} fill={theme === "dark" ? "white" : "black"} />
        </TouchableOpacity>
      )*/
    }
  }

  const detailHeaderOptions = ({ navigation, route }) => {
    return {
      headerTitle: "",
      headerTransparent: true,
      headerTintColor: "white",
      headerBackTitleVisible: false,
      headerRight: () => (
        <TouchableOpacity style={{ paddingHorizontal: 16 }} onPress={() => onShare(route.params.article.link, decode(route.params.article.title.rendered))}>
          <Icon name="share-outline" width={24} height={24} fill="white" />
        </TouchableOpacity>
      )
    }
  }

  const detailHeaderListeners = {
    focus: () => StatusBar.setBarStyle("light-content", true),
    blur: () => {
      if (theme === "light") {
        StatusBar.setBarStyle("dark-content", true)
      }
    }
  }

  const sectionOptions = ({ route }) => ({
    headerTitle: () => <Text category="h4">{decode(route.params.category.name).replace('\'', '\u{2019}')}</Text>,
    headerTitleStyle: { fontFamily: "MinionProBold" },
    headerTintColor: bread[theme]["color-primary-500"]
  })

  const authorOptions = ({ route }) => ({
    headerTitle: () => <Text category="h4">{route.params.name}</Text>,
    headerTitleStyle: { fontFamily: "MinionProBold" },
    headerTintColor: bread[theme]["color-primary-500"]
  })

  const searchHeaderOptions = {
    headerTintColor: bread[theme]["color-primary-500"]
  }

  var events = []
  let app
  let auth
  let db
  if (validateConfig(firebaseConfig)) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getDatabase(app)
  }

  useEffect(() => {
    // Loads fonts from static resource.
    Font.loadAsync(minion).then(() => setFontsLoaded(true))

    if (validateConfig(firebaseConfig)) {
        registerForPushNotificationsAsync().then(token => {
        setExpoPushToken(token)
        var matches = token?.match(/\[(.*?)\]/)

      if (matches) {
          var submatch = matches[1]
          signInWithEmailAndPassword(auth, "tech@stanforddaily.com", process.env.FIREBASE_PASSWORD).then((userCredential) => {
            const tokenRef = ref(db, "ExpoPushTokens/" + submatch, userCredential)
            set(tokenRef, Date())
          })
        }
      })
    }

    Device.getDeviceTypeAsync().then(setDeviceType)

    // Handles any event in which appearance preferences change.
    Appearance.addChangeListener(listener => {
      StatusBar.setBarStyle(listener.colorScheme === "dark" ? "light-content" : "dark-content", true)
      setTheme(listener.colorScheme)
      // TODO: Add return function for removing listener when user opts out of automatic theme changes.
    })    

    // This listener is fired whenever a notification is received while the app is foregrounded.
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification)
    })

    // This listener is fired whenever a user taps on or interacts with a notification.
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Works when app is foregrounded, backgrounded or killed.
      Model.posts().id(response.notification.request.trigger.payload.body.postID).embed().then((result) => {
        navigate(Strings.post, { item: result })
      })
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  
      return fontsLoaded && (
        <NavigationContainer onStateChange={e => {
            const name = getActiveRouteName(e)
            if (!(name in seen)) {
              signInWithEmailAndPassword(auth, "tech@stanforddaily.com", process.env.FIREBASE_PASSWORD).then((userCredential) => {
                const analyticsRef = ref(db, "Analytics/", userCredential)
                push(analyticsRef, JSON.stringify(e)) // Still figuring out how to format as an object in Firebase.
              })
              events.push(e)
            }
          }} theme={navigatorTheme[theme]}>
          <IconRegistry icons={EvaIconsPack} />
          <ThemeContext.Provider value={{ theme, toggleTheme, deviceType }}>
            <ApplicationProvider {...eva} theme={{...eva[theme], ...bread[theme]}} customMapping={mapping}>
              <SafeAreaProvider>
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
                    listeners={detailHeaderListeners}
                  />
                  <Stack.Screen
                    name="Section"
                    component={Section}
                    options={sectionOptions}
                  />
                  <Stack.Screen
                    name="Author"
                    component={Author}
                    options={authorOptions}
                  />
                  <Stack.Screen
                    name="Search"
                    component={Search}
                    options={searchHeaderOptions}
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

function getActiveRouteName(navigationState) {
  if (!navigationState) return null;
  const route = navigationState.routes[navigationState.index];
  // Traverse the nested navigators.
  if (route.routes) return getActiveRouteName(route)
  
  var out = route.key + "-"
  if (route.params?.id) {
    out += route.params?.id
  } else if (route.params?.article?.id) {
    out += route.params?.article?.id
  } else if (route.params?.category?.id) {
    out += route.params?.category?.id
  } else if (route.params?.name) {
    out += route.params?.name
  } else {
    out = route.key
  }
  
  return out
}