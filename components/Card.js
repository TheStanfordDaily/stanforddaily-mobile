import { Strings, CategorySlugs, Margins, Alignments, Fonts, FontSizes } from '../constants';
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform
} from 'react-native';
import moment from 'moment';
import "moment-timezone";
import _ from "lodash";
import { getThumbnailURL, formatDate, normalize } from '../helpers/format';
import { decode } from 'html-entities'
import Byline from './Byline';


const { width, height } = Dimensions.get('window');

export default class Card extends Component {

  //Handles clicking on items
  toPost() {
    this.props.onPress();
  }

  toAuthor() {
    this.props.onAuthorPress(authorID);
  }

  render() {
    const { item, navigation } = this.props;
    let { title, author, excerpt, coauthors, parsely, _embedded, date, thumbnailInfo, postSubtitle } = item;

    return ( _embedded && 
        <TouchableWithoutFeedback onPress={this.toPost.bind(this)}>
          <View style={styles.content}>

         {_embedded["wp:featuredmedia"][0].media_details && _embedded["wp:featuredmedia"][0].media_details.sizes && _embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail && (
          <Image resizeMode={'cover'} source={{ uri: _embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail.source_url }} style={styles.image} borderRadius={8} />
         )}

                  <Text style={styles.titleFont} adjustsFontSizeToFit minimumFontScale={0.75} allowFontScaling numberOfLines={5}>{decode(title.rendered)}</Text>
            <View style={styles.dateAndAuthor}>
              <Byline style={styles.date} names={item.parsely.meta.creator} identifiers={item.coauthors} />
              <Text style={styles.date}>{moment(new Date(date)).fromNow().toUpperCase()}</Text>
            </View>
          </View>
            
        </TouchableWithoutFeedback>
    );

  }

}

const styles = ({
  content: {
    paddingVertical: 2,
    backgroundColor: "rgb(0,0,0,0)",
    marginLeft: 0,
    marginRight: 0,
    width: width/1.95 - Margins.defaultLarge
  },
  categoryLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: width - (2 * Margins.default)
  },
  dateAndAuthor: {
    flexDirection: Alignments.column,
    justifyContent: Alignments.spaceBetween,
    marginTop: Margins.default,
    marginHorizontal: Margins.articleSides,
  },

  author: {
    fontFamily: "system",
    fontSize: 10,
    marginLeft: -2,
  //   color: THEME.SECONDARY_LABEL,
  },

  date: {
    fontFamily: "system",
    fontSize: 10,
    fontWeight: "500",
    color: "#4D4F53"
  //   color: THEME.SECONDARY_LABEL,
  },

  header: {
      fontFamily: "MinionProDisp",
      fontSize: FontSizes.large + 10,
      // color: THEME.LABEL
  },

  titleFont: {
    fontFamily: "MinionProRegular",
    fontSize: normalize(FontSizes.mediumSmall),
    marginHorizontal: Margins.articleSides
  //   color: THEME.LABEL
  },
  titleContainer: {
    marginTop: Margins.defaultSmall,
    marginLeft: Margins.articleSides,
    width: width/1.95 - Margins.articleSides - Margins.defaultSmallMedium
  },

  descriptionContainer: {
    opacity: 0.80,
    marginHorizontal: Margins.articleSides
  },
  descriptionFont: {
    fontSize: FontSizes.defaultMediumSmall
  },

  image: {
    marginBottom: Margins.default,
    width: width/1.95 - Margins.articleSides - Margins.defaultSmallMedium,
    marginLeft: Margins.articleSides,
    marginRight: 0,
    height: 3/4 * width/2.2
  },

  imageContainer: {

  },
  searchContainer: {
  //   borderBottomColor: COLORS.SECONDARY_LABEL,
    borderBottomWidth: 1,
  //   backgroundColor: THEME.BACKGROUND,
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
    fontFamily: "system",
    fontSize: 14,
    marginTop: 2,
  },
  searchDescription: {
    fontFamily: "system",
    fontSize: 12,
    marginTop: 2,
    opacity: 0.80,
  },
  more: {
  //   backgroundColor: THEME.BUTTON,
    marginTop: Margins.defaultSmall,
    marginHorizontal: Margins.articleSides,
    justifyContent: 'center',
    borderRadius: 10
  },
  seeAll: {
    paddingHorizontal: 15,
    fontFamily: "MinionProDisp",
  //   color: THEME.LABEL
  }
})