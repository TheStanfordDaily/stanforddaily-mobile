import React from 'react-native';
import { Appearance } from 'react-native';
const {StyleSheet, Dimensions, Platform, PixelRatio} = React;
const {width, height} = Dimensions.get('window');
//width = width <= height ? width : height;
import {COLORS, LIGHT_COLORS, DARK_COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES, STRINGS} from '../../assets/constants.js';

const scale = width/320
const THEME = Appearance.getColorScheme() === 'light' ? LIGHT_COLORS : DARK_COLORS

export function normalize(size) {
  const newSize = size * scale 
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

const styles = ({
    content: {
      backgroundColor: THEME.BACKGROUND,
      width: '100%',
      paddingTop: 12,
    },
    homeContent: {
      backgroundColor: "rgb(0,0,0,0)",
      width: width,
      paddingTop: 12,
      marginLeft: 0,
      marginRight: 0
    },
    dateAndAuthor: {
      flexDirection: ALIGNMENTS.ROW,
      justifyContent: ALIGNMENTS.SPACE_BETWEEN,
      marginTop: MARGINS.DEFAULT_MARGIN,
      marginHorizontal: MARGINS.ARTICLE_SIDES,
    },

    author: {
      fontFamily: FONTS.OPEN_SANS,
      fontSize: FONT_SIZES.DEFAULT_SMALL,
      marginLeft: -2,
      color: THEME.SECONDARY_LABEL,
      textTransform: 'uppercase'
    },

    date: {
      fontFamily: FONTS.OPEN_SANS,
      fontSize: FONT_SIZES.DEFAULT_SMALL,
      color: THEME.SECONDARY_LABEL,
      textTransform: 'uppercase'
    },

    titleFont: {
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: FONT_SIZES.DEFAULT_LARGE,
      color: THEME.LABEL
    },
    titleContainer: {
      marginTop: MARGINS.DEFAULT_SMALL_MARGIN,
      marginHorizontal: MARGINS.ARTICLE_SIDES,
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: normalize(FONT_SIZES.DEFAULT_LARGE),
      color: THEME.LABEL
    },

    homeTitleContainer: {
      marginTop: MARGINS.DEFAULT_SMALL_MARGIN,
      marginLeft: MARGINS.ARTICLE_SIDES,
      width: width - (2 * MARGINS.ARTICLE_SIDES) - 2*MARGINS.DEFAULT_LARGE_MARGIN,
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: normalize(FONT_SIZES.DEFAULT_LARGE),
      color: THEME.LABEL,
    },
    elongatedHomeTitleContainter: {
      marginTop: MARGINS.DEFAULT_SMALL_MARGIN,
      marginLeft: MARGINS.ARTICLE_SIDES,
      width: width - (2 * MARGINS.ARTICLE_SIDES) - MARGINS.DEFAULT_LARGE_MARGIN,
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: normalize(FONT_SIZES.DEFAULT_LARGE),
      color: THEME.LABEL,
    },
    descriptionContainer: {
      opacity: 0.80,
      marginHorizontal: MARGINS.ARTICLE_SIDES
    },
    descriptionFont: {
      fontSize: FONT_SIZES.DEFAULT_MEDIUM_SMALL
    },

    image: {
      width: width - (2 * MARGINS.ARTICLE_SIDES),
      height: width/2.125,
      marginHorizontal: MARGINS.ARTICLE_SIDES,
      marginBottom: MARGINS.DEFAULT_MARGIN
    },

    homeImage: {
      width: width - (2 * MARGINS.ARTICLE_SIDES) - MARGINS.DEFAULT_LARGE_MARGIN,
      height: width/2.125,
      marginLeft: MARGINS.ARTICLE_SIDES,
      marginRight: 0,
      marginBottom: MARGINS.DEFAULT_MARGIN
    },

    elongatedHomeImage: {
      width: width - (2 * MARGINS.ARTICLE_SIDES) - MARGINS.DEFAULT_LARGE_MARGIN,
      height: width/2.125,
      marginLeft: MARGINS.ARTICLE_SIDES,
      marginRight: MARGINS.ARTICLE_SIDES,
      marginBottom: MARGINS.DEFAULT_MARGIN
    },

    endHomeImage: {

    },

    imageContainer: {

    },
    searchContainer: {
      borderBottomColor: COLORS.LIGHT_GRAY,
      borderBottomWidth: 1,
      backgroundColor: COLORS.NEAR_WHITE,
      width: '100%',
      flexDirection: ALIGNMENTS.ROW,
      maxHeight: 122
    },
    searchContent: {
      flexDirection: ALIGNMENTS.COLUMN,
      width: width - 120,
      marginLeft: MARGINS.DEFAULT_MARGIN,
      marginRight: MARGINS.DEFAULT_MARGIN,
    },
    searchImage: {
      width: 120,
      height: 120,
    },
    searchDateAndAuthor: {
      flexDirection: ALIGNMENTS.ROW,
      justifyContent: ALIGNMENTS.SPACE_BETWEEN,
      marginTop: 2,
    },
    searchTitle: {
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: 14,
      marginTop: 2,
    },
    searchDescription: {
      fontFamily: FONTS.PT_SERIF,
      fontSize: 12,
      marginTop: 2,
      opacity: 0.80,
    },
})

module.exports = styles
