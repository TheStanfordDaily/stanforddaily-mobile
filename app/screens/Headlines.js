import { STRINGS, CATEGORIES, HOME_SECTIONS, CATEGORY_ICONS, KEYS, FONTS, COLORS, LIGHT_COLORS, DARK_COLORS, MARGINS } from '../assets/constants.js';
import React, { useState, useRef, useEffect } from 'react';
import { Image, Linking, Appearance, useColorScheme } from 'react-native';
import {
  View,
  Text,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Switch
} from 'react-native';
import Drawer from 'react-native-drawer'
import 'lodash';

//Components for this app imports
import Header from './common/header';
import NewsFeedItem from './common/newsfeed-item';
import Separator from './common/Separator';
import SettingsPage from './SettingsPage.js';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons'
import Carousel, { Pagination, getInputRangeFromIndexes } from 'react-native-snap-carousel';
import CardRow from './common/card-row';
import Card from './common/Card'
import Column from './common/column';
import HTML from '../HTML';
import moment from 'moment';
import 'moment-timezone';
import Lightbox from 'react-native-lightbox-v2'
import LightboxGallery from './common/LightboxGallery';

//Styles for the page
import styles from './styles/headlines';
import stylesSlider from './styles/Cartoon.style'
import * as Amplitude from 'expo-analytics-amplitude';
import { getHomeAsync, getCategoryAsync, getHomeMoreAsync } from '../helper/wpapi.js';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const amplitude = Amplitude.initialize(KEYS.AMPLITUDE_API);
//A map between categories names and their codes
const { width, height } = Dimensions.get('window');
const drawerStyles = {
  drawer: { shadowColor: 'black', color: COLORS.LABEL, backgroundColor: COLORS.BACKGROUND, shadowOpacity: 0.8, shadowRadius: 3 },
}
const carouselProps = {
  vertical: 50,
  horizontal: 50
}

