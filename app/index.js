import React, { Component } from 'react';
import {KeyboardAvoidingView } from 'react-native';
import { Root, Tabs } from './config/router';

class App extends Component {
  render() {
    return (
    <KeyboardAvoidingView
    	style={{flex:1}}
    	behavior='padding'>
    	<Root />
    </KeyboardAvoidingView>
    );
  }
}

export default App;
