import React, { Component } from 'react';
import { View, Dimensions, Text, StatusBar, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { getThumbnailURL, formatDate, normalize } from '../helpers/format';
import { getPostByIdAsync } from '../helpers/wpapi';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import { Margins, Strings } from '../constants';
import Content, { defaultSystemFonts } from 'react-native-render-html';
import { FontSizes } from '../constants';
import { WebView } from 'react-native-webview';
import iframe from '@native-html/iframe-plugin';
import Byline from '../components/Byline';
import { decode } from 'html-entities';

const renderers = { iframe }
const { width, height } = Dimensions.get('window');
const systemFonts = [...defaultSystemFonts, 'MinionProDisp', 'MinionProBoldDisp', 'MinionProRegular', 'MinionProItDisp'];

export default function Post(props) {

    // A function that triggers going back to headlines
    const goBack = () => {
        props.navigation.goBack();
    }

    const createMarkup = (text) => {
        return text;
        // todo: HTML purify this if needed.
    }

        // console.log(props.route.params)
        // put the margin top for title becauase on phones with the notch it looks off center. Gotta find the right numbers on that an a dynamic implementation
        
        // const inferred = new Intl.DateTimeFormat(undefined, { year: 'numeric', day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' })
        const { item } = props.route.params
        const { id, title, subtitle, date, parsely, _embedded, thumbnailInfo, content } = item;
        let thumbnailURL
        let caption
        if (_embedded["wp:featuredmedia"][0].code) {
          console.log(_embedded["wp:featuredmedia"][0].data.status);
        } else {
          thumbnailURL = _embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url
          caption = _embedded["wp:featuredmedia"][0].caption
        }
        return (
        <View style={{ flex: 1 }}>
          <StatusBar barStyle={Platform.OS === "ios" ? "light-content": "dark-content"} />
            <ImageHeaderScrollView
              headerImage={{uri: thumbnailURL}}
              maxOverlayOpacity={0.75}
              minOverlayOpacity={0.6}
              fadeOutForeground
              maxHeight={thumbnailURL ? 270 : 0}
              minHeight={Platform.OS === 'ios' ? 91 : 0}
              renderForeground={() => (
                <View style={{ height: "100%", alignItems: 'center', justifyContent: "center", }} >
                    <Content source={{html: title.rendered}} systemFonts={systemFonts} tagsStyles={{body: { color: "white", fontWeight: "600", fontFamily: "MinionProBoldDisp", paddingHorizontal: Margins.articleSides, marginTop: 20, fontSize: normalize(FontSizes.large), textShadowColor: 'black', textShadowRadius: 1, textShadowOffset: {width: 1, height: 1}, textAlign: 'center' }}} />
                </View>
              )}
            >
              
              <View style={{ marginHorizontal: Margins.articleSides, paddingTop: 0 }}>
                
                
                {/* <View style={{flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginTop: Margins.defaultSmall}}> */}
                           <Content source={{html: caption.rendered}} systemFonts={systemFonts} tagsStyles={{body: styles.caption, fontFamily: "MinionProItDisp"}}/>

  
                  <TriggeringView style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    
                    <View style={{flex: 1, flexDirection: 'column'}}>
                    
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.byline}>By </Text>
                      <Byline style={styles.author} names={item.parsely.meta.creator} identifiers={item.coauthors} />
                    </View>
                    <Text style={styles.copy}>{new Date(date).toLocaleString('en-us', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.category}><Text style={{fontFamily: "LibreFranklinBold"}}>{decode(_embedded["wp:term"][0][0].name)}</Text></TouchableOpacity>
                  
                  </TriggeringView>
                {/* </View> */}
                
                
                {/* {subtitle && <Text style={styles.copy}>{subtitle.rendered}</Text>} */}
                <Content renderers={renderers} renderersProps={{ iframe: { scalesPageToFit: true } }} WebView={WebView} systemFonts={systemFonts} source={{html: content.rendered + "<br>"}} tagsStyles={tagStyles} />
                {/* <Text style={styles.copy}>{content.rendered}</Text> */}
                </View>
           
            </ImageHeaderScrollView>
        </View>
        )
    
}

const styles = StyleSheet.create({
  copy: {
    // marginHorizontal: Margins.articleSides,
    fontFamily: "LibreFranklinRegular",
    fontSize: FontSizes.small,
    // color: THEME.LABEL
  },
  caption: {
    // marginHorizontal: Margins.articleSides,
    fontFamily: "MinionProItDisp",
    fontSize: FontSizes.small,
    // fontStyle: 'italic'
    // color: THEME.LABEL
  },
  byline: {
    marginTop: Margins.defaultSmall,
    // marginLeft: Margins.articleSides,
    fontFamily: "LibreFranklinRegular", // Looking for semibold option. Ditto for category button.
    fontSize: FontSizes.default,
  },
  author: {
    marginTop: Margins.defaultSmall,
    // marginHorizontal: Margins.articleSides,
    fontFamily: "LibreFranklinBold",
    fontSize: FontSizes.default,
    color: "#8c1515",
    fontWeight: "600"
    // color: THEME.LABEL
  },
  category: {
    marginTop: Margins.defaultSmall,
    // marginHorizontal: Margins.articleSides,
    fontFamily: "MinionProDisp",
    fontSize: FontSizes.default,
    fontWeight: "600",
    color: "black",
    backgroundColor: "#D8D8D8",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    // color: THEME.LABEL
  },
})

const tagStyles = {
  body: {
    whiteSpace: 'normal',
    fontSize: FontSizes.smallMedium,
    fontFamily: "MinionProRegular"
  },
  a: {
    color: '#8c1515',
    textDecorationColor: '#8c1515'
    // need to change the underline offset somehow
  }
}