const CATEGORY_HOME = CATEGORIES[0];
export const getThumbnailURL = ({thumbnailInfo}) => thumbnailInfo ? (thumbnailInfo.urls.mediumLarge || thumbnailInfo.urls.full): null;
export const formatDate = post => moment.utc(post.postDateGmt).format('MMM D, YYYY');
export default (props) => {
  const colorScheme = useColorScheme()
  const THEME = colorScheme === 'light' ? LIGHT_COLORS : DARK_COLORS
  const [category, setCategory] = useState(CATEGORY_HOME);
  // const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // TODO: show modal by default
  const [pageNumber, setPageNumber] = useState(1);
  const [opinionsScrollPosition, setOpinionsScrollPosition] = useState(0);
  const [humorScrollPosition, setHumorScrollPosition] = useState(0);
  const drawerRef = useRef();
  const setTextStyle = (cat) => {
    if (cat === category) {
      return { color: THEME.PRIMARY_ACCENT, fontFamily: FONTS.OPEN_SANS, marginLeft: MARGINS.ARTICLE_SIDES };
    }
    return { color: THEME.LABEL, fontFamily: FONTS.OPEN_SANS, marginLeft: MARGINS.ARTICLE_SIDES };
  }

  const communityItems = [
    {
      label: "About Us",
      isExternal: true
    },
    {
      label: "Send Tips",
      isExternal: false
    },
    {
      label: "Donate",
      isExternal: false
    },
    {
      label: "Submit Work",
      isExternal: true
    },
    /*giveFeedback: {
      label: "Give Feedback",
      isExternal: false
    },*/
    {
      label: "Alumni",
      isExternal: true
    }
  ]

  // later will have sections here and stuff
  const SideMenu = () => (
    <View style={styles.sideMenuContainer}>
      <View style={styles.sideBarTitle}>
        <Text style={styles.sideBarTitleText}> Community </Text>
      </View>
        <FlatList
        data={communityItems}
        style={styles.flatListStyle}
        ItemSeparatorComponent={() => <Separator />}
        renderItem={({ item }) =>
          <TouchableOpacity>
            <View style={styles.sideMenuItem}>
              <Ionicons name={CATEGORY_ICONS[item.label]} color={THEME.LABEL} style={setTextStyle(item)} size={32} />
              <Text style={setTextStyle(item)}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        }
      />
      <TouchableHighlight style={{ width: '100%', marginLeft: 28 }}>
        <View style={{flexDirection: 'column'}}>
        {/* <View style={styles.sideMenuItem, { flexDirection: 'row', justifyContent: 'center', marginRight: MARGINS.ARTICLE_SIDES }}>
        <Switch />
        <Text>Push Notifications</Text>
        </View> */}
          <View style={styles.sideMenuItem, { marginBottom: 40, flexDirection: 'row', justifyContent: 'center', marginRight: MARGINS.ARTICLE_SIDES }}>
            <TouchableOpacity onPress={ () => {Linking.openURL('https://open.spotify.com/show/2ty8gvAnvYP31X8TUrFwoj?si=YmnmqxYuSFq8U2mv_P2fCg')}}><Image style={{width: 32, height: 32}} source={require('../media/spotify.png')} /></TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={ ()=>{ Linking.openURL('https://www.youtube.com/channel/UCWg3QqUzqxXt6herm5sMjNw')}}><Ionicons name="logo-youtube" size={32} color={THEME.PRIMARY_ACCENT} /></TouchableOpacity>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );


  const _renderRow = ({item, index}) => {
      return (<NewsFeedItem
              key={"article-" + item.id}
              item={item}
              index={index}
              isFeatured={true}
              onPress={ () => props.navigation.navigate(STRINGS.POST, { postID: item.id })}
              onAuthor={ (authorID) => props.navigation.navigate(STRINGS.AUTHOR, { authorID: authorID }) } />);
  };

const _renderCardRow = ({item}) => {
  return (
    <Card
      item={item}
      navigation={props.navigation}
      onPress={ () => props.navigation.navigate(STRINGS.POST, { postID: item.id })} 
    />    
  );
};

const _renderColumn = ({item, index}) => {

  return (
    <Column
      item={item}
      navigation={props.navigation}
      slideIndex={index}
    />
  )
}

const _renderImage = ({item}) => {
  const packageTest = allArticles['cartoons'].map(x => getThumbnailURL(x).toString())
  return (
    <LightboxGallery title={item.postTitle} authors={item.tsdAuthors} imageResource={getThumbnailURL(item)} date={formatDate(item)} navigation={props.navigation} uriGroup={packageTest} />
  )
}

const onThemeChange = ({ colorScheme }) => {
 // https://dev.to/franciscocobas/implement-dark-mode-in-android-and-ios-apps-with-react-native-and-redux-52n9
  console.log("Dispatch changes in this block.")
}

  useEffect(() => {
    (async () => {
      if (category.slug === CATEGORY_HOME.slug) {
        if (pageNumber === 1) {
          const homeResults = await getHomeAsync();
          console.log(homeResults);
          const flattenedResults = [];
          const unFlattenedResults = {};
          for (let section of HOME_SECTIONS) {
            flattenedResults.push(...(homeResults[section] || []));
            unFlattenedResults[section] = homeResults[section]
          }
          // setArticles(flattenedResults);
          setAllArticles(unFlattenedResults);
        } else {
          // setArticles(await getHomeMoreAsync(pageNumber));
        }
      } else {
        const {posts} = await getCategoryAsync([category.slug], pageNumber);
        // setArticles(posts);
      }
    })();
  }, [pageNumber, category]);

  return (
    <Drawer
      type={STRINGS.STATIC}
      ref={drawerRef}
      content={<SideMenu />}
      openDrawerOffset={0.4}
      styles={drawerStyles}
      tweenHandler={Drawer.tweenPresets.parallax}
      captureGestures={true}
      negotiatePan={true}
      tapToClose={true}
      onOpenStart={() => StatusBar.setHidden(true)}
      onCloseStart={() => StatusBar.setHidden(false)}
    >
      <View>
        <SettingsPage
          visible={modalVisible}
          setModalVisible={() => setModalVisible(!modalVisible)}
        />
      </View>

      <Header 
        drawerHandler={() => drawerRef.current.open()} 
        // TODO: enable search.
        // searchHandler={() => props.navigation.navigate(STRINGS.SEARCH, {})} 
        title={category.slug === CATEGORY_HOME.slug ? undefined : category.name}
        searchNavigator={() => props.navigation.navigate(STRINGS.SEARCH, {articles: allArticles})}
        />
      <View style={{ flex: 1, backgroundColor: THEME.BACKGROUND, alignItems: 'center' }}>
      <StatusBar
              barStyle={colorScheme === "light" ? "dark" : "light" + "-content"}
            />
        <ScrollView>
        <Carousel
            layout={"default"}
            data={allArticles['featured']}
            renderItem={_renderRow}
            sliderWidth={width}
            itemWidth={0.92*width}
            activeSlideAlignment={'start'}
            inactiveSlideScale={1}
            scrollInterpolator={(index, carouselProps) => {const range = [3, 2, 1, 0, -1];
              const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
              const outputRange = range; return { inputRange, outputRange }}}
            slideInterpolatedStyle={(index, animatedValue, carouselProps) => {  return {
              opacity: animatedValue.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0, 1, 0.7],
                  extrapolate: 'clamp'
              })
          }}}
            // inactiveSlideOpacity={0}
            // slideInterpolatedStyle={(index, animatedValue, carouselProps) => { return { zIndex: carouselProps.data.length + index }}} must find a way to update zIndex for active slide so tapping works as it should
          />

