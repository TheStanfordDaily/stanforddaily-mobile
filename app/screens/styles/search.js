import React, {Appearance} from 'react-native';
import darkColors from 'react-native-elements/dist/config/colorsDark';
const {StyleSheet, Dimensions} = React;
const {width, height} = Dimensions.get('window');
//width = width <= height ? width : height;
import {COLORS, LIGHT_COLORS, DARK_COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES} from '../../assets/constants.js';

const THEME = Appearance.getColorScheme() === 'light' ? LIGHT_COLORS : DARK_COLORS
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
    header: {
      flexDirection: ALIGNMENTS.ROW,
      width: '100%',
      justifyContent: ALIGNMENTS.SPACE_BETWEEN,
      alignItems: ALIGNMENTS.CENTER,
      height: HEIGHTS.APP_HEADER,
      backgroundColor: COLORS.CARDINAL,
      paddingTop: 12
    },
    close: {
      width: 40,
      height: 20,
      marginRight: 3
    },
    list: {
      width: width
    },
    titleFont: {
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: FONT_SIZES.DEFAULT_LARGE,
    },
    titleContainer: {
      marginTop: MARGINS.DEFAULT_SMALL_MARGIN,
      marginHorizontal: MARGINS.ARTICLE_SIDES,
      fontFamily: FONTS.PT_SERIF_BOLD,
      fontSize: FONT_SIZES.DEFAULT_LARGE,
      color: THEME.LABEL
    },
})

module.exports = styles
