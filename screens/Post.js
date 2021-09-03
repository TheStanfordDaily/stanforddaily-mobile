import React, { Component } from 'react';
import { View, Dimensions, Text, TouchableWithoutFeedback, Image } from 'react-native';
import { getThumbnailURL, formatDate } from '../helpers/format';
import { getPostByIdAsync } from '../helpers/wpapi';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import HTML from '../components/HTML';
import { Margins, Strings } from '../constants';
import RenderHTML from 'react-native-render-html';

const { width, height } = Dimensions.get('window');

export default class Post extends Component {
    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
        this.state = {
          item: null,
          width: width <= height ? width : height,
          height: Dimensions.get('window').height,
        }
        Dimensions.addEventListener('change', () => {
          const { width, height } = Dimensions.get('window')
          this.setState({ width: width <= height ? width : height, height: height });
          // console.warn("orientation changed");
        });
      }

    // A function that triggers going back to headlines
    goBack() {
        this.props.navigation.goBack();
    }

    async componentDidMount() {
        const { postID } = this.props.route.params;
        let item = await getPostByIdAsync(postID);
        this.setState({ item });
        // Amplitude.logEvent(STRINGS.ARTICLE_FULL_LOADED, { ArticleId: postID });
    }

    createMarkup(text) {
        return text;
        // todo: HTML purify this if needed.
      }

    render() {
        const { item } = this.state;
        if (!item) {
            return <View></View>;
        }
        const { id, postTitle, postSubtitle, thumbnailInfo, postContent } = item;
        const { caption } = thumbnailInfo || {};
        const thumbnailURL = getThumbnailURL(item);
        return (
        <View style={{ flex: 1 }}>
            <ImageHeaderScrollView
              headerImage={{uri: getThumbnailURL(item)}}
              maxOverlayOpacity={0.75}
              minOverlayOpacity={0.5}
              fadeOutForeground
              maxHeight={240}
              minHeight={0}
              renderForeground={() => (
                <View style={{ height: 150, justifyContent: "center", alignItems: "center" }} >
                    <Text style={{ color: "white" }}>{postTitle}</Text>
                </View>
              )}
            >
              <View style={{ marginHorizontal: Margins.articleSides }}>
                { caption !== 0 &&
                  <Text>{caption}</Text>
                }
                { postSubtitle !== 0 &&
                  <Text>{postSubtitle}</Text>
                }
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', maxWidth: 2*width/3, flexWrap: 'wrap' }}><Text>By </Text>{item.tsdAuthors.map((info, i) => <TouchableWithoutFeedback onPress = {()=>{this.props.navigation.navigate(Strings.author, { authorID: item.tsdAuthors[i].id })}}><Text>{info.displayName}{i < item.tsdAuthors.length - 2 ? ', ' : i == item.tsdAuthors.length - 1 ? '' : ' and '}</Text></TouchableWithoutFeedback>)}</View>
                    <Text>{formatDate(item)}</Text>
                  </View>
                  <Text>{item.tsdCategories[0].name}</Text>
                    
                </View>
                {postContent !== 0 &&
                  <RenderHTML source={{html: postContent}} contentWidth={width} />
                }
              </View>
            </ImageHeaderScrollView>
        </View>
        )
    }
}