{/* <View style={styles.categoryLabel}>
                    <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.header} html={"News"} />
                    <TouchableOpacity style={styles.more} onPress={() => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['news'], title: 'News', navigation: props.navigation })}>
                        <Text style={styles.titleContainer, styles.titleFont, styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View> this can be turned into its own component*/}
              <Separator />
                          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5}}>
            <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.header} html={"News"} />
            <TouchableOpacity style={styles.more} onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['news'], title: 'News', navigation: props.navigation })}>
                <Text style={styles.titleContainer, styles.titleFont, styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <CardRow
            data={allArticles['news']}
            renderItem={_renderCardRow}
            title={"News"}
            onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['news'], title: 'News', navigation: props.navigation })} 
          />
          <Separator />
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5}}>
            <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.header} html={"Opinions"} />
            <TouchableOpacity style={styles.more} onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['opinions'], title: 'Opinions', navigation: props.navigation })}>
                <Text style={styles.titleContainer, styles.titleFont, styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <Carousel
            data={_.chunk(allArticles['opinions'], 3)}
            renderItem={_renderColumn}
            sliderWidth={width}
            itemWidth={0.92*width}
            activeSlideAlignment={'start'}
            inactiveSlideScale={1}
            scrollInterpolator={(index, carouselProps) => {const range = [3, 2, 1, 0, -1];
              const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
              const outputRange = range; return { inputRange, outputRange }}}
            slideInterpolatedStyle={(index, animatedValue, carouselProps) => {  return {
              opacity: animatedValue.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0, 1, 0.7],
                  extrapolate: 'clamp'
              })}}}
          />
          <Separator />
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5}}>
            <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.header} html={"Sports"} />
            <TouchableOpacity style={styles.more} onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['sports'], title: 'Sports', navigation: props.navigation })}>
                <Text style={styles.titleContainer, styles.titleFont, styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <CardRow
            data={allArticles['sports']}
            renderItem={_renderCardRow}
            title={"Sports"}
            onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['sports'], title: 'Sports', navigation: props.navigation })}
          />
          <Separator />
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5}}>
            <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.header} html={"Arts & Life"} />
            <TouchableOpacity style={styles.more} onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['artsAndLife'], title: 'Arts and Life', navigation: props.navigation })}>
                <Text style={styles.titleContainer, styles.titleFont, styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <CardRow
            data={allArticles['artsAndLife']}
            renderItem={_renderCardRow}
            title={"Arts & Life"}
            onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['artsAndLife'], title: 'Arts and Life', navigation: props.navigation })}
          />
          <Separator />
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5}}>
            <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.header} html={"The Grind"} />
            <TouchableOpacity style={styles.more} onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['theGrind'], title: 'The Grind', navigation: props.navigation })}>
                <Text style={styles.titleContainer, styles.titleFont, styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <CardRow
            data={allArticles['theGrind']}
            renderItem={_renderCardRow}
            title={"The Grind"}
            onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['theGrind'], title: 'The Grind', navigation: props.navigation })} 
          />

<View
        style={{
            backgroundColor: COLORS.SECONDARY_ACCENT,
            height: 10,
        }}
        />
          
          <View style={{flexDirection: 'row', backgroundColor: THEME.SECONDARY_ACCENT, justifyContent: 'space-between', paddingBottom: 5}}>
            {/* <Image containerStyle={styles.titleContainer} style={styles.titleImage} source={require('../media/artsAndLife.png')} /> */}
            <HTML containerStyle={{...styles.titleContainer, ...{ backgroundColor: COLORS.SECONDARY_ACCENT }}} baseFontStyle={{...styles.header, ...{ color: 'black' }}} html={"Humor"} />
            <TouchableOpacity style={styles.more} onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['humor'], title: 'Humor', navigation: props.navigation })}>
                <Text style={styles.titleContainer, styles.titleFont, styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <Carousel
            data={_.chunk(allArticles['humor'], 3)}
            renderItem={_renderColumn}
            sliderWidth={width}
            itemWidth={0.92*width}
            containerCustomStyle={{backgroundColor: THEME.SECONDARY_ACCENT}}
            activeSlideAlignment={'start'}
            inactiveSlideScale={1}
            scrollInterpolator={(index, carouselProps) => {const range = [3, 2, 1, 0, -1];
              const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
              const outputRange = range; return { inputRange, outputRange }}}
            slideInterpolatedStyle={(index, animatedValue, carouselProps) => {  return {
              opacity: animatedValue.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0, 1, 0.7],
                  extrapolate: 'clamp'
              })}}}
          />
          <View
        style={{
            backgroundColor: COLORS.BACKGROUND,
            height: 10,
        }}
        />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.header} html={"Cartoons"} />
          </View>


          <Carousel
            layout={'tinder'}
            activeSlideAlignment={'center'}
            data={allArticles['cartoons']}
            renderItem={_renderImage}
            enableMomentum={true}
            sliderWidth={width}
            itemWidth={0.85*width}
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
          />
          
        </ScrollView>
      </View>
    </Drawer>

  )
}