import React from 'react-native';
import { Appearance } from 'react-native';
const {StyleSheet, Dimensions} = React;
const {width, height} = Dimensions.get('window');
import {COLORS, LIGHT_COLORS, DARK_COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES} from '../../assets/constants.js';
const THEME = Appearance.getColorScheme() === 'light' ? LIGHT_COLORS : DARK_COLORS
const top_padding = 0;

const styles = StyleSheet.create({
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
      backgroundColor: COLORS.WHITE,
      alignItems: ALIGNMENTS.CENTER,
      paddingTop: top_padding
    },
    sideBarTitle: {
      height: HEIGHTS.APP_HEADER,
      justifyContent: ALIGNMENTS.CENTER,
      borderBottomWidth: 1,
      alignSelf: 'stretch',
      flexDirection: 'column',
      paddingTop: MARGINS.NORMAL_HEADER_MARGINS,
      borderBottomColor: THEME.SECONDARY_LABEL,
    },
    sideBarTitleText: {
      color: THEME.LABEL,
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: FONT_SIZES.DEFAULT_SMALL_MEDIUM,
      //textAlign: 'center',
      flex: 1,
      justifyContent: 'center',
      marginLeft: MARGINS.DEFAULT_MARGIN
    },
    flatListStyle: {
      flex: 1,
      width: '100%',
      marginTop: 10
    },
    sideMenuItem: {
      width: '100%',
      flexDirection: ALIGNMENTS.ROW,
      height: HEIGHTS.SIDE_MENU_ITEM,
      alignItems:  ALIGNMENTS.CENTER,
    },
    separator: {
      borderBottomColor: THEME.SECONDARY_LABEL,
      borderBottomWidth: 1,
    },
    categoriesHeaderContainer: {
      height: 60,
      backgroundColor: THEME.BACKGROUND,
      alignItems: ALIGNMENTS.LEFT,
      justifyContent: ALIGNMENTS.LEFT,
    },
    categoriesText: {
      marginTop: MARGINS.DEFAULT_MARGIN,
      marginLeft: MARGINS.ARTICLE_SIDES, //match category side with article edge
      fontFamily:FONTS.CENTURY,
      fontSize:25,
      flex: 2,
    },
    categoryLabel: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // width: width - (2 * MARGINS.DEFAULT_MARGIN)
    },
    header: {
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: FONT_SIZES.DEFAULT_LARGE + 10,
      color: THEME.LABEL
    },
    humor: {
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: FONT_SIZES.DEFAULT_LARGE + 10,
      color: THEME.BACKGROUND
    },
    titleFont: {
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: FONT_SIZES.DEFAULT_MEDIUM_SMALL,
    },
    titleContainer: {
      marginTop: MARGINS.DEFAULT_SMALL_MARGIN,
      marginHorizontal: MARGINS.ARTICLE_SIDES,
      backgroundColor: THEME.BACKGROUND
    },
    more: {
      backgroundColor: THEME.BUTTON,
      marginTop: MARGINS.DEFAULT_SMALL_MARGIN,
      marginHorizontal: MARGINS.ARTICLE_SIDES,
      justifyContent: 'center',
      borderRadius: 10
    },
    seeAll: {
      paddingHorizontal: 15,
      fontFamily: FONTS.PT_SERIF_BOLD,
      color: THEME.LABEL,
    },
    communityContainer: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingTop: 0,
      width: '100%',
    },
    box: {
      width: '95%',
      height: height/8,
      backgroundColor: COLORS.CARDINAL,
      margin: MARGINS.DEFAULT_SMALL_MARGIN,
      justifyContent: 'center',
      flexDirection: 'row',
      alignContent: 'center'
    },
    communityTitleText: {
      fontSize: FONT_SIZES.DEFAULT_EXTRA_LARGE,
      fontFamily: FONTS.PT_SERIF_BOLD,
      color: COLORS.WHITE,
      textAlign: 'center',
    }
})

module.exports = styles
