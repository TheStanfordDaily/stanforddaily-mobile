import React from 'react-native';
import { Appearance } from 'react-native';
const {StyleSheet, Dimensions} = React;
const {width, height} = Dimensions.get('window');
//width = width <= height ? width : height;
import {COLORS, LIGHT_COLORS, DARK_COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES, STRINGS} from '../../assets/constants.js';
const THEME = Appearance.getColorScheme() === 'light' ? LIGHT_COLORS : DARK_COLORS

const styles = ({
    content: {
      width: width/2,
      paddingVertical: 2,
      backgroundColor: "rgb(0,0,0,0)",
      marginLeft: 0,
      marginRight: 0
    },
    categoryLabel: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // width: width - (2 * MARGINS.DEFAULT_MARGIN)
    },
    dateAndAuthor: {
      flexDirection: ALIGNMENTS.COLUMN,
      justifyContent: ALIGNMENTS.SPACE_BETWEEN,
      marginTop: MARGINS.DEFAULT_MARGIN,
      marginHorizontal: MARGINS.ARTICLE_SIDES,
    },

    author: {
      fontFamily: FONTS.OPEN_SANS,
      fontSize: 10,
      marginLeft: -2,
      color: THEME.SECONDARY_LABEL,
    },

    date: {
      fontFamily: FONTS.OPEN_SANS,
      fontSize: 10,
      color: THEME.SECONDARY_LABEL,
    },

    header: {
        fontFamily: FONTS.PT_SERIF_BOLD,
        fontSize: FONT_SIZES.DEFAULT_LARGE + 10,
        color: THEME.LABEL
    },

    titleFont: {
      fontFamily: FONTS.PT_SERIF,
      fontSize: FONT_SIZES.DEFAULT_MEDIUM_SMALL,
      color: THEME.LABEL
    },
    titleContainer: {
      marginTop: MARGINS.DEFAULT_SMALL_MARGIN,
      marginLeft: MARGINS.ARTICLE_SIDES,
      width: width/2 - MARGINS.ARTICLE_SIDES - MARGINS.DEFAULT_LARGE_MARGIN
    },

    descriptionContainer: {
      opacity: 0.80,
      marginHorizontal: MARGINS.ARTICLE_SIDES
    },
    descriptionFont: {
      fontSize: FONT_SIZES.DEFAULT_MEDIUM_SMALL
    },

    image: {
      marginBottom: MARGINS.DEFAULT_MARGIN,
      width: (width - (2 * MARGINS.ARTICLE_SIDES) - MARGINS.DEFAULT_LARGE_MARGIN)/2,
      marginLeft: MARGINS.ARTICLE_SIDES,
      marginRight: 0,
      height: 3/4 * width/2.2
    },

    imageContainer: {

    },
    searchContainer: {
      borderBottomColor: COLORS.SECONDARY_LABEL,
      borderBottomWidth: 1,
      backgroundColor: THEME.BACKGROUND,
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
      color: THEME.LABEL
    }
})

module.exports = styles
