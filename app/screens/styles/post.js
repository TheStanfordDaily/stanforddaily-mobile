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
    fontSize: FONT_SIZES.DEFAULT_EXTRA_LARGE,
    fontFamily: FONTS.PT_SERIF_BOLD,
  },
  caption: { 
    marginHorizontal: MARGINS.ARTICLE_SIDES, 
    marginTop: MARGINS.DEFAULT_SMALL_MARGIN,
    marginBottom: MARGINS.DEFAULT_LARGE_MARGIN,
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
    marginHorizontal: MARGINS.ARTICLE_SIDES,
    marginBottom: MARGINS.DEFAULT_LARGE_MARGIN,
  },
  date: { 
    marginTop: MARGINS.DEFAULT_SMALL_MARGIN, 
    fontFamily: FONTS.OPEN_SANS, 
    color: COLORS.DARK_GRAY, 
    fontSize: FONT_SIZES.DEFAULT_SMALL 
  },
  articleText: {
    fontSize: FONT_SIZES.DEFAULT_SMALL_MEDIUM,
    lineHeight: 26,
  },
};