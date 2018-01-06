const React = require('react-native')
const {StyleSheet, Dimensions} = React

import {COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS} from '../../assets/constants.js';

const iphone_x = Dimensions.get('window').height == 812;
const top_margin = iphone_x ? MARGINS.IPHONEX_HEADER_ADDITION+MARGINS.NORMAL_HEADER_MARGINS : MARGINS.NORMAL_HEADER_MARGINS

const styles = StyleSheet.create({
    container: {
        flexDirection: ALIGNMENTS.ROW,
        justifyContent: ALIGNMENTS.SPACE_AROUND,
        alignItems: ALIGNMENTS.CENTER,
        height: iphone_x ? MARGINS.IPHONEX_HEADER_ADDITION+HEIGHTS.APP_HEADER : HEIGHTS.APP_HEADER,
        backgroundColor: COLORS.CARDINAL,
    },
    leftButton: {
      width:40,
      paddingLeft: 10,
      marginTop: top_margin
    },
    title: {
      width: 243,
      height: 30,
      marginTop: top_margin
    },
    wordsTitle: {
      color: COLORS.WHITE,
      fontFamily:FONTS.HNEUE,
      fontSize:20,
      textAlign:ALIGNMENTS.CENTER
    },
    rightButton: {
      width: 40,
      // alignSelf: ALIGNMENTS.CENTER,
      paddingLeft: 5,
      marginTop: top_margin,
    },
    profileImage: {
      tintColor: COLORS.WHITE,
      width: 20,
      height: 23
    }
})

module.exports = styles
