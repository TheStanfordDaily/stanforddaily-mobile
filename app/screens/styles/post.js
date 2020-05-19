/*
 * Styles used in the individual post view (Post.js).
 */
import { COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES, STRINGS } from '../../assets/constants.js';
export default {
  title: {
    marginTop: MARGINS.ARTICLE_SIDES,
    marginHorizontal: MARGINS.ARTICLE_SIDES,
  },
  titleText: {
    fontSize: FONT_SIZES.DEFAULT_LARGE,
    fontFamily: FONTS.PT_SERIF_BOLD,
  },
  caption: { 
    marginHorizontal: MARGINS.ARTICLE_SIDES, 
    fontFamily: FONTS.OPEN_SANS, 
    fontSize: FONT_SIZES.DEFAULT_SMALL, 
    color: COLORS.DARK_GRAY,
    lineHeight: FONT_SIZES.DEFAULT_SMALL + 4,
  },
  subtitleText: {
    fontSize: FONT_SIZES.DEFAULT_MEDIUM,
    fontFamily: FONTS.PT_SERIF,
    color: COLORS.DARK_GRAY,
  },
  authorAndDate: {
    margin: MARGINS.ARTICLE_SIDES,
  },
  articleText: {
    fontSize: FONT_SIZES.DEFAULT_SMALL_MEDIUM,
    lineHeight: 28,
  },
};