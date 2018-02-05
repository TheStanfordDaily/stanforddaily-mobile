const React = require("react-native")
const {StyleSheet, Dimensions} = React
import {COLORS, ALIGNMENTS, FONTS, HEIGHTS} from "../../assets/constants.js";

const iphone_x = Dimensions.get("window").height == HEIGHTS.IPHONE_X;
const top_margin = iphone_x ? 20 : 0;

const styles= StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.WHITE,
      flexDirection: ALIGNMENTS.COLUMN
    },
    header: {
      flexDirection: ALIGNMENTS.ROW,
      marginRight: 18,
      marginLeft: 18,
      marginTop: 16 + top_margin,
      justifyContent: ALIGNMENTS.SPACE_BETWEEN,
      alignItems: ALIGNMENTS.CENTER
    },
    userImage: {
      width: 35,
      height: 35,
      borderRadius: 17.5,
    },
    title: {
      color: COLORS.CARDINAL,
      fontSize: 20,
      fontFamily: FONTS.HNEUE,
      paddingRight: 10,
    },
    close: {
      width: 17,
      height: 17,
    },
    textInput: {
      flex: 1,
      marginRight: 18,
      marginLeft: 18,
      marginTop: 14,
      fontFamily: FONTS.HNEUE,
      fontSize: 20,
      fontWeight: '200',
    },
    actionView: {
      height: 50,
      borderTopColor: "#BBBBBB",
      borderTopWidth: 1,
      flexDirection: ALIGNMENTS.ROW,
      paddingLeft: 10,
      paddingRight: 10,
      justifyContent: ALIGNMENTS.FLEX_END,
      alignItems: ALIGNMENTS.CENTER
    },
    inactiveAnon: {
      height: 20,
      width: 17,
      tintColor: COLORS.LIGHT_GRAY,
      marginRight: 6
    },
    activeAnon: {
      height: 20,
      width: 17,
      tintColor: COLORS.CARDINAL,
      marginRight: 6
    },
    anonView: {
      flexDirection: ALIGNMENTS.ROW,
      alignItems: ALIGNMENTS.CENTER,
    },
    activeAnonLabel: {
      color: COLORS.CARDINAL
    },
    inactiveAnonLabel: {
      color: COLORS.LIGHT_GRAY
    },
    postButton: {
      backgroundColor:COLORS.CARDINAL,
      borderRadius:8,
      width: 58,
      height: 28
    },
    postText:{
      color:COLORS.WHITE,
      textAlign:ALIGNMENTS.CENTER,
      marginTop: 6,
      fontFamily: FONTS.HNEUE,
      fontSize: 14,
  }
})
module.exports = styles
