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
    }
})

module.exports = styles
