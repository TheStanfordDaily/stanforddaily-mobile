import React, { Component } from 'react';
import { View, Dimensions, Text, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { getThumbnailURL, formatDate, relativeDate, normalize } from '../helpers/format';
import { getPostByIdAsync } from '../helpers/wpapi';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import HTML from '../components/HTML';
import { Margins, Strings } from '../constants';
import RenderHtml from 'react-native-render-html';
import { FontSizes } from '../constants';

const { width, height } = Dimensions.get('window');

export default function Post(props) {

    // A function that triggers going back to headlines
    const goBack = () => {
        props.navigation.goBack();
    }

    const createMarkup = (text) => {
        return text;
        // todo: HTML purify this if needed.
    }

        console.log(props.route.params)
        
        const inferred = new Intl.DateTimeFormat(undefined, { year: 'numeric', day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' })
        const { item } = props.route.params
        const { id, title, subtitle, date, _embedded, thumbnailInfo, content } = item;
        const { caption } = thumbnailInfo || {};
        let thumbnailURL
        if (_embedded["wp:featuredmedia"][0].code) {
          console.log(_embedded["wp:featuredmedia"][0].data.status);
        } else {
          thumbnailURL = _embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url
        }
        return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ImageHeaderScrollView
              headerImage={{uri: thumbnailURL}}
              maxOverlayOpacity={0.75}
              minOverlayOpacity={0.6}
              fadeOutForeground
              maxHeight={thumbnailURL ? 240 : 0}
              minHeight={0}
              renderForeground={() => (
                <View style={{ height: "100%", alignItems: 'center', justifyContent: "center", }} >
                    <Text style={{ color: "white", fontWeight: "600", fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", paddingHorizontal: Margins.articleSides, fontSize: normalize(FontSizes.large), textShadowColor: 'black', textShadowRadius: 1, textShadowOffset: {width: 1, height: 1}, textAlign: 'center' }}>{title.rendered.replaceAll("&#8216;", "\u2018").replaceAll("&#8217;", "\u2019").replaceAll("&#038;", "&")}</Text>
                </View>
              )}
            >
              <View style={{ marginHorizontal: Margins.articleSides, paddingTop: 10 }}>
                
                
                {/* <View style={{flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginTop: Margins.defaultSmall}}> */}
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.byline}>By </Text>
                      <Text style={styles.author}>{_embedded.author[0].name}</Text>
                    </View>
                    <Text style={styles.copy}>{inferred.format(Date.parse(date))}</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.category}><Text style={{fontFamily: Platform.OS === "ios" ? "Georgia": "serif", fontWeight: "600"}}>Health</Text></TouchableOpacity>
                  </View>
                {/* </View> */}
                
                
                {/* ({subtitle && <Text style={styles.copy}>{subtitle.rendered}</Text>}) */}
                <RenderHtml source={{html: content.rendered + "<br>"}} tagsStyles={tagsStyles} />
                {/* <Text style={styles.copy}>{content.rendered}</Text> */}
              </View>
            </ImageHeaderScrollView>
        </View>
        )
    
}

const styles = StyleSheet.create({
  copy: {
    // marginHorizontal: Margins.articleSides,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: FontSizes.default,
    // color: THEME.LABEL
  },
  byline: {
    marginTop: Margins.defaultSmall,
    // marginLeft: Margins.articleSides,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: FontSizes.default,
  },
  author: {
    marginTop: Margins.defaultSmall,
    // marginHorizontal: Margins.articleSides,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: FontSizes.default,
    color: "#8c1515",
    fontWeight: "600"
    // color: THEME.LABEL
  },
  category: {
    marginTop: Margins.defaultSmall,
    // marginHorizontal: Margins.articleSides,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: FontSizes.default,
    fontWeight: "600",
    color: "black",
    backgroundColor: "#B6B1A9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    // color: THEME.LABEL
  },
})

const tagsStyles = {
  body: {
    whiteSpace: 'normal',
    fontSize: FontSizes.medium,
    fontFamily: 'Georgia'
  },
  a: {
    color: '#8c1515',
    textDecorationColor: '#8c1515'
  }
}