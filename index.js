import React, { Component } from 'react';
import { KeyboardAvoidingView, View, ActivityIndicator, SafeAreaView } from 'react-native';
import { RootContainer, Tabs } from './app/config/router';
import {COLORS} from './app/assets/constants';
import { Font } from 'expo';
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
            <RootContainer />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </React.Fragment>
    );
  }
}

export default App;
