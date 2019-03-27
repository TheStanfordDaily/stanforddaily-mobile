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

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 2 }}>
                                <Image
                                    style={{
                                        flex: 1,
                                        width: undefined,
                                        height: 375
                                    }}
                                    source={{uri: this.state.details.coverImage || DEFAULT_IMAGE}}
                                >
                                </Image>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    fontSize: 16, lineHeight: 18,
                                    margin: 10,
                                    fontFamily: "Hoefler Text", color: "black"
                                }}>
                                    {this.state.details.blurb}
                                </Text>
                            </View>
                        </View>


                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 2 }}>
                                <Image
                                    style={{
                                        flex: 1,
                                        width: undefined,
                                        // height: 325
                                    }}
                                    source={{uri: this.state.details.funnyImage || DEFAULT_IMAGE}}
                                >
                                </Image>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    fontSize: 16, lineHeight: 18,
                                    margin: 10,
                                    fontFamily: "Hoefler Text", color: "black"
                                }}>
                                    {this.state.details.hometown && <React.Fragment>• I'm from: {this.state.details.hometown}{"\n"}</React.Fragment>}
                                    {this.state.details.tapOrder && <React.Fragment>• My go-to TAP order is: {this.state.details.tapOrder}{"\n"}</React.Fragment>}
                                    {this.state.details.diningHall && <React.Fragment>• My favorite dining hall is: {this.state.details.diningHall}</React.Fragment>}
                                </Text>
                            </View>
                        </View>

                    </Swiper>

                </View> }

                {this.state.details &&
                <View style={{ flex: 0.15, paddingBottom: 1, backgroundColor: "white", flexDirection: "row" }}>
                    <TouchableHighlight>
                        <View style={{ flex: 1, flexWrap: "wrap", marginLeft: 20, backgroundColor: "white" }}>
                            <Text style={{ fontSize: 25, fontFamily: "Hoefler Text", marginTop: 5, marginBottom: 5, paddingBottom: 5, marginRight: 10}}>
                                {this.state.details.name} <Text>{""}</Text>
                                {/*<Image
                                    style={{paddingLeft: 20, width: 25, height: 25 }}
                                    source={require('../../media/follow_icon.png')}
                                />*/}
                                </Text>
                            {/* <Text style={{ fontSize: 18, fontFamily: "Hoefler Text" }}>
                                {this.state.details.position}
                            </Text>  */}
                            <FollowButton type="author" id={this.props.navigation.state.params.id} />
                        </View>
                    </TouchableHighlight>
                    

                    <View style={{flex: 0.4 /*to look better on screen*/}}></View> 
                    
                    <View style={{
                        flex: 0.75,
                        height: 59, //needs to be hardcoded or else stretches out if user has no articles
                        marginTop: 0,
                        marginBottom: 15,
                        marginLeft: 2,
                        marginRight: 20,
                        borderWidth: 1,
                        borderColor: "black",
                        backgroundColor: "white"
                    }}>
                        <Text style={{
                            fontSize: 20, fontFamily: "Helvetica", fontWeight: "bold",
                            marginTop: 5, textAlign: "center", textAlignVertical: "center"
                        }}>
                            {this.state.postCount || this.state.posts.length}
                        </Text>
                        <Text style={{
                            fontSize: 13, fontFamily: "Helvetica",
                            marginBottom: 5, textAlign: "center", textAlignVertical: "center"
                        }}>
                            articles
                        </Text>
                    </View>

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


            {this.state.details &&

                <View style={{ padding: 1, height: 35, backgroundColor: "white", flexDirection: "row" }}>

                    <View style={{ flex: 1, margin: 0, backgroundColor: "white"}}>
                    </View>

                    <TouchableHighlight onPress={() => Linking.openURL("mailto:" + this.state.details.email)}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1 }}>
                                <Image
                                    style={{ width: 30, height: 30 }}
                                    source={require('../../media/mail.png')}
                                />
                            </View>
                            <View style={{ flex: 10 }}>
                                <Text style={{ fontSize: 14, fontFamily: "Hoefler Text", fontStyle: 'italic', color: 'black', marginTop: 5, marginBottom: 4, marginLeft: 35 }}>
                                    Email the author   
                                </Text>
                            </View>

                        </View>
                    </TouchableHighlight>
                    <View style={{ flex: 1, margin: 0, backgroundColor: "white" }}>
                    </View>
                </View>}
        </View>
        );
    }
}
