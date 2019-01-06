/*
 * Styles used in the individual post view (Post.js).
 */
import { COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS, FONT_SIZES, STRINGS } from '../../assets/constants.js';
export default {
  title: {
    marginTop: MARGINS.DEFAULT_MARGIN,
    marginLeft: MARGINS.ARTICLE_SIDES,
    marginRight: MARGINS.ARTICLE_SIDES,
  },
  titleText: {
    fontSize: FONT_SIZES.DEFAULT_LARGE,
    fontFamily: FONTS.CENTURY
  },

  body: {
    fontFamily: FONTS.PT_SERIF,
    fontSize: FONT_SIZES.DEFAULT_MEDIUM_SMALL,
    //   marginTop: MARGINS.DEFAULT_MARGIN,
    //   marginBottom: MARGINS.ARTICLE_SIDES,
    //   opacity: 0.80,
    //   marginLeft: MARGINS.ARTICLE_SIDES,
    //   marginRight: MARGINS.ARTICLE_SIDES,
  }
};