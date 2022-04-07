import * as React from "react";
import { View, Text } from "react-native";
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from "./navigation";
import * as Font from 'expo-font';

export default class App extends React.Component {
  // const isLoadingComplete = useLoadedAssets();
  // const colorScheme = useColorScheme();

  // if (!isLoadingComplete) {
  //   return null;
  // } else {

    state = {
      fontsLoaded: false,
    };

    async loadFonts() {
      await Font.loadAsync({
        // Load a font `MinionPro` from a static resource
        MinionProDisp: require('./assets/fonts/Minion_Pro/MinionPro-Disp.ttf'),
        MinionProRegular: require('./assets/fonts/Minion_Pro/MinionPro-Regular.ttf'),
        MinionProItDisp: require('./assets/fonts/Minion_Pro/MinionPro-ItDisp.ttf'),
        MinionProBoldDisp: require('./assets/fonts/Minion_Pro/MinionPro-BoldDisp.ttf'),
        MinionProBoldItDisp: require('./assets/fonts/Minion_Pro/MinionPro-BoldItDisp.ttf'),
        MinionProMediumDisp: require('./assets/fonts/Minion_Pro/MinionPro-MediumDisp.ttf'),
        MinionProMediumItDisp: require('./assets/fonts/Minion_Pro/MinionPro-MediumItDisp.ttf'),
        MinionProSemiboldDisp: require('./assets/fonts/Minion_Pro/MinionPro-SemiboldDisp.ttf'),
        MinionProSemiboldItDisp: require('./assets/fonts/Minion_Pro/MinionPro-SemiboldItDisp.ttf'),
        LibreFranklinRegular: require('./assets/fonts/Libre_Franklin/LibreFranklin-Regular.ttf'),
        LibreFranklinBold: require('./assets/fonts/Libre_Franklin/LibreFranklin-Bold.ttf'),
        LibreFranklinItalic: require('./assets/fonts/Libre_Franklin/LibreFranklin-Italic.ttf'),
        LibreFranklinSemiBold: require('./assets/fonts/Libre_Franklin/LibreFranklin-SemiBold.ttf')
      });
      this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
      this.loadFonts()
    }
    render() {
      return (<SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>)
}
  // }
}
