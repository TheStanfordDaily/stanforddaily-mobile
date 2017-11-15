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
import {STRINGS, CONSTANT_NUMS} from '../../assets/constants.js';
import styles from '../styles/newsfeeditem.js';


const {width, height} = Dimensions.get('window');

export default class NewsFeedItem extends Component {
    constructor() {
        //Constructor saying everything is initially empty
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

    //When the item is about to be mounted, we fetch the data about this article from the server
    componentWillMount() {
      this.fetchData();
    }

    //Indicator saying that the item is now being displayed
    componentDidMount() {
      this._mounted = true;
    }

    //Indicator saying that the item was took off the screen
    componentWillUnmount() {
      this._mounted = false;
    }

    //Given a UTC formated date from the WP object, returns a date string in the expected mm/dd/yyyy format
    assembleDate(dateObj) {
      var dt = new Date(dateObj);
      var month = dt.getUTCMonth();
      var day = dt.getUTCDate();
      var year = dt.getUTCFullYear();
      return month+1 + '/' + day + '/' + year;
    }

    //Async fetch data from the WP server
    async fetchData() {
        let authorResponse = await fetch(this.props.data.postObj._links.author[0].href); //A reguest to get author info
        let authorData = await authorResponse.json(); //Author info JSON
        var author = authorData.name; //Author name
        var date = this.assembleDate(this.props.data.postObj.date); //Gets date from the given response
        var title = this.props.data.postObj.title.rendered; //Gets title in HTML from the given response
        var description = this.props.data.postObj.excerpt.rendered; //Gets desc in HTML from the given response
        var featuredMedia = ""; //We assume that there is no featured media till we find one
        if(this.props.data.postObj.featured_media !== 0) {
          let featuredMediaResponse = await fetch(STRINGS.MEDIA_URL + this.props.data.postObj.featured_media);
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
        //Cutting the allowed number of characters for the desc
        var cut = CONSTANT_NUMS.SOFT_DESC_LIMIT;
        if (description.length > cut) {
          var cut = cut;
          while(cut < CONSTANT_NUMS.HARD_DESC_LIMIT) {
            if(description.charAt(cut) === ' ') {
              break;
            }
            cut += 1;
          }
        }
        //If the item is displayed, and we have new data, put it up
        if(this._mounted) {
          this.setState({
            id: this.props.postID,
            author: author,
            date: date,
            title: title,
            featuredMedia: featuredMedia,
            description: description.substring(0,cut)+STRINGS.MORE_TEXT,
            body: this.props.data.postObj.content.rendered,
            loaded: true
          });
        }
    }

    //Handles clicking on items
    toPost() {
      this.props.onPress(this.state);
    }

    //Renders the view:
    //<Clickable to go to post>
    //  if featuredMedia exists, <Image of featured media/>
    // <Date and author/>
    // <Title as HTML Text/>
    // <Description as HTML/>
    //</Clickable>
    renderContent() {
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
                <HTMLText style={styles.description} html={this.state.description}/>
              </View>
            </TouchableWithoutFeedback>
          );
        }
        //If no content is loaded, put a placeholder
        return <Placeholder />;
    }

    render() {
        return (
            this.renderContent()
        )
    }
}
