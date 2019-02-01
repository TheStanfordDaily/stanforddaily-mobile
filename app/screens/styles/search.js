import React from 'react-native';
const {StyleSheet, Dimensions} = React;
const {width, height} = Dimensions.get('window');
//width = width <= height ? width : height;
import {COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES} from '../../assets/constants.js';

const styles= StyleSheet.create({
    container: {
        flex: 1,
        width,
        height,
    },
    loadingIndicator: {
      marginTop: MARGINS.DEFAULT_MARGIN,
      marginBottom: MARGINS.DEFAULT_MARGIN
    },
    header: {
      flexDirection: ALIGNMENTS.ROW,
      width: '100%',
      justifyContent: ALIGNMENTS.SPACE_BETWEEN,
      alignItems: ALIGNMENTS.CENTER,
      height: HEIGHTS.APP_HEADER,
      backgroundColor: COLORS.CARDINAL,
      paddingTop: 12
    },
    textInput: {
      fontFamily: FONTS.HNEUE,
      fontSize: 14,
      width: '90%',
      height: 26,
      color: COLORS.BLACK,
      borderRadius: 6,
      paddingLeft: MARGINS.DEFAULT_MARGIN,
      paddingRight: MARGINS.DEFAULT_MARGIN
    },
    textInputWrapper: {
      flexDirection: ALIGNMENTS.ROW,
      justifyContent: ALIGNMENTS.CENTER,
      alignItems: ALIGNMENTS.CENTER,
      width: '70%',
      height: 28,
      borderWidth: 1,
      borderRadius: 6,
    },
    close: {
      width: 40,
      height: 20,
      marginRight: 3
    },
    list: {
      width: width
    }
})

module.exports = styles
