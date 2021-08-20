import React, { Component } from 'react';
import { View, Dimensions, Text, Image } from 'react-native';
import { getThumbnailURL } from '../helpers/format';
import { getPostByIdAsync } from '../helpers/wpapi';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import HTML from '../components/HTML';
import { Margins } from '../constants';
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
            <ImageHeaderScrollView maxOverlayOpacity={0.75} minOverlayOpacity={0.5} fadeOutForeground maxHeight={240} minHeight={0}>
              <View>
                {postContent !== 0 &&
                    <RenderHTML source={{html: postContent}} contentWidth={width} />
                }
              </View>
            </ImageHeaderScrollView>
        </View>
        )
    }
}