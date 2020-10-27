import { STRINGS, CATEGORIES, HOME_SECTIONS, CATEGORY_ICONS, KEYS, FONTS, COLORS, MARGINS } from '../assets/constants.js';
import React, { useState, useRef, useEffect } from 'react';
import { Image } from 'react-native';
import {
  View,
  Text,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView
} from 'react-native';
import Drawer from 'react-native-drawer'

//Components for this app imports
import Header from './common/header';
import NewsFeedItem from './common/newsfeed-item';
import Separator from './common/Separator';
import SettingsPage from './SettingsPage.js';
import _ from 'lodash';
import { Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import CardRow from './common/card-row';
import Card from './common/Card'
import Column from './common/column';
import HTML from '../HTML';

//Styles for the page
import styles from './styles/headlines';

import * as Amplitude from 'expo-analytics-amplitude';
import { getHomeAsync, getCategoryAsync, getHomeMoreAsync } from '../helper/wpapi.js';
// import { Card } from 'react-native-elements';

const amplitude = Amplitude.initialize(KEYS.AMPLITUDE_API);

//A map between categories names and their codes
const { width, height } = Dimensions.get('window');
const drawerStyles = {
  drawer: { shadowColor: COLORS.BLACK, shadowOpacity: 0.8, shadowRadius: 3 },
}

//

const CATEGORY_HOME = CATEGORIES[0];

export default (props) => {

  const [category, setCategory] = useState(CATEGORY_HOME);
  // const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // TODO: show modal by default
  const [pageNumber, setPageNumber] = useState(1);
  const drawerRef = useRef();
  const listRef = useRef();
  const setTextStyle = (cat) => {
    if (cat === category) {
      return { color: COLORS.CARDINAL, fontFamily: FONTS.OPEN_SANS, marginLeft: MARGINS.ARTICLE_SIDES };
    }
    return { color: COLORS.BLACK, fontFamily: FONTS.OPEN_SANS, marginLeft: MARGINS.ARTICLE_SIDES };
  }
  const SideMenu = () => (
    <View style={styles.sideMenuContainer}>
      <View style={styles.sideBarTitle}>
        <Text style={styles.sideBarTitleText}> Sections </Text>
      </View>
      <FlatList
        data={CATEGORIES}
        style={styles.flatListStyle}
        ItemSeparatorComponent={() => <View style={styles.separator} /> }
        renderItem={({ item }) =>
          <TouchableOpacity onPress={() => { setCategory(item); drawerRef.current.close(); listRef.current.scrollToLocation({ animated: false, sectionIndex: 0, itemIndex: 0, viewPosition: 2 }); }}>
            <View style={styles.sideMenuItem}>
              <Ionicons name={CATEGORY_ICONS[item.name]} style={setTextStyle(item)} size={16} />
              <Text style={setTextStyle(item)}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        }
      />
      <TouchableHighlight style={{ width: '100%', marginLeft: 28 }}>
        <TouchableOpacity
          onPress={() => setModalVisible(!modalVisible)}>
          <View style={styles.sideMenuItem}>
          <Image
            style={{
              width: 16,
              height: 16
            }}
            source={require('../media/gears.png')}
          />
          <Text style={{
            fontSize: 13,
            fontFamily: FONTS.OPEN_SANS,
            color: COLORS.BLACK,
            marginLeft: MARGINS.ARTICLE_SIDES
          }}>
            Notification Settings
          </Text>
          </View>
        </TouchableOpacity>
      </TouchableHighlight>
    </View>
  );
  const _renderRow = ({item}) => {
      return (<NewsFeedItem
              key={"article-" + item.id}
              item={item}
              onPress={ () => props.navigation.navigate(STRINGS.POST, { postID: item.id })} />);
  };

const _renderCardRow = ({item}) => {
  return (
    <Card
      item={item}
      onPress={ () => props.navigation.navigate(STRINGS.POST, { postID: item.id })} 
    />    
  );
};

const _renderColumn = ({item}) => {

  return (
    <Column
      item={item}
      navigation={props.navigation}
    />
  )
}

  useEffect(() => {
    (async () => {
      if (category.slug === CATEGORY_HOME.slug) {
        if (pageNumber === 1) {
          const homeResults = await getHomeAsync();
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
        title={category.slug === CATEGORY_HOME.slug ? undefined : category.name} />
      <View style={{ flex: 1, backgroundColor: COLORS.NEAR_WHITE, alignItems: 'center' }}>
        <StatusBar
          barStyle={STRINGS.DARK_CONTENT}
        />
        <ScrollView>
        <Carousel
            layout={"default"}
            data={allArticles['featured']}
            renderItem={_renderRow}
            sliderWidth={width}
            itemWidth={width}
          />
          <Separator />
          <CardRow
            data={allArticles['news']}
            renderItem={_renderCardRow}
            title={"News"}
            onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['news'], title: 'News', navigation: props.navigation })} 
          />
          <Separator />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.header} html={"Opinions"} />
            <TouchableOpacity style={styles.more} onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['opinions'], title: 'Opinions', navigation: props.navigation })}>
                <Text style={styles.titleContainer, styles.titleFont, {paddingHorizontal: 20}}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={_.chunk(allArticles['opinions'], 3)}
            renderItem={_renderColumn}
            horizontal={true}
            snapToAlignment={"start"}
            snapToInterval={width}
            decelerationRate={"fast"}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
          />
          <Separator />
          <CardRow
            data={allArticles['theGrind']}
            renderItem={_renderCardRow}
            title={"The Grind"}
            onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['theGrind'], title: 'The Grind', navigation: props.navigation })} 
          />
                    {/* <SectionList
          ref={listRef}
          removeClippedSubviews={false}
          disableVirtualization={true}
          // refreshing={refreshing}
          keyExtractor={item => `list-key-${item.id}`}
          // onRefresh={() => setRefreshing(true)}
          // onEndReached={() => setPageNumber(pageNumber + 1)}
          sections={[{ data: articles, key: `category-list-${pageNumber}-${category}` }]}
          renderItem={_renderRow}
          //renderSectionHeader={() => this.renderSectionHeader()}
          ListFooterComponent={() => <ActivityIndicator style={styles.loadingIndicator} />}
          contentContainerStyle={{ width: width }}
        /> */}
        </ScrollView>
            

      </View>
    </Drawer>

  )
}

// export default class extends React.Component() {
//   render() {
//     return <HeadlinesComponent {...this.props} />;
//   }
// }