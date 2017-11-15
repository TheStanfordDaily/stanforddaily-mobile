const React = require('react-native')
const {StyleSheet, Dimensions} = React
const constants = {
  actionColor: '#24CE84'
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between"
  },
  writeAReply: {
    width: "100%",
    backgroundColor: "white",
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  textInputWrapper: {
    flex:1,
    borderWidth: 1,
    borderColor: '#A5A5A5',
    borderRadius: 7,
    marginLeft: 14,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  textInput: {
    color: '#4e4e4e',
    height: 28,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    flex: 1,
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
  },
  inactiveAnon: {
    height: 20,
    width: 17,
    tintColor: '#A5A5A5',
    marginRight: 6,
    marginBottom: 6
  },
  activeAnon: {
    height: 20,
    width: 17,
    tintColor: '#94171C',
    marginRight: 6,
    marginBottom: 6
  },
  post: {
    height: 30,
    width: 30,
    tintColor: '#94171C',
    marginRight: 8,
    marginBottom: 11,
    marginLeft: 4
  },
  listview: {
    flex: 1,
  },
})

module.exports = styles
module.exports.constants = constants;
