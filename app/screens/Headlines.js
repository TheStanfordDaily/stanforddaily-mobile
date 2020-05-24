import { STRINGS, CATEGORIES, HOME_SECTIONS, CATEGORY_ICONS, REFS, KEYS, ALIGNMENTS, FONTS, COLORS, MARGINS } from '../assets/constants.js';
import React, { Component, useState, useRef, useEffect } from 'react';
import { Image } from 'react-native';
import { AsyncStorage } from "react-native";
import Modal from "react-native-modal"
import ToggleSwitch from 'toggle-switch-react-native'
import {
  Alert,
  View,
  Text,
  Dimensions,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
  NetInfo,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  SectionList
} from 'react-native';
import Drawer from 'react-native-drawer'

//Components for this app imports
import Header from './common/header';
import NewsFeedItem from './common/newsfeed-item';
import Placeholder from './common/placeholder';
import SettingsPage from './SettingsPage.js';
import _ from 'lodash';
import { version } from "../../app.json";
import { Ionicons } from '@expo/vector-icons';

//Styles for the page
import styles from './styles/headlines';

import * as Amplitude from 'expo-analytics-amplitude';
import FollowButton from './common/FollowButton.js';
import { getHomeAsync, getCategoryAsync, getHomeMoreAsync } from '../helper/wpapi.js';

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
  const [articles, setArticles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // TODO: show modal by default
  const [refreshing, setRefreshing] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const drawerRef = useRef();
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
        renderItem={({ item }) =>
          <TouchableOpacity onPress={() => { setCategory(item); drawerRef.current.close() }}>
            <View style={styles.sideMenuItem}>
              <Ionicons name={CATEGORY_ICONS[item.name]} style={setTextStyle(item)} size={16} />
              <Text style={setTextStyle(item)}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        }
      />
      {/*<TouchableHighlight style={{ width: '100%', marginLeft: 28 }}>
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
            Settings
          </Text>
          </View>
        </TouchableOpacity>
        </TouchableHighlight>*/}
    </View>
  );
  const _renderRow = ({item}) => {
      return (<NewsFeedItem
              key={"article-" + item.id}
              item={item}
              onPress={ () => props.navigation.navigate(STRINGS.POST, { postID: item.id })} />);
  };
  useEffect(() => {
    (async () => {
      if (category.slug === CATEGORY_HOME.slug) {
        if (pageNumber === 1) {
          const homeResults = await getHomeAsync();
          const flattenedResults = [];
          for (let section of HOME_SECTIONS) {
            flattenedResults.push(...(homeResults[section] || []));
          }
          setArticles(flattenedResults);
        } else {
          setArticles(await getHomeMoreAsync(pageNumber));
        }
      } else {
        const {posts} = await getCategoryAsync([category.slug], pageNumber);
        setArticles(posts);
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
      <View style={{ flex: 1, backgroundColor: COLORS.GHOST_WHITE, alignItems: 'center' }}>
        <StatusBar
          barStyle={STRINGS.DARK_CONTENT}
        />
        <SectionList
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
        />
      </View>
    </Drawer>

  )
}

// export default class extends React.Component() {
//   render() {
//     return <HeadlinesComponent {...this.props} />;
//   }
// }