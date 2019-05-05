import React, { Component } from 'react';
import {
    Alert,
    View,
    StatusBar,
    ScrollView,
    Dimensions,
    Text,
    Image,
    ImageBackground,
    TouchableHighlight,
    TouchableOpacity,
    Linking,
    ActivityIndicator,
    AppRegistry
} from 'react-native';
import Header from '../common/header';
import Swiper from 'react-native-swiper';
import { FONTS, STRINGS, DEFAULT_IMAGE } from "../../assets/constants";
import _ from "lodash";
import HTML from '../../HTML';
import FollowButton from '../common/FollowButton';
import InitialDetails from './InitialDetails';
import Introduction from './Introduction';
import Formatting from './Formatting';
import Email from './Estopmail';
import Name from './Name';

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            posts: null,
            details: null,
            postCount: null
        }
    }

    toggleStatus() {
        this.setState({
            shown: !this.state.shown
        });
    }

    componentDidMount() {
        this.fetchAuthor(this.props.navigation.state.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params.id) {
            this.setState({posts: [], details: []});
          this.fetchAuthor(nextProps.navigation.state.params.id);
        }
      }

    fetchAuthor(authorId) {
        Promise.all([
            // Todo: post pagination
            fetch(STRINGS.DAILY_URL + "wp-json/wp/v2/posts?_embed&per_page=100&author=" + authorId).then(e => {
                this.setState({
                    postCount: e.headers["X-WP-Total"]
                })
                return e.json();
            }),
            fetch(STRINGS.DAILY_URL + "wp-json/tsd/v1/authors/" + authorId).then(e => e.json())
        ]).then(values => this.setState({
            posts: values[0],
            details: values[1]
        }));
    }



    render() {

        return (<View style={{ flex: 1 }}>

            <Header share={true} authorID={this.props.navigation.state.params.id} goBack={() => this.props.navigation.goBack()} />

            <ScrollView style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
                {!this.state.details && <ActivityIndicator />}
                {this.state.details && !!this.state.details.coverImage &&
                <View style={{ flex: 1 }}>
                    <Swiper
                        style={{}}
                        height={500}
                        loop={false}
                        showsButtons={true}
                        nextButton={<Text style={{marginBottom: 180, color: 'maroon', fontSize: 50,}}>›</Text>}
                        prevButton={<Text style={{marginBottom: 180, color: 'maroon', fontSize: 50,}}>‹</Text>}
                        dotColor='gray'
                        activeDotColor='maroon'>

                        <InitialDetails details = {this.state.details} />


                        <Introduction details = {this.state.details} />
                    </Swiper>

                </View> }

                {this.state.details &&
                <View style={{ flex: 0.15, paddingBottom: 1, backgroundColor: "white", flexDirection: "row" }}>
                    <Name details = {this.state.details} id = {this.props.navigation.state.params.id} />
                    

                    <View style={{flex: 0.4 /*to look better on screen*/}}></View> 
                    <Formatting details />
                    </View>}

                {this.state.posts && this.state.posts.map(post => <View key={post.id} style={{ flex: 0.1, margin: 2, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "gray", flexDirection: "column" }}>

                    <View style={{ flex: 1, marginTop: 1, backgroundColor: "white", flexDirection: "row" }}>
                        <View style={{ flex: 2, padding: 7, aspectRatio: 3 / 2 }}>
                            <Image
                                style={{
                                    flex: 1,
                                    alignSelf: 'center',
                                    width: '100%',
                                    height: undefined
                                }}
                                source={{uri: _.get(post, "_embedded.wp:featuredmedia.0.media_details.sizes.thumbnail.source_url", DEFAULT_IMAGE) }}
                            />
                        </View>
                        <View style={{ flex: 3, paddingTop: 20, paddingBottom: 10, paddingLeft: 5, paddingRight: 10 }}>
                            <TouchableHighlight onPress={() => this.props.navigation.navigate(STRINGS.POST, { postID: post.id })}>
                                <HTML baseFontStyle={{ fontSize: 16, fontFamily: "Hoefler Text" }} html={post.title.rendered} />
                            </TouchableHighlight>
                            <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: 'gray', paddingTop: 5 }}>
                                {new Date(post.date).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                </View>)}

            </ScrollView>


            {this.state.details && <Email email = {this.state.details.email} />}
        </View>
        );
    }
}
