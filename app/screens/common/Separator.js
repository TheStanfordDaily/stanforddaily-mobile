import { STRINGS, CATEGORIES, HOME_SECTIONS, CATEGORY_ICONS, REFS, KEYS, ALIGNMENTS, FONTS, COLORS, MARGINS } from '../../assets/constants.js';
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default class Separator extends Component {
    render() {
        return (<View
        style={{
            borderBottomColor: COLORS.LIGHT_GRAY,
            borderBottomWidth: 1,
            margin: 10,
        }}
        />)
    }
}