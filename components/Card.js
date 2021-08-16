import { Strings, CategorySlugs, Margins, Alignments, Fonts, FontSizes } from '../constants';
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import "moment-timezone";
import _ from "lodash";
import HTML from './HTML';
import { getThumbnailURL, formatDate } from '../helpers/format';


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
    let { postTitle, postAuthor, postExcerpt, postDate, thumbnailInfo, postSubtitle, tsdAuthors} = item;
    const thumbnailURL = getThumbnailURL(item);
    return (
        <TouchableWithoutFeedback onPress={this.toPost.bind(this)}>
          <View style={styles.content}>
                  {thumbnailURL && (
                  
                      <Image resizeMode={'cover'} source={{ uri: thumbnailURL }} style={styles.image} borderRadius={8} />
                  )
                  }
                  <Text style={styles.titleFont}>{postTitle}</Text>
                  {/* <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.titleFont} html={postTitle} /> */}
            {/*<HTML containerStyle={styles.descriptionContainer} baseFontStyle={styles.descriptionFont} html={postExcerpt} />*/}
            <View style={styles.dateAndAuthor}>
              {/* <TouchableOpacity onPress={() => {navigation.navigate(STRINGS.AUTHOR, { authorID: postAuthor })}}>
                <Text style={styles.author}>{formatAuthors(item).toUpperCase()}</Text>
              </TouchableOpacity> */}
              <View style={{ flexDirection: 'row' }}>{item.tsdAuthors.map((info, i) => <TouchableWithoutFeedback onPress = {()=>{this.props.navigation.navigate(Strings.author, { authorID: item.tsdAuthors[i].id})}}><Text style={styles.author}>{info.displayName.toUpperCase()}{i != item.tsdAuthors.length - 1 && ', '}</Text></TouchableWithoutFeedback>)}</View>
              <Text style={styles.date}>{formatDate(item).toUpperCase()}</Text>
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
    fontFamily: Fonts.openSans,
    fontSize: 10,
    marginLeft: -2,
  //   color: THEME.SECONDARY_LABEL,
  },

  date: {
    fontFamily: Fonts.openSans,
    fontSize: 10,
  //   color: THEME.SECONDARY_LABEL,
  },

  header: {
      fontFamily: Fonts.PTSerifBold,
      fontSize: FontSizes.large + 10,
      // color: THEME.LABEL
  },

  titleFont: {
    fontFamily: Fonts.PT_SERIF,
    fontSize: FontSizes.mediumSmall,
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
  more: {
  //   backgroundColor: THEME.BUTTON,
    marginTop: Margins.defaultSmall,
    marginHorizontal: Margins.articleSides,
    justifyContent: 'center',
    borderRadius: 10
  },
  seeAll: {
    paddingHorizontal: 15,
    fontFamily: Fonts.PTSerifBold,
  //   color: THEME.LABEL
  }
})