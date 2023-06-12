import React, { useEffect, useRef, useState } from "react";
import { Appearance, Image, Linking, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from "expo-font";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Icon, IconRegistry, Text } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { decode } from "html-entities";
import { APIKEY, APP_ID, MEASUREMENT_ID, MESSAGING_SENDER_ID, SERVICE_ACCOUNT_ID, TECH_PASSWORD } from "@env";

import { DailyBread as bread } from "./theme";
import mapping from "./mapping.json";
import { ThemeContext } from "./theme-context";
import Model from "./utils/model";
import { Fonts, Strings } from "./utils/constants";
import { logoAssets, navigate } from "./navigation";
import { Author, Home, Post, Search, Section } from "./components/screens";
import { getMostCommonTagsFromRecentPosts } from "./utils/format";
import { enableAnimationExperimental, onShare, registerForPushNotificationsAsync } from "./utils/action";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

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
};

const Stack = createStackNavigator();
enableAnimationExperimental();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(colorScheme);
  const [deviceType, setDeviceType] = useState(Device.DeviceType.PHONE);
  const [searchVisible, setSearchVisible] = useState(false);
  const [configValidated, setConfigValidated] = useState(false);
  const [tags, setTags] = useState([]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
  };

  const navigatorTheme = {
    light: DefaultTheme,
    dark: DarkTheme
  };

  const headerOptions = ({ navigation, route }) => ({
    headerTitle: () => <Image style={{ width: 260, height: 30 }} source={logoAssets[theme]} />,
    headerRight: () => !searchVisible && (
      <TouchableOpacity style={{ paddingHorizontal: 16 }} onPress={() => navigation.navigate(Strings.search, { tags })}>
        <Icon name="search-outline" width={24} height={24} fill={theme === "dark" ? "white" : "black"} />
      </TouchableOpacity>
    )
  });

  const detailHeaderOptions = ({ navigation, route }) => ({
    headerTitle: "",
    headerTransparent: true,
    headerTintColor: "white",
    headerBackTitleVisible: false,
    headerRight: () => (
      <TouchableOpacity style={{ paddingHorizontal: 16 }} onPress={() => onShare(route.params.article.link, decode(route.params.article.title.rendered))}>
        <Icon name="share-outline" width={24} height={24} fill="white" />
      </TouchableOpacity>
    )
  });
    
  const sectionOptions = ({ route }) => ({
    headerTitle: () => <Text category="h4">{decode(route.params.category.name).replace("'", "\u{2019}")}</Text>,
    headerTitleStyle: { fontFamily: "MinionProBold" },
    headerTintColor: bread[theme]["color-primary-500"]
  });
  
  const authorOptions = ({ route }) => ({
    headerTitle: () => <Text category="h4">{route.params.name}</Text>,
    headerTitleStyle: { fontFamily: "MinionProBold" },
    headerTintColor: bread[theme]["color-primary-500"]
  });
  
  const searchHeaderOptions = {
    headerTintColor: bread[theme]["color-primary-500"]
  };

  useEffect(() => {
    // Loads fonts from static resource.
    Font.loadAsync(Fonts.minion).then(() => setFontsLoaded(true));

    /*
     *If (firebase) {
     *registerForPushNotificationsAsync().then(token => {
     *setExpoPushToken(token)
     *var matches = token?.match(/\[(.*?)\]/)
     *
     *if (matches) {
     *    var submatch = matches[1]
     *    signInWithEmailAndPassword(firebase.auth, "tech@stanforddaily.com", TECH_PASSWORD).then((userCredential) => {
     *      const tokenRef = ref(firebase.db, "ExpoPushTokens/" + submatch, userCredential)
     *      set(tokenRef, new Date().toISOString()).catch(error => console.log(error))
     *    }).catch(error => console.trace(error))
     *  }
     *})
     *}
     */

    Device.getDeviceTypeAsync().then(type => setDeviceType(type));

    getMostCommonTagsFromRecentPosts(100, 10).then(tags => setTags(tags));

    // Handles any event in which appearance preferences change.
    const themeListener = Appearance.addChangeListener(listener => {
      if (theme !== listener.colorScheme) {
        setTheme(listener.colorScheme);
      }
    });

    // This listener is fired whenever a notification is received while the app is foregrounded.
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification.
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Works when app is foregrounded, backgrounded or killed.
      Model.posts().id(response.notification.request.trigger.payload.body.postID).embed().then(result => {
        navigate(Strings.post, { item: result });
      });
    });

    // FIXME: Listener for when app is opened from web browser.
    Linking.addEventListener("url", ({ url }) => {
      const slug = url?.split("/")?.pop();
      if (slug?.length > 0) {
        Model.posts().slug(slug).embed().then(result => {
          navigate(Strings.post, { item: result });
        });
      }
    });

    return () => {
      themeListener.remove();
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [theme]);

  return fontsLoaded && (
    <NavigationContainer theme={navigatorTheme[theme]}>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider value={{ theme, toggleTheme, deviceType }}>
        <ApplicationProvider {...eva} customMapping={mapping} theme={{ ...eva[theme], ...bread[theme] }}>
          <SafeAreaProvider>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen component={Home} name="Home" options={headerOptions} />
              <Stack.Screen component={Post} name="Post" options={detailHeaderOptions} />
              <Stack.Screen component={Section} name="Section" options={sectionOptions} />
              <Stack.Screen component={Author} name="Author" options={authorOptions} />
              <Stack.Screen component={Search} name="Search" options={searchHeaderOptions} />
            </Stack.Navigator>
          </SafeAreaProvider>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </NavigationContainer>
  );
}
