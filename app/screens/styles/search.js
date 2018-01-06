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
    },
    header: {
      flexDirection: ALIGNMENTS.ROW,
      width: width,
      justifyContent: ALIGNMENTS.SPACE_AROUND,
      alignItems: ALIGNMENTS.CENTER,
      height: iphone_x ? MARGINS.IPHONEX_HEADER_ADDITION+HEIGHTS.APP_HEADER : HEIGHTS.APP_HEADER,
      backgroundColor: COLORS.CARDINAL,
      paddingTop: iphone_x ? 25 : 12
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
      width: 19,
      height: 19,
      marginRight: 3,
      tintColor: COLORS.WHITE,
    },
})

module.exports = styles
