const React = require('react-native')
const {StyleSheet, Dimensions} = React

import {COLORS, FONTS, FONT_SIZES, ALIGNMENTS, MARGINS, HEIGHTS} from '../../assets/constants.js';

const top_margin = MARGINS.NORMAL_HEADER_MARGINS
const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flexDirection: ALIGNMENTS.ROW,
      justifyContent: ALIGNMENTS.SPACE_BETWEEN,
      alignItems: ALIGNMENTS.CENTER,
      height: HEIGHTS.APP_HEADER,
      backgroundColor: COLORS.WHITE,
      borderBottomColor: COLORS.LIGHT_GRAY,
      borderBottomWidth: 1
    },
    leftButton: {
      width: 56,
      paddingLeft: 16,
      paddingRight: 16,
      //marginTop: top_margin
    },
    title: {
      width: width >= 375 ? 243 : 200,
      height: 26,
      //marginTop: top_margin
    },
    wordsTitle: {
      color: COLORS.BLACK,
      fontFamily: FONTS.OPEN_SANS_BOLD,
      fontSize: FONT_SIZES.DEFAULT_SMALL_MEDIUM,
      textAlign: ALIGNMENTS.CENTER
    },
    rightButton: {
      width: 56,
      paddingRight: 16,
      paddingLeft: 16,
      //marginTop: top_margin,
    },
    profileImage: {
      tintColor: COLORS.WHITE,
      width: 20,
      height: 23
    }
})

module.exports = styles
