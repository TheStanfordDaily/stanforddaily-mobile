const React = require('react-native')
const {StyleSheet, Dimensions} = React

import {COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS} from '../../assets/constants.js';
const {height, width} = Dimensions.get('window');
//width = width <= height ? width : height;


var styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    alignItems: 'center',
  },
  listview: {
    flex: 1,
    width: width,
  },
  newPost: {
    height: 67,
    backgroundColor: COLORS.WHITE,
    flexDirection: ALIGNMENTS.ROW,
    paddingLeft: 18,
    alignItems: ALIGNMENTS.CENTER,
    marginTop: 20
  },
  userImage: {
    height:42,
    width: 42,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: 21,
    marginRight: 13
  },
  placeHolder: {
    color: COLORS.LIGHT_GRAY,
    fontSize: 14,
    fontFamily: FONTS.HNEUE,
  },
  failedLoginContainer: {
    flex: 1,
    justifyContent: ALIGNMENTS.CENTER,
    alignItems: ALIGNMENTS.CENTER
  },
  failedLoginText: {
    fontFamily:FONTS.HNEUE,
    fontSize:16,
    color:COLORS.DARK_GRAY
  },
})

module.exports = styles
