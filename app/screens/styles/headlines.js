import React from 'react-native';
const {StyleSheet, Dimensions} = React;
const {width, height} = Dimensions.get('window');
import {COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES} from '../../assets/constants.js';

const top_padding = 0;

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
      justifyContent: ALIGNMENTS.CENTER,
      borderBottomWidth: 2,
      alignSelf: 'stretch',
      flexDirection: 'column',
      paddingTop: HEIGHTS.APP_HEADER_TOP,
      borderBottomColor: COLORS.LIGHT_GRAY
    },
    sideBarTitleText: {
      color: COLORS.DARK_GRAY,
      fontFamily: FONTS.CENTURY,
      textAlign: 'center',
      flex: 1,
      justifyContent: 'center',
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
      borderBottomColor: COLORS.LIGHT_GRAY,
      borderBottomWidth: 1,
    },
    categoriesHeaderContainer: {
      height: 60,
      backgroundColor:COLORS.WHITE,
      alignItems:ALIGNMENTS.LEFT,
      justifyContent:ALIGNMENTS.LEFT,
    },
    categoriesText: {
      marginTop: MARGINS.DEFAULT_MARGIN,
      marginLeft: MARGINS.ARTICLE_SIDES, //match category side with article edge
      fontFamily:FONTS.CENTURY,
      fontSize:28,
      flex: 2,
    }
})

module.exports = styles
