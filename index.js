import React, { Component } from 'react';
import { KeyboardAvoidingView, View, ActivityIndicator, SafeAreaView } from 'react-native';
import { RootContainer, Tabs } from './app/config/router';
import { STRINGS, COLORS } from './app/assets/constants';
import * as WebBrowser from 'expo-web-browser';
import * as Font from 'expo-font';
import NavigationService from './app/helper/NavigationService';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
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
  }
  componentDidUpdate() {
    if (this.props.notificationData) {
      if (this.props.notificationData.post_id) {
        NavigationService.navigate(STRINGS.POST, { postID: this.props.notificationData.post_id });
      }
      if (this.props.notificationData.url) {
        WebBrowser.openBrowserAsync(this.props.notificationData.url);
      }
    }
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
            <RootContainer ref={navigatorRef => {
              // https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html
              NavigationService.setTopLevelNavigator(navigatorRef);
            }} />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </React.Fragment>
    );
  }
}

export default App;
