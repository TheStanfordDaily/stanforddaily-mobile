const React = require('react-native')
const {StyleSheet, Dimensions} = React
const constants = {
  actionColor: '#24CE84'
};

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  authorImage: {
    height:35.6,
    width: 35.6,
    borderRadius: 17.8,
    marginRight: 9.4
  },
  listview: {
    flex: 1,
  },
  li: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 18,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    width: Dimensions.get('window').width,
    marginTop: 10
  },
  detailed: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 18,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    width: Dimensions.get('window').width,
  },
  post: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  content: {
    flexDirection: 'column',
    marginBottom: 4,
    marginRight: 8
  },
  author: {
    flexDirection: 'row'
  },
  postInfo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 3,
    paddingBottom: 4
  },
  writeAReply: {
    flexDirection: 'row',
    marginTop: 10.5,
  },
  authorName: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Helvetica Neue',
  },
  timeStamp: {
    color: '#A5A5A5',
    fontSize: 9,
    fontFamily: 'Helvetica Neue',
  },
  message: {
    marginLeft: 1,
    marginRight: 8,
    width: Dimensions.get('window').width-19-57,
  },
  messageText: {
    color: '#000',
    fontSize: 14,
    marginTop: 2,
    fontFamily: 'Helvetica Neue',
    fontWeight: '200'
  },
  reply: {
    borderTopColor: '#C8C8C8',
    borderTopWidth: 1,
    marginTop: 4,
    paddingLeft: 6,
    marginRight: 10,
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  replyPlaceHolder: {
    color: '#A5A5A5',
    fontSize: 14,
    fontFamily: 'Helvetica Neue',
    marginTop: 1,
    marginLeft: 6.5
  },
  repliesCounter: {
    borderLeftWidth: 1,
    borderLeftColor: '#A5A5A5',
    marginTop: 6.5,
    paddingBottom: 6.5
  },
  count: {
    color: '#A5A5A5',
    fontSize: 14,
    fontFamily: 'Helvetica Neue',
    marginTop: 5,
    marginLeft: 20
  },
  upDown: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 10,
    height: 68
  },
  votesCount: {
    color: '#8B1316',
    fontSize: 14,
    fontFamily: 'Helvetica Neue',
    marginRight: 2
  },
  newPost: {
    height: 67,
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingLeft: 18,
    alignItems: 'center',
    marginTop: 20
  },
  userImage: {
    height:42,
    width: 42,
    borderRadius: 21,
    marginRight: 13
  },
  placeHolder: {
    color: '#A5A5A5',
    fontSize: 14,
    fontFamily: 'Helvetica Neue',
  },
  profileReplies: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6.5
  },
  deletePost: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6.5,
    borderLeftColor: "#A5A5A5",
    borderLeftWidth: 1
  },
  profileOptionsText: {
    marginLeft: 8,
    color: "#A5A5A5"
  }
})

module.exports = styles
module.exports.constants = constants;
