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
  Platform,
  Appearance
} from 'react-native';
import moment from 'moment';
import "moment-timezone";
import _ from "lodash";
import Separator from './Separator';
import { Strings, Fonts, Margins, Alignments, FontSizes } from '../constants';
import { getThumbnailURL, formatDate, formatAuthors, normalize } from '../helpers/format';

const { width, height } = Dimensions.get('window');

export default class Column extends Component {

    toPost() {
        this.props.onPress();
      }
    
      toAuthor() {
        this.props.onAuthorPress(authorID);
      }

    render() {
        const { item, navigation, slideIndex } = this.props;
        // console.log(slideIndex)
        // console.log(item)
        return (
                <FlatList
                    style={{overflow: 'visible'}}
                    data={item}
                    renderItem={({ item, index }) => (
                        <TouchableWithoutFeedback onPress={() => navigation.navigate(Strings.post, { item: item })}>
                            <View style={slideIndex < 0 ? {...styles.homeContent, ...{width: width}} : {...styles.homeContent, ...{}}}>
                                <View style={{flexDirection: 'row', width: width}}>
                                    {!item._embedded["wp:featuredmedia"][0].code && (
                                        <View style={{paddingHorizontal: Margins.articleSides, marginBottom: Margins.default, paddingRight: Margins.default, justifyContent: 'center'}}>
                                            <Image resizeMode={'cover'} source={{ uri: item._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail.source_url }} style={{width: width/3, height: 3/4 * width/3}} borderRadius={8} />
                                        </View>)
                                    }
                                    <View style={{flexShrink: 1}}>
                                        <View style={{flex: 1, width: 0.5*width, flexDirection: 'column', justifyContent: 'center'}}>
                                            <View>
                                              <Text style={styles.titleFont} adjustsFontSizeToFit minimumFontScale={0.75} allowFontScaling numberOfLines={4}>{item.title.rendered.replace("&#8216;", "\u2018").replace("&#8217;", "\u2019").replace("&amp;", "&").replace("&#038;", "&")}</Text>
                                              <Text style={styles.author}>{item._embedded.author[0].name + "\n" + new Date(item.date).toLocaleString('en-us', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}</Text>
                                                {/* <Text adjustsFontSizeToFit numberOfLines={3} minimumFontScale={0.75} allowFontScaling style={item.postCategory.includes(55796) ? {...styles.titleContainer, ...{ color: 'black' }} : slideIndex > 0 ? {...styles.titleContainer, ...{width: 0.55*width}} : styles.titleContainer}>{item.postTitle}</Text> */}
                                                {/* <Text style={{ fontSize: 60*(1/2)^item.postTitle.split(' ').length }}>{item.postTitle.length}</Text> */}
                                                {/* <Text style={styles.author}> {item.tsdAuthors.map(t => <TouchableWithoutFeedback onPress = {() => navigation.navigate(Strings.author, { authorID: t.id })}><Text>{t.displayName.toUpperCase()}</Text></TouchableWithoutFeedback>).reduce((prev, curr, ind) => [prev, ind === item.tsdAuthors.length - 1 ? ' and ' : ', ', curr])} • {formatDate(item)} </Text> */}
                                            </View>
                                            {index != 2 && (
                                                <Separator />
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    scrollEnabled={false}
                />
          );

    }
}

const styles = StyleSheet.create({
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    item: {
        backgroundColor: 'red',
        margin: 3,
        width: 100
    },
      content: {
        // backgroundColor: THEME.BACKGROUND,
        width: '100%',
        paddingTop: 16,
        flexDirection: 'column'
      },
      homeContent: {
        // backgroundColor: THEME.BACKGROUND,
        width: 0.92*width,
        // paddingVertical: 12,
        marginLeft: 0,
        marginRight: 0,
        flexDirection: 'column'
      },
      dateAndAuthor: {
        flexDirection: Alignments.row,
        justifyContent: Alignments.spaceBetween,
        marginTop: Margins.default,
        marginHorizontal: Margins.articleSides,
      },
  
      author: {
        fontSize: 10,
        fontWeight: "500",
        color: "#4D4F53"
        // color: THEME.SECONDARY_LABEL,
      },
      humorAuthor: {
        fontFamily: "MinionProDisp",
        fontSize: 10,
        marginLeft: -2,
        // color: COLORS.NEAR_WHITE,
      },
      date: {
        fontSize: FontSizes.small,
        fontWeight: "500"
        // color: COLORS.DARK_GRAY,
      },
  
      header: {
          fontFamily: "MinionProDisp",
          fontSize: FontSizes.large + 10,
      },
  
      titleFont: {
        fontFamily: "MinionProRegular",
        fontSize: normalize(FontSizes.mediumSmall),
        // color: THEME.LABEL
      },
      titleContainer: {
        marginTop: Margins.defaultSmall,
        // marginHorizontal: Margins.ARTICLE_SIDES,
        width: 0.5*width,
        marginLeft: 0,
        marginRight: 0,
        fontFamily: "MinionProDisp",
        fontSize: normalize(16),
        // flexWrap: 1,
        flexShrink: 1,
        marginLeft: 0,
        // color: THEME.LABEL
      },
      humorContainer: {
        marginTop: Margins.defaultSmall,
        marginHorizontal: Margins.articleSides,
        fontFamily: "MinionProDisp",
        fontSize: FontSizes.large,
        // flexWrap: 1,
        flexShrink: 1,
        marginLeft: 0,
        // color: COLORS.NEAR_WHITE
      },
      descriptionContainer: {
        opacity: 0.80,
        marginHorizontal: Margins.articleSides
      },
      descriptionFont: {
        fontSize: FontSizes.mediumSmall
      },
  
      image: {
        width: width - (2 * Margins.articleSides),
        height: width/2,
        marginHorizontal: Margins.articleSides,
        marginBottom: Margins.default
      },
  
      imageContainer: {
  
      },
      searchContainer: {
        // borderBottomColor: COLORS.LIGHT_GRAY,
        borderBottomWidth: 1,
        // backgroundColor: COLORS.NEAR_WHITE,
        width: '100%',
        flexDirection: Alignments.row,
        maxHeight: 122
      },
      searchContent: {
        flexDirection: Alignments.column,
        width: width - 120,
        marginLeft: Margins.default,
        marginRight: Margins.default,
      },
      searchImage: {
        width: 120,
        height: 120,
      },
      searchDateAndAuthor: {
        flexDirection: Alignments.row,
        justifyContent: Alignments.spaceBetween,
        marginTop: 2,
      },
      searchTitle: {
        fontFamily: "MinionProDisp",
        fontSize: 14,
        marginTop: 2,
      },
      searchDescription: {
        fontFamily: "MinionProDisp",
        fontSize: 12,
        marginTop: 2,
        opacity: 0.80,
      }
})