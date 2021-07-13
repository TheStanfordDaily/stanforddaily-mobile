/*
 * Styles used in the individual post view (Post.js).
 */
import { COLORS, LIGHT_COLORS, DARK_COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES, STRINGS } from '../../assets/constants.js';
import { Dimensions, Appearance } from 'react-native'
import darkColors from 'react-native-elements/dist/config/colorsDark';
const { width, height } = Dimensions.get('window'); //Dimensions of the current device screen
const THEME = Appearance.getColorScheme() === 'light' ? LIGHT_COLORS : DARK_COLORS
export default {
  scrollContainer: {
    flex: 1,
    backgroundColor: THEME.BACKGROUND
  },

  title: {
    marginTop: MARGINS.ARTICLE_SIDES,
    marginHorizontal: MARGINS.ARTICLE_SIDES,
  },
  titleText: {
    fontSize: FONT_SIZES.DEFAULT_EXTRA_LARGE,
    fontFamily: FONTS.PT_SERIF_BOLD,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 1)',
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 10
  },
  imageBackground: {
    width: width,
    height: 240,
    flex: 1,
    resizeMode: 'cover'
  },
  caption: { 
    marginHorizontal: MARGINS.ARTICLE_SIDES, 
    marginTop: MARGINS.DEFAULT_SMALL_MARGIN,
    marginBottom: 0,
    fontFamily: FONTS.OPEN_SANS, 
    fontSize: FONT_SIZES.DEFAULT_SMALL, 
    color: THEME.SECONDARY_LABEL,
    lineHeight: FONT_SIZES.DEFAULT_SMALL + 4,
  },
  subtitleText: {
    fontSize: FONT_SIZES.DEFAULT_MEDIUM,
    fontFamily: FONTS.PT_SERIF,
    color: THEME.SECONDARY_LABEL,
  },
  authorAndDate: {
    marginHorizontal: MARGINS.ARTICLE_SIDES,
    marginBottom: MARGINS.DEFAULT_LARGE_MARGIN,
    color: THEME.LABEL,
    borderRadius: 15,
    overflow: 'hidden'
  },
  date: { 
    marginTop: MARGINS.DEFAULT_SMALL_MARGIN, 
    fontFamily: FONTS.OPEN_SANS, 
    color: THEME.SECONDARY_LABEL, 
    fontSize: FONT_SIZES.DEFAULT_SMALL 
  },
  category: {
    marginTop: MARGINS.DEFAULT_SMALL_MARGIN,
    fontFamily: FONTS.PT_SERIF,
    color: 'black',
    fontSize: FONT_SIZES.DEFAULT_SMALL_MARGIN,
    backgroundColor: COLORS.LIGHT_GRAY,
    padding: 5,
  },
  articleText: {
    fontSize: FONT_SIZES.DEFAULT_SMALL_MEDIUM,
    color: THEME.LABEL,
    lineHeight: 26,
  },
  author: {
    fontFamily: FONTS.PT_SERIF_BOLD,
    color: THEME.LABEL
  }
};