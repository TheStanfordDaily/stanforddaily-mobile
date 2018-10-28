import React, { Component } from 'react';
import { KeyboardAvoidingView, View, Text } from 'react-native';
import { Root, Tabs } from './app/config/router';
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
      'Century': require('./app/assets/fonts/century/century.ttf'),
      'PT Serif': require('./app/assets/fonts/PT_Serif/PT_Serif-Web-Regular.ttf'),
      'PT Serif Bold': require('./app/assets/fonts/PT_Serif/PT_Serif-Web-Bold.ttf')
    }).then(() => this.setState({loaded: true}));
  }
  render() {
    if (!this.state.loaded) {
      return <View><Text>Loading...</Text></View>;
    }
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior='padding'>
        <Root />
      </KeyboardAvoidingView>
    );
  }
}

export default App;
