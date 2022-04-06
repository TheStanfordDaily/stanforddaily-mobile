import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import _ from "lodash";
import { formatAuthor, formatDate, getThumbnailURL, itemize, normalize } from '../helpers/format';
import { Fonts, Margins, Alignments, FontSizes } from '../constants';
import HTML from 'react-native-render-html';
import moment from 'moment'

const {width, height} = Dimensions.get('window');

export default class NewsFeedItem extends Component {

    // Handles clicking on items
    toPost() {
      this.props.onPress();
    }

    toAuthor(authorID) {
      this.props.onAuthor(authorID);
    }  

    render() {
      let thumbnailURL
      const { item, index, isFeatured } = this.props;
      // let groupLength = item.tsdAuthors.length
      let { title, author, excerpt, _embedded, date, thumbnailInfo, postSubtitle, tsdAuthors } = item;
      if (_embedded["wp:featuredmedia"][0].code) {
        console.log(_embedded["wp:featuredmedia"][0].data.status);
      } else {
        thumbnailURL = _embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url
      }
      const full = 0.92*width;


      return (
        <TouchableWithoutFeedback onPress={this.toPost.bind(this)}>
          <View style={isFeatured && index === 0 ? styles.homeContent
          : isFeatured && index === 1 ? {...styles.homeContent, ...{width: width}}
          : isFeatured && index === 2 ? {...styles.homeContent, ...{}}
          : styles.content            
            }>
              {thumbnailURL && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: thumbnailURL }} style={isFeatured && index > 0 ? {...styles.image, ...{width: full}}: isFeatured && index === 2 ? {...styles.image, ...{marginLeft:20}} : !isFeatured ? {...styles.image, ...{width: full}} : {...styles.image, ...{}}} borderRadius={8} />
              </View>) // need to find a way to switch to normal styling for lists when it's not homes screen
            }
            <Text style={styles.titleContainer} adjustsFontSizeToFit minimumFontScale={0.75} allowFontScaling numberOfLines={3}>{title.rendered.replace("&#8216;", "\u2018").replace("&#8217;", "\u2019").replace("&amp;", "&").replace("&#038;", "&")}</Text>
            <Text style={styles.date}>{moment(new Date(date)).fromNow()}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }
    
  
}

const styles = ({
    content: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        paddingTop: 12,
      },
      homeContent: {
        backgroundColor: '#FFFFFF',
        width: 0.92*width,
        paddingVertical: 12,
        marginLeft: 0,
        marginRight: 0,
      },
      dateAndAuthor: {
        flexDirection: Alignments.row,
        justifyContent: Alignments.spaceBetween,
        marginTop: Margins.default,
        marginHorizontal: Margins.articleSides,
      },
  
      author: {
        fontFamily: "system",
        fontSize: FontSizes.small,
        marginHorizontal: Margins.articleSides,
        // color: THEME.SECONDARY_LABEL,
      },
  
      date: {
        marginTop: Margins.defaultSmall,
        marginHorizontal: Margins.articleSides,
        fontSize: normalize(FontSizes.small),
        color: "#8C1515",
        textTransform: "uppercase",
        fontWeight: "500",
        // color: THEME.SECONDARY_LABEL,
      },
  
      titleFont: {
        fontFamily: "MinionProDisp",
        fontSize: FontSizes.large,
        // color: THEME.LABEL
      },
      titleContainer: {
        marginTop: Margins.defaultSmall,
        marginHorizontal: Margins.articleSides,
        fontFamily: "MinionProDisp",
        fontSize: normalize(FontSizes.large),
        // color: THEME.LABEL
      },
  
      homeTitleContainer: {
        marginTop: Margins.defaultSmall,
        marginLeft: Margins.articleSides,
        width: width - (2 * Margins.articleSides) - 2*Margins.defaultLarge,
        fontFamily: Fonts.PTSerifBold,
        fontSize: normalize(FontSizes.large),
        // color: THEME.LABEL,
      },
      elongatedHomeTitleContainter: {
        marginTop: Margins.defaultSmall,
        marginLeft: Margins.articleSides,
        width: width - (2 * Margins.articleSides) - Margins.defaultLarge,
        fontFamily: Fonts.PTSerifBold,
        fontSize: normalize(FontSizes.large),
        // color: THEME.LABEL,
      },
      descriptionContainer: {
        opacity: 0.80,
        marginHorizontal: Margins.articleSides
      },
      descriptionFont: {
        fontSize: FontSizes.mediumSmall
      },
  
      image: {
        width: 0.95*width - (2 * Margins.articleSides),
        height: width/2.125,
        marginHorizontal: Margins.articleSides,
        marginBottom: Margins.default,
      },
  
      homeImage: {
        width: width - (2 * Margins.articleSides) - Margins.defaultLarge,
        height: width/2.125,
        marginLeft: Margins.articleSides,
        marginRight: 0,
        marginBottom: Margins.default
      },
  
      elongatedHomeImage: {
        width: width - (2 * Margins.articleSides) - Margins.defaultLarge,
        height: width/2.125,
        marginLeft: Margins.articleSides,
        marginRight: Margins.articleSides,
        marginBottom: Margins.default
      },
  
      endHomeImage: {
  
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
        fontFamily: Fonts.PTSerifBold,
        fontSize: 14,
        marginTop: 2,
      },
      searchDescription: {
        fontFamily: Fonts.PTSerif,
        fontSize: 12,
        marginTop: 2,
        opacity: 0.80,
      },
})