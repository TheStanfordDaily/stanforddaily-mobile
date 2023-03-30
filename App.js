import React, { useState, useEffect, useRef, useMemo } from "react"
import { Appearance, Dimensions, Image, Keyboard, LayoutAnimation, Linking, Platform, TextInput, TouchableOpacity } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { navigate, logoAssets } from "./navigation"
import * as Font from "expo-font"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { ref, push, set } from "firebase/database"
import { signInWithEmailAndPassword } from "firebase/auth"
import { Strings, Fonts, Spacing } from "./utils/constants"
import * as eva from "@eva-design/eva"
import { ApplicationProvider, Icon, IconRegistry, Input, Text } from "@ui-kitten/components"
import { EvaIconsPack } from "@ui-kitten/eva-icons"
import { DailyBread as bread } from "./theme"
import { default as mapping } from "./mapping.json"
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { ThemeContext } from "./theme-context"
import { decode } from "html-entities"
import Model from "./utils/model"
import { TECH_PASSWORD } from "@env"
import { Author, Home, Post, Section, Search } from "./components/screens"
import { getActiveRouteInfo, getMostCommonTagsFromRecentPosts, validateConfig } from "./utils/format"
import { enableAnimationExperimental, onShare, registerForPushNotificationsAsync } from "./utils/action"
import { logNavigationEvent, onStateChange } from "./utils/analytics"
// import { v4 as uuidv4 } from "uuid"
// import { useFirebase } from "./hooks/useFirebase"

const SESSION_ID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

const { width, height } = Dimensions.get("window")
const Stack = createStackNavigator()
enableAnimationExperimental()

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [expoPushToken, setExpoPushToken] = useState("")
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()
  const colorScheme = Appearance.getColorScheme()
  const [theme, setTheme] = useState(colorScheme)
  const [deviceType, setDeviceType] = useState(Device.DeviceType.PHONE)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchVisible, setSearchVisible] = useState(false)
  const [activeRouteInfo, setActiveRouteInfo] = useState({})
  const useActiveRouteInfo = useMemo(() => getActiveRouteInfo, [])
  const [configValidated, setConfigValidated] = useState(false)
  const [tags, setTags] = useState([])

  const firebase = useState(null)

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)
  }
  
  const navigatorTheme = {
    light: DefaultTheme,
    dark: DarkTheme
  }

  const openSearch = () => {
    setSearchVisible(prevSearchVisible => !prevSearchVisible);
    if (searchVisible) {
      Keyboard.dismiss();
    }
  }
  
  const closeSearch = () => {
    Keyboard.dismiss()
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setSearchVisible(false)
    setSearchQuery("")
  }

  const headerOptions = ({ navigation, route }) => {
    return {
      headerTitle: () => (
        <Image
          style={{ width: 260, height: 30 }}
          source={logoAssets[theme]}
        />
      ),
      headerRight: () => !searchVisible && (
        <TouchableOpacity style={{ paddingHorizontal: 16 }} onPress={() => navigation.navigate(Strings.search, { tags })}>
          <Icon name="search-outline" width={24} height={24} fill={theme === "dark" ? "white" : "black"} />
        </TouchableOpacity>
      )
    };
  };
    
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
    headerTitle: () => <Text category="h4">{decode(route.params.category.name).replace("'", "\u{2019}")}</Text>,
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

  const logNavigationChange = (state) => {
    const route = state.routes[state.index]
    logNavigationEvent(route.name, SESSION_ID)
  }


  useEffect(() => {
    // Loads fonts from static resource.
    Font.loadAsync(Fonts.minion).then(() => setFontsLoaded(true))

    if (firebase) {
      registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token)
      var matches = token?.match(/\[(.*?)\]/)

      if (matches) {
          var submatch = matches[1]
          signInWithEmailAndPassword(firebase.auth, "tech@stanforddaily.com", TECH_PASSWORD).then((userCredential) => {
            const tokenRef = ref(firebase.db, "ExpoPushTokens/" + submatch, userCredential)
            set(tokenRef, new Date().toISOString()).catch(error => console.log(error))
          }).catch(error => {
            console.trace(error)
            setConfigValidated(false)
          })
        }
      })
    }

    Device.getDeviceTypeAsync().then(type => setDeviceType(type))

    getMostCommonTagsFromRecentPosts(100, 10).then((tags) => setTags(tags))

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
    <NavigationContainer onStateChange={onStateChange} theme={navigatorTheme[theme]}>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider value={{ theme, toggleTheme, deviceType }}>
        <ApplicationProvider {...eva} theme={{ ...eva[theme], ...bread[theme] }} customMapping={mapping}>
          <SafeAreaProvider>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={Home} options={headerOptions} />
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