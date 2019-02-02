const React = require('react-native')
const {StyleSheet, Dimensions} = React
const {height, width} = Dimensions.get('window');
//width = width <= height ? width : height;

import {COLORS, FONTS, ALIGNMENTS, MARGINS, HEIGHTS} from '../../assets/constants.js';

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: ALIGNMENTS.SPACE_BETWEEN
  },
  writeAReply: {
    width: "100%",
    backgroundColor: COLORS.WHITE,
    flexDirection: ALIGNMENTS.ROW,
    alignItems: ALIGNMENTS.FLEX_END
  },
  textInputWrapper: {
    flex:1,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: 7,
    marginLeft: 14,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: ALIGNMENTS.ROW,
    alignItems: ALIGNMENTS.FLEX_END
  },
  textInput: {
    color: COLORS.DARK_GRAY,
    height: 28,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    flex: 1,
    fontFamily: FONTS.HNEUE,
    fontSize: 14,
  },
  inactiveAnon: {
    height: 20,
    width: 17,
    tintColor: COLORS.LIGHT_GRAY,
    marginRight: 6,
    marginBottom: 6
  },
  activeAnon: {
    height: 20,
    width: 17,
    tintColor: COLORS.CARDINAL,
    marginRight: 6,
    marginBottom: 6
  },
  post: {
    height: 30,
    width: 30,
    tintColor: COLORS.CARDINAL,
    marginRight: 8,
    marginBottom: 11,
    marginLeft: 4
  },
  listview: {
    flex: 1,
  },
})

module.exports = styles
