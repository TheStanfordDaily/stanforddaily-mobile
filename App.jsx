import { TECH_PASSWORD } from "@env";
import * as eva from "@eva-design/eva";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ApplicationProvider, Icon, IconRegistry, Text } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as Device from "expo-device";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ref, runTransaction } from "firebase/database";
import { decode } from "html-entities";
import React, { useEffect, useRef, useState } from "react";
import { Appearance, Image, Linking, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Author, Home, Post, Search, Section } from "./components/screens";
import { useFirebase } from "./hooks/useFirebase";
import mapping from "./mapping.json";
import { logoAssets, navigate } from "./navigation";
import { DailyBread as bread } from "./theme";
import { ThemeContext } from "./theme-context";
import { enableAnimationExperimental, onShare, registerForPushNotificationsAsync } from "./utils/action";
import { Fonts, Routing } from "./utils/constants";
import { getMostCommonTagsFromRecentPosts } from "./utils/format";
import Model from "./utils/model";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

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
  const [tags, setTags] = useState([]);
  const [sessionViews, setSessionViews] = useState({});

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
  };

  const navigatorTheme = {
    light: DefaultTheme,
    dark: DarkTheme,
  };

  const headerOptions = ({ navigation }) => ({
    headerTitle: () => (
      <Image
        style={{ width: 260, height: 30 }}
        source={logoAssets[theme]}
        alt="Stanford Daily wordmark logo"
        accessibilityRole="header"
      />
    ),
    headerRight: () => (
      <TouchableOpacity style={{ paddingHorizontal: 16 }} onPress={() => navigation.navigate(Routing.search, { tags })}>
        <Icon name="search-outline" width={24} height={24} fill={theme === "dark" ? "white" : "black"} />
      </TouchableOpacity>
    ),
  });

  const detailHeaderOptions = ({ route }) => ({
    headerTitle: "",
    headerTransparent: true,
    headerTintColor: "white",
    headerBackTitleVisible: false,
    headerRight: () => (
      <TouchableOpacity
        style={{ paddingHorizontal: 16 }}
        onPress={() => onShare(route.params.article.link, decode(route.params.article.title.rendered))}
      >
        <Icon name="share-outline" width={24} height={24} fill="white" />
      </TouchableOpacity>
    ),
  });

  const sectionOptions = ({ route }) => ({
    headerTitle: () => <Text category="h4">{decode(route.params.category.name).replace("'", "\u{2019}")}</Text>,
    headerTitleStyle: { fontFamily: "MinionProBold" },
    headerTintColor: bread[theme]["color-primary-500"],
  });

  const authorOptions = ({ route }) => ({
    headerTitle: () => <Text category="h4">{route.params.name}</Text>,
    headerTitleStyle: { fontFamily: "MinionProBold" },
    headerTintColor: bread[theme]["color-primary-500"],
  });

  const searchHeaderOptions = {
    headerTintColor: bread[theme]["color-primary-500"],
  };

  const { app, database } = useFirebase(expoPushToken, TECH_PASSWORD);

  // Handles changes in the navigation state (as received from `NavigationContainer`) and logs them to a Firebase database.
  const handleNavigationChange = async (state) => {
    if (!app || !state || !state.routes) return;
    const auth = getAuth(app);

    try {
      await signInWithEmailAndPassword(auth, "tech@stanforddaily.com", TECH_PASSWORD);

      const currentRoute = state.routes[state.index];
      const currentView = currentRoute?.name;
      const currentRouteParams = currentRoute?.params;

      if (!currentView) return;

      const datetime = new Date();
      const year = datetime.getFullYear();
      const month = String(datetime.getMonth() + 1).padStart(2, "0");
      const day = String(datetime.getDate()).padStart(2, "0");

      let currentViewPath = `Analytics/${year}/${month}/${day}/${currentView}`;
      let viewIdentifier; // Used to track unique views for each screen in the sessions map.
      let routeParamIdentifier;

      // Leverage information about the current view to construct a unique identifier for use in Firebase.
      switch (currentView) {
        case Routing.post:
          routeParamIdentifier = currentRouteParams?.article?.id; // Unique to the post being presented in the detail view.
          break;
        case Routing.section:
          routeParamIdentifier = currentRouteParams?.category?.id; // Unique to the section being presented in the detail view.
          break;
        case Routing.author:
          routeParamIdentifier = currentRouteParams?.id; // Unique to the author being presented in the detail view.
          break;
        default:
          viewIdentifier = currentView;
      }

      if (routeParamIdentifier) {
        // After the switch, if there is a `routeParamIdentifier`, it appends that to the `currentViewPath` string.
        currentViewPath += `/${routeParamIdentifier}`;
        viewIdentifier = `${currentView}/${routeParamIdentifier}`;
      } else if (!viewIdentifier) {
        // Otherwise, the default case must have been triggered, so it just uses the view identifier.
        viewIdentifier = currentView;
      }

      const impressionsRef = ref(database, `${currentViewPath}/impressions`);
      runTransaction(impressionsRef, (impressions) => {
        return (impressions || 0) + 1;
      });

      if (!sessionViews[viewIdentifier]) {
        const sessionsRef = ref(database, `${currentViewPath}/sessions`);
        runTransaction(sessionsRef, (sessions) => {
          return (sessions || 0) + 1;
        });

        // Update view information for future reference.
        setSessionViews((prevSessionViews) => {
          return { ...prevSessionViews, [viewIdentifier]: true };
        });
      }
    } catch (error) {
      console.trace(error);
    }
  };

  // Triggered when the app is opened from a web browser. It extracts the slug from the URL and navigates to the corresponding post.
  const handleOpenURL = async (event) => {
    // FIXME: Listener for when app is opened from web browser.
    const slug = event?.url?.split("/")?.pop();
    if (slug?.length > 0) {
      const result = await Model.posts().embed().slug(slug).embed();
      navigate(Routing.post, { item: result });
    }
  };

  useEffect(() => {
    // Loads fonts from static resource.
    Font.loadAsync(Fonts.minion).then(() => setFontsLoaded(true));

    registerForPushNotificationsAsync().then((token) => {
      const matches = token?.match(/\[(.*?)\]/);
      if (matches) {
        const submatch = matches[1];
        setExpoPushToken(submatch);
      }
    });

    Device.getDeviceTypeAsync().then((type) => setDeviceType(type));

    getMostCommonTagsFromRecentPosts(100, 10).then((tags) => setTags(tags));

    // Handles any event in which appearance preferences change.
    const themeListener = Appearance.addChangeListener((listener) => {
      if (theme !== listener.colorScheme) {
        setTheme(listener.colorScheme);
      }
    });

    // This listener is fired whenever a notification is received while the app is foregrounded.
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification.
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      // Works when app is foregrounded, backgrounded or killed.
      Model.posts()
        .id(response.notification.request.trigger.payload.body.postID)
        .embed()
        .get()
        .then((result) => {
          navigate(Routing.post, { item: result });
        });
    });

    // Perform initial URL check in case the app was closed when the user opened a URL.
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleOpenURL({ url });
      }
    });

    Linking.addEventListener("url", handleOpenURL);

    return () => {
      themeListener.remove();
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
      Linking.removeEventListener("url", handleOpenURL);
    };
  }, [theme]);

  return (
    fontsLoaded && (
      <NavigationContainer theme={navigatorTheme[theme]} onStateChange={handleNavigationChange}>
        <IconRegistry icons={EvaIconsPack} />
        <ThemeContext.Provider value={{ theme, toggleTheme, deviceType }}>
          <ApplicationProvider {...eva} customMapping={mapping} theme={{ ...eva[theme], ...bread[theme] }}>
            <SafeAreaProvider>
              <Stack.Navigator initialRouteName={Routing.home}>
                <Stack.Screen component={Home} name={Routing.home} options={headerOptions} />
                <Stack.Screen component={Post} name={Routing.post} options={detailHeaderOptions} />
                <Stack.Screen component={Section} name={Routing.section} options={sectionOptions} />
                <Stack.Screen component={Author} name={Routing.author} options={authorOptions} />
                <Stack.Screen component={Search} name={Routing.search} options={searchHeaderOptions} />
              </Stack.Navigator>
            </SafeAreaProvider>
          </ApplicationProvider>
        </ThemeContext.Provider>
      </NavigationContainer>
    )
  );
}
