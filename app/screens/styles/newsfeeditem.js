import React from 'react-native';
const {StyleSheet, Dimensions} = React;
const {width, height} = Dimensions.get('window');
import {COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES} from '../../assets/constants.js';

const styles = StyleSheet.create({
    content: {
        borderTopColor: COLORS.LIGHT_GRAY,
        borderTopWidth: 1,
        backgroundColor: COLORS.NEAR_WHITE,
        width: '100%',
        // flex: 1
    },

    dateAndAuthor: {
      flexDirection: ALIGNMENTS.ROW,
      justifyContent: ALIGNMENTS.SPACE_BETWEEN,
      marginTop: 2,
      marginLeft: MARGINS.ARTICLE_SIDES,
      marginRight: MARGINS.ARTICLE_SIDES,
    },

    author: {
      fontFamily: FONTS.PT_SERIF,
      fontSize: FONT_SIZES.DEFAULT_SMALL
    },

    date: {
      fontFamily: FONTS.PT_SERIF,
      fontSize: FONT_SIZES.DEFAULT_SMALL,
      opacity: 0.60
    },

    title: {
      fontFamily: FONTS.PT_SERIF,
      fontSize: FONT_SIZES.DEFAULT_LARGE,
      lineHeight: HEIGHTS.TITLE_LINE_HEIGHT,
      marginTop: MARGINS.DEFAULT_MARGIN,
      marginLeft: MARGINS.ARTICLE_SIDES,
      marginRight: MARGINS.ARTICLE_SIDES,
    },

    description: {
      fontFamily: FONTS.PT_SERIF,
      fontSize: FONT_SIZES.DEFAULT_MEDIUM_SMALL,
      lineHeight: HEIGHTS.DESC_LINE_HEIGHT,
      marginTop: MARGINS.DEFAULT_MARGIN,
      marginBottom: MARGINS.ARTICLE_SIDES,
      opacity: 0.80,
      marginLeft: MARGINS.ARTICLE_SIDES,
      marginRight: MARGINS.ARTICLE_SIDES,
    },

    image: {
      width: width,
      height: width/2,
      marginBottom: MARGINS.DEFAULT_MARGIN
    },

    imageContainer: {
      borderTopColor: COLORS.LIGHT_GRAY,
      borderTopWidth: 2,
    }
})

module.exports = styles
