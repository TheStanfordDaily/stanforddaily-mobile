/*
 * Styles used in the individual post view (Post.js).
 */
import { COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES, STRINGS } from '../../assets/constants.js';
export default {
  title: {
    marginTop: MARGINS.ARTICLE_SIDES,
    marginHorizontal: MARGINS.ARTICLE_SIDES,
  },
  subtitle: {
    margin: MARGINS.ARTICLE_SIDES,
  },
  titleText: {
    fontSize: FONT_SIZES.DEFAULT_LARGE,
    fontFamily: FONTS.PT_SERIF_BOLD,
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