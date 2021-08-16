import React, { Component } from 'react'
import { DynamicColorIOS, Platform, PlatformColor, StyleSheet } from 'react-native'

export default Platform.select({
    ios: {
      label: PlatformColor('label'),
      background: PlatformColor('systemBackground'),
    },
    android: {
      label: PlatformColor('?android:attr/textColor'),
      background: PlatformColor('?attr/background'),
    },
    default: { label: 'black' }
  })