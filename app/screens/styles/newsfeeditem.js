import React from 'react-native';
const {StyleSheet, Dimensions} = React;
const {width, height} = Dimensions.get('window');
//width = width <= height ? width : height;
import {COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES, STRINGS} from '../../assets/constants.js';

const styles = ({
    content: {
      backgroundColor: COLORS.NEAR_WHITE,
      width: '100%',
      paddingVertical: 16,
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
      color: COLORS.DARK_GRAY,
    },

    date: {
      fontFamily: FONTS.OPEN_SANS,
      fontSize: FONT_SIZES.DEFAULT_SMALL,
      color: COLORS.DARK_GRAY,
    },

    titleFont: {
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: FONT_SIZES.DEFAULT_LARGE,
    },
    titleContainer: {
      marginTop: MARGINS.DEFAULT_SMALL_MARGIN,
      marginHorizontal: MARGINS.ARTICLE_SIDES
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
      height: width/2,
      marginHorizontal: MARGINS.ARTICLE_SIDES,
      marginBottom: MARGINS.DEFAULT_MARGIN
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
