const React = require('react-native')
const {StyleSheet, Dimensions} = React
import {HEIGHTS, Images, COLORS, ALIGNMENTS, FONTS} from '../../assets/constants.js';
const {height, width} = Dimensions.get('window');
//width = width <= height ? width : height;

var styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.NEAR_WHITE,
    flex: 1,
  },
  authorImage: {
    height:35.6,
    width: 35.6,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: 17.8,
    marginRight: 9.4
  },
  listview: {
    flex: 1,
  },
  li: {
    backgroundColor: COLORS.WHITE,
    flexDirection: ALIGNMENTS.COLUMN,
    justifyContent: ALIGNMENTS.SPACE_BETWEEN,
    paddingLeft: 18,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    width: width,
    marginTop: 10
  },
  detailed: {
    backgroundColor: COLORS.WHITE,
    flexDirection: ALIGNMENTS.COLUMN,
    justifyContent: ALIGNMENTS.SPACE_BETWEEN,
    paddingLeft: 18,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    width: width,
  },
  post: {
    flexDirection: ALIGNMENTS.ROW,
    justifyContent: ALIGNMENTS.SPACE_BETWEEN
  },
  content: {
    flexDirection: ALIGNMENTS.COLUMN,
    marginBottom: 4,
    marginRight: 8
  },
  author: {
    flexDirection: ALIGNMENTS.ROW
  },
  postInfo: {
    flexDirection: ALIGNMENTS.COLUMN,
    justifyContent: ALIGNMENTS.SPACE_BETWEEN,
    paddingTop: 3,
    paddingBottom: 4
  },
  writeAReply: {
    flexDirection: ALIGNMENTS.ROW,
    marginTop: 10.5,
  },
  authorName: {
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: FONTS.HNEUE,
  },
  timeStamp: {
    color: COLORS.LIGHT_GRAY,
    fontSize: 9,
    fontFamily: FONTS.HNEUE,
  },
  message: {
    marginLeft: 1,
    marginRight: 8,
    width: width-19-57,
  },
  messageText: {
    color: COLORS.BLACK,
    fontSize: 14,
    marginTop: 2,
    fontFamily: FONTS.HNEUE,
    fontWeight: '200'
  },
  reply: {
    borderTopColor: COLORS.LIGHT_GRAY,
    borderTopWidth: 1,
    marginTop: 4,
    paddingLeft: 6,
    marginRight: 10,
    paddingRight: 5,
    flexDirection: ALIGNMENTS.ROW,
    justifyContent: ALIGNMENTS.SPACE_BETWEEN
  },
  replyPlaceHolder: {
    color: COLORS.LIGHT_GRAY,
    fontSize: 14,
    fontFamily: FONTS.HNEUE,
    marginTop: 1,
    marginLeft: 6.5
  },
  repliesCounter: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.LIGHT_GRAY,
    marginTop: 6.5,
    paddingBottom: 6.5
  },
  countInList: {
    color: COLORS.LIGHT_GRAY,
    fontSize: 14,
    fontFamily: FONTS.HNEUE,
    marginTop: 5,
    marginLeft: 20
  },
  countInProfile: {
    color: COLORS.LIGHT_GRAY,
    fontSize: 14,
    fontFamily: FONTS.HNEUE,
    marginLeft: 8
  },
  upDown: {
    flexDirection: ALIGNMENTS.COLUMN,
    justifyContent: ALIGNMENTS.SPACE_BETWEEN,
    alignItems: ALIGNMENTS.CENTER,
    marginTop: 3,
    marginBottom: 10,
    height: 68
  },
  votesCount: {
    color: COLORS.CARDINAL,
    fontSize: 14,
    fontFamily: FONTS.HNEUE,
    marginRight: 2
  },
  profileReplies: {
    flex: 1,
    flexDirection: ALIGNMENTS.ROW,
    justifyContent: ALIGNMENTS.CENTER,
    alignItems: ALIGNMENTS.CENTER,
    marginTop: 6.5
  },
  deletePost: {
    flex: 1,
    flexDirection: ALIGNMENTS.ROW,
    justifyContent: ALIGNMENTS.CENTER,
    alignItems: ALIGNMENTS.CENTER,
    marginTop: 6.5,
    borderLeftColor: COLORS.LIGHT_GRAY,
    borderLeftWidth: 1
  },
  profileOptionsText: {
    marginLeft: 8,
    color: COLORS.LIGHT_GRAY
  },
  replyIcon: {
    width: 19.5,
    height:17.3
  },
  deleteIcon: {
    width: 17,
    height:22,
    marginTop: 3.5,
    marginBottom: 3,
    tintColor: COLORS.LIGHT_GRAY
  }
})

module.exports = styles
