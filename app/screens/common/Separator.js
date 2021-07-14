import { COLORS } from '../../assets/constants.js';
import React, { Component } from 'react';
import {
  View
} from 'react-native';

export default class Separator extends Component {
    render() {
        return (<View
        style={{
            borderBottomColor: COLORS.SEPARATOR,
            borderBottomWidth: 1,
            margin: 10,
        }}
        />)
    }
}