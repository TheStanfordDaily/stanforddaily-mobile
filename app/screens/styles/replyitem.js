const React = require('react-native')
const {StyleSheet, Dimensions} = React
import {COLORS, ALIGNMENTS, MARGINS, FONTS} from '../../assets/constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    flexDirection: ALIGNMENTS.ROW,
    paddingLeft: 18,
    paddingRight: 14,
    paddingTop: 6,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
    width: Dimensions.get('window').width,
  },
  authorImage: {
    height:35.6,
    width: 35.6,
    borderRadius: 17.8,
    marginRight: 9.4
  },
  post: {
    flexDirection: ALIGNMENTS.COLUMN,
    flex: 1
  },
  postInfo: {
    flexDirection: ALIGNMENTS.ROW,
    alignItems: ALIGNMENTS.CENTER
  },
  authorName: {
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: FONTS.HNEUE,
    marginRight: 4
  },
  timeStamp: {
    color: COLORS.LIGHT_GRAY,
    fontSize: 9,
    fontFamily: FONTS.HNEUE,
  },
  messageText: {
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: FONTS.HNEUE,
    fontWeight: '200'
  },
  viewMoreStyle: {
    width:70,
    height:15,
    marginTop:2
  }
})

module.exports = styles
