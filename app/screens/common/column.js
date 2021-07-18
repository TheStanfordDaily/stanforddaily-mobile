import React, { Component, useState } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
  PixelRatio,
  Appearance
} from 'react-native';
import moment from 'moment';
import "moment-timezone";
import _ from "lodash";
import styles from '../styles/column-style';
import Separator from './Separator';
import { STRINGS, CATEGORIES, HOME_SECTIONS, CATEGORY_ICONS, KEYS, FONTS, COLORS, LIGHT_COLORS, DARK_COLORS, MARGINS } from '../../assets/constants';

const { width, height } = Dimensions.get('window');
const THEME = Appearance.getColorScheme() === 'light' ? LIGHT_COLORS : DARK_COLORS
// export const formatDate = post => moment.utc(post.postDateGmt).tz("America/Los_Angeles").toDate().toLocaleDateString();
export const formatDate = post => moment.utc(post.postDateGmt).format('MMM D, YYYY').toUpperCase();
export const getThumbnailURL = ({thumbnailInfo}) => thumbnailInfo ? (thumbnailInfo.urls.mediumLarge || thumbnailInfo.urls.full): null;
export const formatAuthors = ({tsdAuthors}) => (tsdAuthors || []).map(e => e.displayName).join(", ");

export default class Column extends Component {

    toPost() {
        this.props.onPress();
      }
    
      toAuthor() {
        this.props.onAuthorPress(authorID);
      }

    render() {
        const { item, navigation, slideIndex } = this.props;
        console.log(slideIndex)
        return (
                <FlatList
                    style={{overflow: 'visible'}}
                    data={item}
                    renderItem={({ item, index }) => (
                        <TouchableWithoutFeedback onPress={() => navigation.navigate(STRINGS.POST, { postID: item.id })}>
                            <View style={slideIndex < 0 ? {...styles.homeContent, ...{width: width, backgroundColor: item.postCategory.includes(55796) ? THEME.SECONDARY_ACCENT : THEME.BACKGROUND}} : {...styles.homeContent, ...{backgroundColor: item.postCategory.includes(55796) ? THEME.SECONDARY_ACCENT : THEME.BACKGROUND}}}>
                                <View style={{flexDirection: 'row', width: width}}>
                                    {getThumbnailURL(item) && (
                                        <View style={{paddingHorizontal: MARGINS.ARTICLE_SIDES, marginBottom: MARGINS.DEFAULT_MARGIN, paddingRight: MARGINS.DEFAULT_MARGIN, justifyContent: 'center'}}>
                                            <Image resizeMode={'cover'} source={{ uri: getThumbnailURL(item) }} style={{width: width/3, height: 3/4 * width/3}} borderRadius={8} />
                                        </View>)
                                    }
                                    <View style={{flexShrink: 1}}>
                                        <View style={{flex: 1, width: 0.5*width, flexDirection: 'column', justifyContent: 'space-between'}}>
                                            <View>
                                                <Text adjustsFontSizeToFit numberOfLines={3} minimumFontScale={0.75} allowFontScaling style={item.postCategory.includes(55796) ? {...styles.titleContainer, ...{ color: 'black' }} : slideIndex > 0 ? {...styles.titleContainer, ...{width: 0.55*width}} : styles.titleContainer}>{item.postTitle}</Text>
                                                {/* <Text style={{ fontSize: 60*(1/2)^item.postTitle.split(' ').length }}>{item.postTitle.length}</Text> */}
                                                <Text style={styles.author}> {formatAuthors(item).toUpperCase()} • {formatDate(item)} </Text>
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