const React = require('react-native')
const {StyleSheet, Dimensions} = React
const {width, height} = Dimensions.get('window');

import {COLORS, ALIGNMENTS, MARGINS, FONTS} from '../../assets/constants';

const iphone_x = height == 812;
const top_padding = iphone_x ? MARGINS.IPHONEX_HEADER_ADDITION : 0;

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.CARDINAL,
    alignItems: ALIGNMENTS.CENTER,
    // justifyContent: 'center',
  },
  close: {
    width: 17,
    height: 17,
    tintColor: COLORS.WHITE,
    marginTop: 20 + top_padding,
    marginRight: iphone_x ? 16 : 14,
    alignSelf: ALIGNMENTS.FLEX_END,
    top: 0,
  },
  closeWrapper: {
    width: '100%',
  },
  cardWrapper: {
    justifyContent: ALIGNMENTS.CENTER,
    flex: 1
  },
  card: {
    width: 300,
    backgroundColor: COLORS.WHITE,
    borderRadius: 13,
    alignItems: ALIGNMENTS.CENTER
  },
  logo: {
    width: 42,
    height: 37.8,
    tintColor: COLORS.CARDINAL,
    marginTop: 24,
    marginRight: 20
  },
  textWrapper: {
    width: '100%',
    justifyContent: ALIGNMENTS.FLEX_START,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 15
  },
  label: {
    fontFamily: FONTS.HNEUE,
    fontSize: 14,
    color: COLORS.DARK_GRAY,
    marginBottom: 4
  },
  textInput: {
    fontFamily: FONTS.HNEUE,
    fontSize: 14,
    color: COLORS.DARK_GRAY,
    marginBottom: 4,
    width: '100%',
    height: 28,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: 7,
    paddingLeft: MARGINS.DEFAULT_MARGIN,
    paddingRight: MARGINS.DEFAULT_MARGIN
  },
  signInButton: {
    backgroundColor: COLORS.CARDINAL,
    borderRadius: MARGINS.DEFAULT_MARGIN,
    width: '94%',
    height: 38,
    marginTop: 13,
  },
  signUpButton: {
    backgroundColor: COLORS.CARDINAL,
    borderRadius:MARGINS.DEFAULT_MARGIN,
    width: '94%',
    height: 38,
    marginTop: 7
  },
  buttonText:{
    color: COLORS.WHITE,
    textAlign:ALIGNMENTS.CENTER,
    marginTop: 11,
    fontFamily: FONTS.HNEUE,
    fontSize: 14,
  },
})
module.exports = styles
