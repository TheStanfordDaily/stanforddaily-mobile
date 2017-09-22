/**
 * Created by ggoma on 12/17/16.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import HTMLText from '../../modified_modules/react-native-html-to-text';
import Placeholder from './placeholder';
// import Button from './button';

const MEDIA_URL = 'http://stanforddaily.com/wp-json/wp/v2/media/';
const {width, height} = Dimensions.get('window');

export default class NewsFeedItem extends Component {
    constructor() {
        super();
        this._mounted = false;
        this.state = {
          author : "",
          date : "",
          title : "",
          featuredMedia : "",
          description: "",
          loaded: false
        };
    }

    componentDidMount() {
      this._mounted = true;
    }

    componentWillUnmount() {
      this._mounted = false;
    }
    assembleDate(dateObj) {
      var dt = new Date(dateObj);
      var month = dt.getUTCMonth();
      var day = dt.getUTCDate();
      var year = dt.getUTCFullYear();
      return month+1 + '/' + day + '/' + year;
    }

    async fetchData() {
      // console.log(this.props.data.postObj._links.author[0]);
        let authorResponse = await fetch(this.props.data.postObj._links.author[0].href);
        let authorData = await authorResponse.json();
        var author = authorData.name;
        var date = this.assembleDate(this.props.data.postObj.date);
        var title = this.props.data.postObj.title.rendered;
        var description = this.props.data.postObj.excerpt.rendered;
        var featuredMedia = "";
        if(this.props.data.postObj.featured_media !== 0) {
          let featuredMediaResponse = await fetch(MEDIA_URL + this.props.data.postObj.featured_media);
          let featuredMediaData = await featuredMediaResponse.json();
          if(featuredMediaData.media_details.sizes.large !== undefined) {
            featuredMedia = featuredMediaData.media_details.sizes.large.source_url;
          } else if (featuredMediaData.media_details.sizes.medium_large !== undefined) {
            featuredMedia = featuredMediaData.media_details.sizes.medium_large.source_url;
          } else if (featuredMediaData.media_details.sizes.medium !== undefined) {
            featuredMedia = featuredMediaData.media_details.sizes.medium.source_url;
          } else {
            featuredMedia = featuredMediaData.source_url;
          }
        }
        var cut = 130;
        if (description.length > cut) {
          var cut = cut;
          while(cut < 150) {
            if(description.charAt(cut) === ' ') {
              break;
            }
            cut += 1;
          }
        }
        if(this._mounted) {
          this.setState({
            author: author,
            date: date,
            title: title,
            featuredMedia: featuredMedia,
            description: description.substring(0,cut)+'...',
            body: this.props.data.postObj.content.rendered,
            loaded: true
          });
        }
    }

    toPost() {
      // console.log(this.state);
      this.props.onPress(this.state);
    }
    renderContent() {
        this.fetchData();
        if(this.state.loaded) {
          return (
            <TouchableWithoutFeedback onPress={this.toPost.bind(this)}>
              <View style={styles.content}>
              {this.state.featuredMedia !== "" && (
                <View style={styles.imageContainer}>
                  <Image source={{uri: this.state.featuredMedia}} style={styles.image}/>
                </View>)
              }
                <View style={styles.dateAndAuthor}>
                  <Text style={styles.author}> {this.state.author} </Text>
                  <Text style={styles.date}> {this.state.date} </Text>
                </View>
                <HTMLText style={styles.title} html={this.state.title}/>
                <HTMLText containerStyle={{margin:0, padding:0}} style={styles.description} html={this.state.description}/>
              </View>
            </TouchableWithoutFeedback>
          );
        }
        return <Placeholder />;
    }

    render() {
        return (
            this.renderContent()
        )
    }
}

const styles = StyleSheet.create({
    content: {
        borderTopColor: '#DBDBDB',
        borderTopWidth: 1,
        backgroundColor: '#fcfcfc',
        width: '100%',
        // flex: 1
    },

    dateAndAuthor: {
      flexDirection: 'row',
      justifyContent:"space-between",
      marginTop: 2,
      marginLeft: 14,
      marginRight: 14,
    },

    author: {
      fontFamily: 'PT Serif',
      fontSize: 13
    },

    date: {
      fontFamily: 'PT Serif',
      fontSize: 13,
      opacity: 0.60
    },

    title: {
      fontFamily: 'PT Serif',
      fontSize: 32,
      lineHeight: 35,
      marginTop: 4,
      marginLeft: 14,
      marginRight: 14,
    },

    description: {
      fontFamily: 'PT Serif',
      fontSize: 19,
      lineHeight: 23.4,
      marginTop: 8,
      marginBottom: 13,
      opacity: 0.80,
      marginLeft: 14,
      marginRight: 14,
    },

    image: {
      width: width,
      height: width/2,
      marginBottom: 9
    },

    imageContainer: {
      borderTopColor: '#DBDBDB',
      borderTopWidth: 2,
    }
})
