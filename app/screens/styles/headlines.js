import React from 'react-native';
const {StyleSheet, Dimensions} = React;
const {width, height} = Dimensions.get('window');
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
    sideMenuContainer: {
      flex: 1,
      backgroundColor: COLORS.SIDE_BAR_GRAY,
      alignItems: ALIGNMENTS.CENTER
    },
    sideBarTitle: {
      height: HEIGHTS.APP_HEADER,
      width: '100%',
      justifyContent: ALIGNMENTS.CENTER,
      alignItems: ALIGNMENTS.CENTER,
      borderBottomWidth: 2,
      borderBottomColor: COLORS.LIGHT_GRAY
    },
    sideBarTitleText: {
      color: COLORS.DARK_GRAY,
      fontFamily: FONTS.CENTURY,
      fontSize: FONT_SIZES.DEFAULT_MEDIUM
    },
    flatListStyle: {
      flex: 1,
      width: '100%',
    },
    sideMenuItem: {
      width: '100%',
      height: HEIGHTS.SIDE_MENU_ITEM,
      justifyContent: ALIGNMENTS.CENTER,
      alignItems: ALIGNMENTS.CENTER,
      borderBottomColor: COLORS.LIGHT_GRAY,
      borderBottomWidth: 1
    }
})

module.exports = styles
