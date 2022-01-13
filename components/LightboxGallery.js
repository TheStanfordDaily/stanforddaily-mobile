import React, { Component, useState } from 'react';
import { View, Text, Image, Dimensions, TouchableWithoutFeedback, StyleSheet, Platform } from 'react-native';
import Lightbox from 'react-native-lightbox';
import { Margins, Fonts, FontSizes } from '../constants';
const { width, height } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const entryBorderRadius = 8;
const IS_IOS = Platform.OS === 'ios';

export const sliderWidth = width;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const LightboxGallery = (props) => {

    const [aspectRatio, setAspectRatio] = useState(4/3)
  
    const toAuthor = () => {
        this.props.onAuthorPress(authorID);
    }
  
    const _renderCarousel = (item, index) => (<Image style={{width: width, aspectRatio: aspectRatio}} source={{ uri: imageResource }} />)
  
    const { title, authors, imageResource, date, navigation } = props
  
    return (
      <View style={{justifyContent: 'flex-end', // this needs to work so that all the cartoons have the same bottom y-coordinate...
      alignItems: 'center', shadowColor: 'black', shadowOpacity: 0.75, shadowRadius: 5, shadowOffset: {width: 0,height: 10}}}>
        <Lightbox style={styles.col} renderContent={_renderCarousel}>
          <View>
            <Image
            style={{...styles.contain, ...{aspectRatio: aspectRatio}}}
            resizeMode="contain"
            source={{ uri: imageResource }}
            onLayout={(e) => {Image.getSize(imageResource, (width, height) => {setAspectRatio(width/height)})}}
            />
            <View style={{...stylesSlider.textContainer, ...{width: 2*sliderWidth*aspectRatio/3}}}>
              <Text style={stylesSlider.title}>{title}</Text>
              <Text style={stylesSlider.subtitle}>
              {/* {authors.map(t => <TouchableWithoutFeedback onPress = {()=>{navigation.navigate('Author', { authorID: t.id})}}><Text>{t.displayName.toUpperCase()}</Text></TouchableWithoutFeedback>).reduce((prev, curr, ind) => [prev, ind === groupLength - 1 ? ' and ' : ', ', curr])} on {date} */}
              </Text>
            </View>
          </View>
        </Lightbox>
      </View>
    )
      
  }

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

  const stylesSlider = StyleSheet.create({
    slideInnerContainer: {
        width: width - Margins.articleSides, // itemWidth
        height: height,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18, // needed for shadow,
        flex: 1
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    imageContainerEven: {
        backgroundColor: 'black'
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'contain',
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    radiusMaskEven: {
        backgroundColor: 'black'
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 20 - entryBorderRadius,
        // width: sliderWidth,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius,
    },
    textContainerEven: {
        backgroundColor: 'black'
    },
    title: {
        color: 'black',
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        fontFamily: Platform.OS === "ios" ? "Georgia" : "serif"
    },
    subtitle: {
        marginTop: 6,
        // color: COLORS.SECONDARY_LABEL,
        fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
        fontSize: FontSizes.small,
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    }
});

  export default LightboxGallery;