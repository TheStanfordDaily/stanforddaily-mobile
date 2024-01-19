import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";

export function useLoadedAssets() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          // Load fonts here
          "PT Serif": require("../assets/fonts/PT_Serif/PT_Serif-Web-Regular.ttf"),
          "PT Serif Bold": require("../assets/fonts/PT_Serif/PT_Serif-Web-Bold.ttf"),
          "PT Serif Italic": require("../assets/fonts/PT_Serif/PT_Serif-Web-Italic.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
