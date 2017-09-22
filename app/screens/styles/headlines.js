const React = require('react-native')
const {StyleSheet, Dimensions} = React
const {width, height} = Dimensions.get('window');

const styles= StyleSheet.create({
    container: {
        flex: 1,
        width,
        height,
    },
    loadingIndicator: {
      marginTop: 8,
      marginBottom: 8
    },
    sideMenuContainer: {
      flex: 1,
      backgroundColor: '#F7F7F7',
      alignItems:'center'
    },
    sideBarTitle: {
      height: 64,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: "#A5A5A5"
    },
    sideBarTitleText: {
      color: "#4E4E4E",
      fontFamily: 'Century',
      fontSize: 24
    },
    flatListStyle: {
      flex: 1,
      width: '100%',
    },
    sideMenuItem: {
      width: '100%',
      height: 45,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomColor: '#A5A5A5',
      borderBottomWidth: 1
    }
})

module.exports = styles
