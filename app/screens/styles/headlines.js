import React from 'react-native';
const {StyleSheet, Dimensions} = React;
const {width, height} = Dimensions.get('window');
import {COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES} from '../../assets/constants.js';

const iphone_x = height == 812;
const top_padding = iphone_x ? MARGINS.IPHONEX_HEADER_ADDITION : 0;

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
      alignItems: ALIGNMENTS.CENTER,
      paddingTop: top_padding
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
    },
    categoriesHeaderContainer: {
      height: 45,
      backgroundColor:COLORS.WHITE,
      alignItems:ALIGNMENTS.CENTER,
      justifyContent:ALIGNMENTS.CENTER
    },
    categoriesText: {
      fontFamily:FONTS.CENTURY,
      fontSize:28
    }
})

module.exports = styles
