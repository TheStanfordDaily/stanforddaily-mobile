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
import HTML from './HTML';
import { getThumbnailURL, formatDate, relativeDate, normalize } from '../helpers/format';
import RenderHtml from 'react-native-render-html'


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
    let thumbnailURL
    const { item, navigation } = this.props;
    let { title, author, excerpt, _embedded, date, thumbnailInfo, postSubtitle, tsdAuthors} = item;
    if (_embedded["wp:featuredmedia"][0].code) {
      console.log(_embedded["wp:featuredmedia"][0].data.status);
    } else {
      thumbnailURL = _embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail.source_url
    }
    // console.log("Media Details: ",  _embedded["wp:featuredmedia"]);
    return (
        <TouchableWithoutFeedback onPress={this.toPost.bind(this)}>
          <View style={styles.content}>

            { thumbnailURL && (
              <Image resizeMode={'cover'} source={{ uri: thumbnailURL }} style={styles.image} borderRadius={8} />
            )}

            
                  
                      {/* <Image resizeMode={'cover'} source={{ uri: thumbnailURL }} style={styles.image} borderRadius={8} /> */}
                  
                  <Text style={styles.titleFont} adjustsFontSizeToFit minimumFontScale={0.75} allowFontScaling numberOfLines={5}>{title.rendered.replaceAll("&#8216;", "\u2018").replaceAll("&#8217;", "\u2019").replaceAll("&#038;", "&")}</Text>
                  {/* <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.titleFont} html={postTitle} /> */}
            {/*<HTML containerStyle={styles.descriptionContainer} baseFontStyle={styles.descriptionFont} html={postExcerpt} />*/}
            <View style={styles.dateAndAuthor}>
              {/* <TouchableOpacity onPress={() => {navigation.navigate(STRINGS.AUTHOR, { authorID: postAuthor })}}>
                <Text style={styles.author}>{formatAuthors(item).toUpperCase()}</Text>
              </TouchableOpacity> */}
              {/* <View style={{ flexDirection: 'row' }}>{item.tsdAuthors.map((info, i) => <TouchableWithoutFeedback onPress = {()=>{this.props.navigation.navigate(Strings.author, { authorID: item.tsdAuthors[i].id})}}><Text style={styles.author}>{info.displayName.toUpperCase()}{i != item.tsdAuthors.length - 1 && ', '}</Text></TouchableWithoutFeedback>)}</View> */}
              <Text style={styles.date}>{_embedded.author[0].name + "\n" + relativeDate(Date.parse(date)).toUpperCase()}</Text>
            </View>
          </View>
            
        </TouchableWithoutFeedback>
    );

  }

}

const styles = ({
  content: {
    width: '100%',
    paddingVertical: 2,
    backgroundColor: "rgb(0,0,0,0)",
    marginLeft: 0,
    marginRight: 0,
    width: width/2.25 - Margins.defaultLarge
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
      fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
      fontSize: FontSizes.large + 10,
      // color: THEME.LABEL
  },

  titleFont: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: normalize(FontSizes.mediumSmall),
    marginHorizontal: Margins.articleSides
  //   color: THEME.LABEL
  },
  titleContainer: {
    marginTop: Margins.defaultSmall,
    marginLeft: Margins.articleSides,
    width: width/2.25 - Margins.articleSides - Margins.defaultLarge
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
    width: width/2.25 - Margins.articleSides - Margins.defaultLarge,
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
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  //   color: THEME.LABEL
  }
})