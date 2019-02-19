import React, { Component } from 'react';
import { Alert, KeyboardAvoidingView, View, ActivityIndicator, SafeAreaView } from 'react-native';
import { Root, Tabs } from './app/config/router';
import { COLORS } from './app/assets/constants';
import { Font, Updates } from 'expo';
import { AppState } from "react-native";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      appState: ""
    }
  }
  componentDidMount() {
    Font.loadAsync({
      'Century': require('./app/assets/fonts/PT_Serif/PT_Serif-Web-Regular.ttf'),
      'Helvetica': require('./app/assets/fonts/PT_Serif/PT_Serif-Web-Regular.ttf'),
      'Helvetica-Bold': require('./app/assets/fonts/PT_Serif/PT_Serif-Web-Bold.ttf'),
      'Hoefler Text': require('./app/assets/fonts/PT_Serif/PT_Serif-Web-Regular.ttf'),
      'PT Serif': require('./app/assets/fonts/PT_Serif/PT_Serif-Web-Regular.ttf'),
      'PT Serif Bold': require('./app/assets/fonts/PT_Serif/PT_Serif-Web-Bold.ttf')
    }).then(() => this.setState({ loaded: true }));
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async (nextAppState) => {
    console.log(this.state.appState, nextAppState);
    if (__DEV__ !== true && this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // console.log('App has come to the foreground!')
      // Updates.reload();
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        Alert.alert(
          'Updates Available',
          'Would you like to install the latest updates?',
          [
            { text: 'Later', onPress: () => console.log('updates install skipped') },
            { text: 'Yes', onPress: () => Updates.reloadFromCache() },
          ],
          { cancelable: false }
        );
      }
    }
    this.setState({ appState: nextAppState });
  }
  render() {
    if (!this.state.loaded) {
      return <View><ActivityIndicator /></View>;
    }
    return (
      <React.Fragment>
        {/* https://stackoverflow.com/a/52458846/2603230 */}
        <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.CARDINAL }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior='padding'>
            <Root />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </React.Fragment>
    );
  }
}

export default App;
