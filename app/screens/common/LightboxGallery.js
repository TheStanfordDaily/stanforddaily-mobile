import React, { Component, useState } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
  PixelRatio,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import stylesSlider from '../styles/Cartoon.style'
import Lightbox from 'react-native-lightbox-v2';
const { width, height } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const slideHeight = height * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = width;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 10,
    },
    closeButton: {
      color: 'white',
      borderWidth: 1,
      borderColor: 'white',
      padding: 8,
      borderRadius: 3,
      textAlign: 'center',
      margin: 10,
      alignSelf: 'flex-end',
    },
    customHeaderBox: {
      height: 150,
      backgroundColor: '#6C7A89',
      justifyContent: 'center',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      marginLeft: -10,
      marginRight: -10,
    },
    col: {
      flex: 1
    },
    square: {
      width: width / 2,
      height: width / 2,
      justifyContent: 'center',
      alignSelf: 'center',
    },
    squareFirst: {
      backgroundColor: '#C0392B',
    },
    squareSecond: {
      backgroundColor: '#019875',
    },
    squareText: {
      textAlign: 'center',
      color: 'white',
    },
    carousel: {
      height: width - 20,
      width: width - 20,
      backgroundColor: 'white',
    },
    contain: {
      flex: 1,
      height: 150,
    },
    text: {
      marginVertical: 10 * 2,
    },
  });


export default class LightboxGallery extends React.Component {

    toAuthor() {
        this.props.onAuthorPress(authorID);
      }
      
    
    render() {
        const { title, authors, imageResource, date, navigation } = this.props
        return (
            <View>
                    <Lightbox style={styles.col}>
                    {/* <View style={[styles.square, styles.squareFirst]}><Text style={styles.squareText}>I'm a square</Text></View> */}
                          <Image
        style={styles.contain}
        resizeMode="contain"
        source={{ uri: imageResource }}
      />
                    </Lightbox>
    <View style={{...stylesSlider.textContainer, ...{width: itemWidth}}}>
          <Text>{title}</Text>
          <Text style={stylesSlider.subtitle}>
            {authors.map(t => <TouchableWithoutFeedback onPress = {()=>{this.props.navigation.navigate('Author', { authorID: t.id})}}><Text>{t.displayName.toUpperCase()}</Text></TouchableWithoutFeedback>).reduce((prev, curr, ind) => [prev, ind === groupLength - 1 ? ' and ' : ', ', curr])} on {date}
          </Text>
      </View>
      </View>
        )
    }
}