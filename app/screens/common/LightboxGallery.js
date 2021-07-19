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
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import stylesSlider from '../styles/Cartoon.style'
import Lightbox from 'react-native-lightbox-v2';
import Carousel from 'react-native-snap-carousel';
const { width, height } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const slideHeight = height * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const entryBorderRadius = 8;

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
      // justifyContent: 'flex-start'
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
      height: 2*sliderWidth/3,
      borderTopLeftRadius: entryBorderRadius,
      borderTopRightRadius: entryBorderRadius
    },
    text: {
      marginVertical: 10 * 2,
    },
  });



const LightboxGallery = (props) => {

  const [aspectRatio, setAspectRatio] = useState(4/3)

    const toAuthor = () => {
        this.props.onAuthorPress(authorID);
      }

      const renderCarousel = (item, index) => (

        //         <Image
        //       style={{ flex: 1, width: width, height: width }}
        //       resizeMode="contain"
        //       source={{ uri: item }}
        
        
        // />
        <Image style={{width: width, aspectRatio: aspectRatio}} source={{ uri: imageResource }} /> //uriGroup[0]
        
      //  <Text>{uriGroup}</Text> 
        
          )

      const { title, authors, imageResource, date, navigation, uriGroup } = props

        return (
            <View style={{justifyContent: 'flex-end', // this needs to work so that all the cartoons have the same bottom y-coordinate...
            alignItems: 'center', shadowColor: 'black', shadowOpacity: 0.75, shadowRadius: 5, shadowOffset: {
              width: 0,
              height: 10
            }}}>
                    <Lightbox style={styles.col} renderContent={renderCarousel} >

                          <Image
        style={{...styles.contain, ...{aspectRatio: aspectRatio}}}
        resizeMode="contain"
        source={{ uri: imageResource }}
        onLayout={(e) => {Image.getSize(imageResource, (width, height) => {setAspectRatio(width/height)})}}
      />
                          <View style={{...stylesSlider.textContainer, ...{width: 2*sliderWidth*aspectRatio/3}}}>
    <Text style={stylesSlider.title}>{title}</Text>
    <Text style={stylesSlider.subtitle}>
      {authors.map(t => <TouchableWithoutFeedback onPress = {()=>{navigation.navigate('Author', { authorID: t.id})}}><Text>{t.displayName.toUpperCase()}</Text></TouchableWithoutFeedback>).reduce((prev, curr, ind) => [prev, ind === groupLength - 1 ? ' and ' : ', ', curr])} on {date}
    </Text>
    </View>
                    </Lightbox>


      </View>
        )
    
}

export default LightboxGallery