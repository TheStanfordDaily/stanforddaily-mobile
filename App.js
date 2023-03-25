import React, { useState, useEffect, useRef } from "react"
import { Appearance, Image, Linking, Platform, TextInput, TouchableOpacity } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { navigate, logoAssets } from "./navigation"
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
import { ThemeContext } from "./theme-context"
import { minion } from "./custom-fonts"
import { decode } from "html-entities"
import Model from "./utils/model"
import { APIKEY, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID, SERVICE_ACCOUNT_ID, TECH_PASSWORD } from "@env"
import { Author, Home, Post, Section, Search } from "./components/screens"
import { getActiveRouteInfo, validateConfig } from "./utils/format"
import { onShare, registerForPushNotificationsAsync } from "./utils/action"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
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
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchVisible, setSearchVisible] = useState(false)

  let app, auth, db
  if (validateConfig(firebaseConfig)) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getDatabase(app)
  }

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)
  }
  
  const [configValidated, setConfigValidated] = useState(validateConfig(firebaseConfig))

  const navigatorTheme = {
    light: DefaultTheme,
    dark: DarkTheme
  }

  const handleSearch = () => {
    setSearchVisible(true);
  };

  const handleSearchSubmit = () => {
    setSearchVisible(false);
  };

  const handleSearchCancel = () => {
    setSearchVisible(false);
    setSearchQuery("");
  };

  const headerOptions = ({ navigation, route }) => {
    return {
      headerTitle: () => searchVisible ? (
        <TextInput autoFocus style={{ width: "100%" }} value={searchQuery} onChangeText={setSearchQuery} onSubmitEditing={handleSearchSubmit} onBlur={handleSearchCancel} />
      ) : (
        <Image
          style={{ width: 260, height: 30 }}
          source={logoAssets[theme]}
        />
      ),
      headerRight: () => (
        <TouchableOpacity style={{ paddingHorizontal: 16 }} onPress={() => {
            navigation.setParams({ isSearching: true, searchQuery })
            setSearchVisible(true)
          }}>
            <Icon name="search-outline" width={24} height={24} fill={theme === "dark" ? "white" : "black"} />
        </TouchableOpacity>
      )
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

  function logNavigationState(e) {
    const info = getActiveRouteInfo(e)

    // TODO: Check whether this condition is actually doing what we want it to do.
    if (!(seen.has(info.key) || seen.has(info?.id))) {
      signInWithEmailAndPassword(auth, "tech@stanforddaily.com", TECH_PASSWORD).then((userCredential) => {
        const analyticsRef = ref(db, "Analytics/", userCredential)
        push(analyticsRef, info).catch(error => console.log(error))
      })
      .then(() => setSeen(new Set([...seen, info.key, info?.id ?? ""])))
      .catch(error => console.trace(error))
    }
  }

  useEffect(() => {
    // Loads fonts from static resource.
    Font.loadAsync(minion).then(() => setFontsLoaded(true))

    if (validateConfig(firebaseConfig)) {
      registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token)
      var matches = token?.match(/\[(.*?)\]/)

      if (matches && configValidated) {
          var submatch = matches[1]
          signInWithEmailAndPassword(auth, "tech@stanforddaily.com", TECH_PASSWORD).then((userCredential) => {
            const tokenRef = ref(db, "ExpoPushTokens/" + submatch, userCredential)
            set(tokenRef, new Date().toISOString()).catch(error => console.log(error))
          }).catch(error => {
            console.trace(error)
            setConfigValidated(false)
          })
        }
      })
    }

    Device.getDeviceTypeAsync().then(type => setDeviceType(type))

    // Handles any event in which appearance preferences change.
    Appearance.addChangeListener(listener => {
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

    // FIXME: Listener for when app is opened from web browser.
    Linking.addEventListener("url", response => {
      if (response.url) {
        const url = response.url
        const slug = url.split("/").pop()
        if (slug?.length > 0) {
          Model.posts().slug(slug).embed().then(result => {
            navigate(Strings.post, { item: result })
          })
        }
      }
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])


  return fontsLoaded && (
    <NavigationContainer onStateChange={logNavigationState} theme={navigatorTheme[theme]}>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider value={{ theme, toggleTheme, deviceType }}>
        <ApplicationProvider {...eva} theme={{...eva[theme], ...bread[theme]}} customMapping={mapping}>
          <SafeAreaProvider>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={Home} options={headerOptions} isSearching={isSearching} />
              <Stack.Screen name="Post" component={Post} options={detailHeaderOptions} />
              <Stack.Screen name="Section" component={Section} options={sectionOptions} />
              <Stack.Screen name="Author" component={Author} options={authorOptions} />
              <Stack.Screen name="Search" component={Search} options={searchHeaderOptions} />
            </Stack.Navigator>
          </SafeAreaProvider>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </NavigationContainer>
  )
}