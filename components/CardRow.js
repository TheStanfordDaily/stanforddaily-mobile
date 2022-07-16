import React, { Component, useRef } from 'react';
import { View, Dimensions, FlatList, StyleSheet } from 'react-native';
import { Alignments, Fonts, FontSizes, Margins } from '../constants';
import "moment-timezone";
import _ from "lodash";

const { width, height } = Dimensions.get('window');

export default class CardRow extends Component {

    constructor(props) {
        super(props)
        this.state = {
            scrollPosition: 0
          }
    }

    render() {
        const { data, renderItem, title, onPress } = this.props;
        
        return (
            <View style={styles.content}>
                <FlatList
                    style={styles.videos_flatList}
                    horizontal={true}
                    data={data}
                    // snapToAlignment={"start"}
                    // snapToInterval={0.95*width/2}
                    // decelerationRate={"fast"}
                    showsHorizontalScrollIndicator={false}
                    // pagingEnabled
                    renderItem={renderItem}
                    onScroll={e => {this.setState({scrollPosition: e.nativeEvent.contentOffset.x})}}
                />
            </View>
        );
      }
}

const styles = ({
    content: {
      width: '100%',
      paddingVertical: 2,
      backgroundColor: "rgb(0,0,0,0)",
      marginLeft: 0,
      marginRight: 0
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
      fontFamily: "MinionProDisp",
      fontSize: 10,
      marginLeft: -2,
    //   color: THEME.SECONDARY_LABEL,
    },

    date: {
      fontFamily: "MinionProDisp",
      fontSize: 10,
    //   color: THEME.SECONDARY_LABEL,
    },

    header: {
        fontFamily: "MinionProDisp",
        fontSize: FontSizes.large + 10,
        // color: THEME.LABEL
    },

    titleFont: {
      fontFamily: "MinionProDisp",
      fontSize: FontSizes.mediumSmall,
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
      fontFamily: "MinionProDisp",
      fontSize: 14,
      marginTop: 2,
    },
    searchDescription: {
      fontFamily: "MinionProDisp",
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