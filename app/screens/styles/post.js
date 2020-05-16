/*
 * Styles used in the individual post view (Post.js).
 */
import { COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES, STRINGS } from '../../assets/constants.js';
export default {
  title: {
    marginTop: MARGINS.ARTICLE_SIDES,
    marginLeft: MARGINS.ARTICLE_SIDES,
    marginRight: MARGINS.ARTICLE_SIDES,
  },
  titleText: {
    fontSize: FONT_SIZES.DEFAULT_LARGE,
    fontFamily: FONTS.PT_SERIF_BOLD,
  },
  authorAndDate: {
    margin: MARGINS.ARTICLE_SIDES,
  },
  articleContainer: {
    marginHorizontal: MARGINS.ARTICLE_SIDES
  },
  articleText: {
    fontSize: FONT_SIZES.DEFAULT_SMALL_MEDIUM,
    lineHeight: 26,
  },
  body: {
    fontFamily: FONTS.PT_SERIF,
    fontSize: FONT_SIZES.DEFAULT_MEDIUM_SMALL,
  }
};