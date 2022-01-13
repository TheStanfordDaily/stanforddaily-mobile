import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { Strings, CategorySlugs, HomeSections, Heights, Margins, Fonts, Alignments, FontSizes, PlatformPalette } from '../constants';
import Separator from '../components/Separator';
import Carousel, { getInputRangeFromIndexes } from 'react-native-snap-carousel';
import { getHomeAsync, getCategoryAsync, getHomeMoreAsync } from '../helpers/wpapi';
import NewsFeedItem from '../components/NewsFeedItem';
import LightboxGallery from '../components/LightboxGallery';
import CategoryHeader from '../components/CategoryHeader';
import CardRow from '../components/CardRow';
import Card from '../components/Card';
import _ from 'lodash';
import { getThumbnailURL, formatDate } from '../helpers/format';
import Column from '../components/Column';

const categoryHome = CategorySlugs[0];
const { width, height } = Dimensions.get('window');

// then(function(data) {
//   // do something with the returned posts
//   console.log(data)
//   return data
// }).catch(function(err) {
//   // handle error
//   console.log(err)
// });

export default function Home(props) {

    const [category, setCategory] = useState(categoryHome);
    const [articles, setArticles] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [allArticles, setAllArticles] = useState([]);

    const _renderRow = ({item, index}) => {
      return (<NewsFeedItem
        key={"article-" + item.id}
        item={item}
        index={index}
        isFeatured={true}
        onPress={ () => props.navigation.navigate(Strings.post, { item: item })}
        onAuthor={ (authorID) => props.navigation.navigate(Strings.author, { authorID: authorID }) }
        />
        );
    };

    const _renderImage = ({item}) => {
      let thumbnailURL
      if (item._embedded["wp:featuredmedia"][0].code) {
        console.log(item._embedded["wp:featuredmedia"][0].data.status);
      } else {
        thumbnailURL = item._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url
      }
      return (
        <LightboxGallery title={item.title.rendered.replaceAll("&#8216;", "\u2018").replaceAll("&#8217;", "\u2019").replaceAll("&#038;", "&")} authors={item._embedded.author[0].name} imageResource={thumbnailURL} date={formatDate(item)} navigation={props.navigation} />
      )
    };
    
    const _renderCardRow = ({item}) => {
      return (
        <Card
          item={item}
          navigation={props.navigation}
          onPress={ () => props.navigation.navigate(Strings.post, { postID: item.id })} 
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
    };

    useEffect(() => {
        (async () => {
          // let newsResults = await getHomeAsync(3);
          // setNewsArticles(newsResults);
          const categories = {"featured": 1485, "news": 3, "theGrind": 32278, "artsAndLife": 25, "sports": 23, "opinions": 24, "humor": 55796, "cartoons": 41527};
          for (const [slug, id] of Object.entries(categories)) {
            let articles = await getHomeAsync(id);
            setAllArticles(allArticles => ({...allArticles, [slug]: slug !== "featured" ? articles.filter(article => !article.categories.includes(1485)) : articles}));
          }

          /*if (category.slug === categoryHome.slug) {
            if (pageNumber === 1) {
              const homeResults = await getHomeAsync();
              // console.log(homeResults);
              const flattenedResults = [];
              const unFlattenedResults = {};
              for (let section of HomeSections) {
                flattenedResults.push(...(homeResults[section] || []));
                unFlattenedResults[section] = homeResults[section]
              }
              setAllArticles(unFlattenedResults);
            } else {
              // setArticles(await getHomeMoreAsync(pageNumber));
            }
          } else {
            const {posts} = await getCategoryAsync([category.slug], pageNumber);
            // setArticles(posts);
          }*/
        })();
      }, [pageNumber, category]);

    return (
        <View style={styles.container}>
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
                    slideInterpolatedStyle={(index, animatedValue, carouselProps) => { return {
                      zIndex: carouselProps.data.length - index,
                      opacity: animatedValue.interpolate({
                          inputRange: [-1, 0, 1],
                          outputRange: index == 1 ? [0, 1, 0.7] : [0, 1, 0],
                          extrapolate: 'clamp'
                        })
                    }}}
                />
                <Separator />
                <CategoryHeader title={'News'} navigation={props.navigation} articles={allArticles['news']} />
                <CardRow
                  data={allArticles["news"]}
                  renderItem={_renderCardRow}
                  title={"News"}
                  onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles["news"], title: 'News', navigation: props.navigation })} 
                />
                <Separator />
                <CategoryHeader title={'Opinions'} navigation={props.navigation} articles={allArticles["opinions"]} />
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
                <CategoryHeader title={'Sports'} navigation={props.navigation} articles={allArticles['sports']} />
                <CardRow
                  data={allArticles['sports']}
                  renderItem={_renderCardRow}
                  title={"Sports"}
                  onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['sports'], title: 'Sports', navigation: props.navigation })}
                />
                <Separator />
                <CategoryHeader title={'Arts & Life'} navigation={props.navigation} articles={allArticles['artAndLife']} />
                <CardRow
                  data={allArticles['artsAndLife']}
                  renderItem={_renderCardRow}
                  title={"Arts & Life"}
                  onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['artsAndLife'], title: 'Arts and Life', navigation: props.navigation })}
                />
                <Separator />
                <CategoryHeader title={'The Grind'} navigation={props.navigation} articles={allArticles['theGrind']} />
                <CardRow
                  data={allArticles['theGrind']}
                  renderItem={_renderCardRow}
                  title={"The Grind"}
                  onPress={ () => props.navigation.navigate(STRINGS.CATEGORY, { data: allArticles['theGrind'], title: 'The Grind', navigation: props.navigation })} 
                />
                <Separator />
                <CategoryHeader title={'Humor'} navigation={props.navigation} articles={allArticles['humor']} />
                <Carousel
                  data={_.chunk(allArticles['humor'], 3)}
                  renderItem={_renderColumn}
                  sliderWidth={width}
                  itemWidth={0.92*width}
                  // containerCustomStyle={{backgroundColor: THEME.SECONDARY_ACCENT}}
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
                <CategoryHeader title={'Cartoons'} />
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
    );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    backgroundColor: '#FFFFFF'
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
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize:25,
    flex: 2,
  },
  categoryLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: width - (2 * Margins.default)
  },
  header: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: Fonts.large + 10,
    // color: THEME.LABEL
  },
  humor: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
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
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    // color: COLORS.WHITE,
    textAlign: 'center',
  }
});