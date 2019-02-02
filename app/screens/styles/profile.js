const React = require('react-native')
const {StyleSheet, Dimensions} = React
import {HEIGHTS, Images, MARGINS, COLORS, ALIGNMENTS, FONTS} from '../../assets/constants.js';

const {width, height} = Dimensions.get('window');
//width = width <= height ? width : height;
const iphone_x = height == HEIGHTS.IPHONE_X;
const addedTopMargin = iphone_x ? MARGINS.IPHONEX_HEADER_ADDITION : 0;

const styles= StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.WHITE,
      flexDirection: ALIGNMENTS.COLUMN
    },
    scrollView: {
      alignItems: ALIGNMENTS.CENTER
    },
    listview: {
      width,
    },
    back: {
      width: 60,
      marginLeft: 14,
    },
    signout: {
      width: 60,
      marginTop: 8,
      color: COLORS.WHITE,
      marginRight: 14,
      top: 0,
    },
    closeWrapper: {
      height: 0.46667 * width/2,
      backgroundColor: COLORS.CARDINAL,
      flexDirection: ALIGNMENTS.ROW,
      justifyContent: ALIGNMENTS.SPACE_BETWEEN,
      zIndex: 0,
      width: '100%'
    },
    statusBarBackground: {
      height: 20 + addedTopMargin,
      backgroundColor: COLORS.CARDINAL,
    },
    profileImage: {
      width: 0.46667 * width,
      height: 0.46667 * width,
      borderRadius: (0.46667 * width)/2,
      borderWidth: 2,
      top: 8,
      borderColor: COLORS.WHITE,
      justifyContent: ALIGNMENTS.FLEX_END
    },
    imageMargin: {
      backgroundColor: COLORS.WHITE,
      zIndex: 0,
      height: (0.46667 * width)/2,
    },
    displayName: {
      fontFamily: FONTS.HNEUE,
      fontSize: 20,
      color: COLORS.DARK_GRAY,
      fontWeight: '500',
      marginTop: 16,
      marginBottom: 8
    },
    editPhoto: {
      height: '18%',
      width: '100%',
      backgroundColor: COLORS.WHITE,
      opacity: 0.75,
      justifyContent: ALIGNMENTS.CENTER,
      alignItems: ALIGNMENTS.CENTER,
      flexDirection: ALIGNMENTS.ROW
    },
    edit: {
      height: 14,
      width: 14,
    },
    postContainer: {
      borderTopColor: COLORS.LIGHT_GRAY,
      borderTopWidth: 1
    }
})
module.exports = styles
