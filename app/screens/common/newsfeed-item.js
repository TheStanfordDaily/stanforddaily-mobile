import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native';
import Placeholder from './placeholder';
import {STRINGS, CONSTANT_NUMS} from '../../assets/constants.js';
import styles from '../styles/newsfeeditem';
import _ from "lodash";
import HTML from '../../HTML';


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

    chooseMediaSize = async () => {
      let featuredMediaData = await (await fetch(STRINGS.MEDIA_URL + this.props.data.postObj.featured_media)).json();
      return {url: _.get(featuredMediaData, "media_details.sizes.medium_large.source_url", ""), caption: _.get(featuredMediaData, "caption.rendered", "")};
    }

    //Async fetch data from the WP server
    async fetchData() {
        let authorResponse = await fetch(this.props.data.postObj._links.author[0].href); //A reguest to get author info
        let authorData = await authorResponse.json(); //Author info JSON
        var author = authorData.name; //Author name
        var authorID = authorData.id;
        var date = new Date(this.props.data.postObj.date).toLocaleDateString(); //Gets date from the given response
        var title = this.props.data.postObj.title.rendered; //Gets title in HTML from the given response
        var description = this.props.data.postObj.excerpt.rendered; //Gets desc in HTML from the given response
        var featuredMediaObject = await this.chooseMediaSize();
        //Cutting the allowed number of characters for the desc
        var cut = this.props.context === STRINGS.HEADLINES ? CONSTANT_NUMS.SOFT_DESC_LIMIT : CONSTANT_NUMS.SOFT_SEARCH_DESC_LIMIT;
        var hardLimit = this.props.context === STRINGS.HEADLINES ? CONSTANT_NUMS.HARD_DESC_LIMIT : CONSTANT_NUMS.HARD_SEARCH_DESC_LIMIT;
        if (description.length > cut) {
          while(cut < hardLimit) {
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
            authorID: authorID,
            date: date,
            title: title,
            featuredMedia: featuredMediaObject.url,
            featuredMediaCaption: featuredMediaObject.caption,
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

    toAuthor() {
      this.props.onAuthorPress(this.state.authorID);
    }

    //Renders the view:
    //<Clickable to go to post>
    //  if featuredMedia exists, <Image of featured media/>
    // <Date and author/>
    // <Title as HTML Text/>
    // <Description as HTML/>
    //</Clickable>
    headlinesView() {
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
              <TouchableOpacity onPress = {()=>this.toAuthor()}>
                  <Text style={styles.author}> {this.state.author} </Text>
                  </TouchableOpacity>
                <Text style={styles.date}> {this.state.date} </Text>

              </View>
              <HTML containerStyle={styles.titleContainer} baseFontStyle={styles.titleFont} html={this.state.title}/>
              <HTML containerStyle={styles.descriptionContainer} baseFontStyle={styles.descriptionFont} html={this.state.description}/>
            </View>
          </TouchableWithoutFeedback>
        );
      }
      //If no content is loaded, put a placeholder
      return <Placeholder />;
    }

    searchView() {
      if(this.state.loaded) {
        return (
          <TouchableWithoutFeedback onPress={this.toPost.bind(this)}>
            <View style={styles.searchContainer}>
              <View style={[styles.searchContent, {flex: 1}]}>
                <View style={styles.searchDateAndAuthor}>
                  <TouchableOpacity onPress = {()=>this.toAuthor()}>
                  <Text style={styles.author}> {this.state.author} </Text>
                  </TouchableOpacity>
                  <Text style={styles.date}> {this.state.date} </Text>
                  
                </View>
                <HTML containerStyle={styles.searchTitle} html={this.state.title}/>
                <HTML containerStyle={styles.searchDescription} html={this.state.description}/>
              </View>
              {this.state.featuredMedia !== "" &&
                  <Image source={{uri: this.state.featuredMedia}} style={styles.searchImage}/>
              }
            </View>
          </TouchableWithoutFeedback>
        );
      }
      return null;
    }

    renderContent() {
        if(this.props.context === STRINGS.SEARCH) {
          return this.searchView();
        } else {
          return this.headlinesView();
        }
    }

    render() {
        return (
            this.renderContent()
        )
    }
}
