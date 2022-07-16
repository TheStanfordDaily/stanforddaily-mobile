import React, { useEffect, useState } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, Image } from 'react-native';
import { Strings, Heights, Margins, Fonts, Alignments, FontSizes, Sections, PlatformPalette } from '../constants';
import Separator from '../components/Separator';
import Carousel, { getInputRangeFromIndexes } from 'react-native-snap-carousel';
import { getHomeAsync, getCategoryAsync, getHomeMoreAsync } from '../helpers/wpapi';
import NewsFeedItem from '../components/NewsFeedItem';
import LightboxGallery from '../components/LightboxGallery';
import CategoryHeader from '../components/CategoryHeader';
import CardRow from '../components/CardRow';
// import Card from '../components/Card';
import { getThumbnailURL, formatDate } from '../helpers/format';
import Column from '../components/Column';
import { Card, Divider, Layout, List, ListItem, Text } from '@ui-kitten/components';
import { renderRow } from '../helpers/render';
import { ImageBackground } from 'react-native';
import moment from 'moment';
import { News } from '../components/sections/News';

const { width, height } = Dimensions.get('window');
const dummyData = require("../dummy.json")


const thumbnailImage = (details) => {
  console.log(details.sizes.thumbnail)
}

export default function Home(props) {

    const [sections, setSections] = useState([]);

    return (
<Layout level={"2"} style={styles.container}>
<News articles={dummyData.slice(0, 8)} />
</Layout>
            
   
    );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    // backgroundColor: '#FFFFFF'
    // backgroundColor: PlatformPalette.background
  },
  loadingIndicator: {
    marginTop: Margins.default,
    marginBottom: Margins.default
  },
  sideMenuContainer: {
    flex: 1,
    // backgroundColor: COLORS.WHITE,
    alignItems: Alignments.center,
    // paddingTop: top_padding
  },
  sideBarTitle: {
    height: Heights.appHeader,
    justifyContent: Alignments.center,
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    paddingTop: Margins.NORMAL_HEADER_Margins,
    // borderBottomColor: THEME.SECONDARY_LABEL,
  },
  sideBarTitleText: {
    // color: THEME.LABEL,
    fontFamily: Fonts.PTSerifBold,
    fontSize: FontSizes.smallMedium,
    //textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
    marginLeft: Margins.default
  },
  flatListStyle: {
    flex: 1,
    width: '100%',
    marginTop: 10
  },
  sideMenuItem: {
    width: '100%',
    flexDirection: Alignments.row,
    height: Heights.sideMenuItem,
    alignItems:  Alignments.center,
  },
  separator: {
    // borderBottomColor: THEME.SECONDARY_LABEL,
    borderBottomWidth: 1,
  },
  categoriesHeaderContainer: {
    height: 60,
    // backgroundColor: THEME.BACKGROUND,
    alignItems: Alignments.left,
    justifyContent: Alignments.left,
  },
  categoriesText: {
    marginTop: Margins.default,
    marginLeft: Margins.articleSides, //match category side with article edge
    fontFamily: "MinionProDisp",
    fontSize:25,
    flex: 2,
  },
  categoryLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: width - (2 * Margins.default)
  },
  header: {
    fontFamily: "MinionProDisp",
    fontSize: Fonts.large + 10,
    // color: THEME.LABEL
  },
  humor: {
    fontFamily: "MinionProDisp",
    fontSize: FontSizes.large + 10,
    // color: THEME.BACKGROUND
  },
  more: {
    // backgroundColor: THEME.BUTTON,
    marginTop: Margins.small,
    marginHorizontal: Margins.articleSides,
    justifyContent: 'center',
    borderRadius: 10
  },
  cartoonContainer: {
    paddingVertical: 30,
    width: 0.75*width,
    height: 0.75*width
  },
  sliderContentContainer: {
    paddingVertical: 10 // for custom animation
  },
  communityContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 0,
    width: '100%',
  },
  box: {
    width: '95%',
    height: height/8,
    // backgroundColor: COLORS.CARDINAL,
    margin: Margins.small,
    justifyContent: 'center',
    flexDirection: 'row',
    alignContent: 'center'
  },
  communityTitleText: {
    fontSize: FontSizes.extraLarge,
    fontFamily: "MinionProDisp",
    // color: COLORS.WHITE,
    textAlign: 'center',
  }
});