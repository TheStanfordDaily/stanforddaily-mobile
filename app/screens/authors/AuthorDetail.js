import React, { Component } from 'react';
import {
    View,
    StatusBar,
    ScrollView,
    Dimensions,
    Text,
    Image,
    ImageBackground,
    TouchableHighlight,
    Linking,
    ActivityIndicator,
    AppRegistry
} from 'react-native';
import { LinearGradient } from 'expo';
import Header from '../common/header';
import Swiper from 'react-native-swiper';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { FONTS, STRINGS } from "../../assets/constants";
const h2p = require('html2plaintext')

const HTML = (props) => {
    return <Text style={props.style}>{h2p(props.html)}</Text>
}


// export default () => <View style={{ flex: 1 }}>
export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            posts: null,
            details: null
        }
    }

    componentDidMount() {
        let authorId = this.props.navigation.state.params.id;
        Promise.all([
            fetch(STRINGS.DAILY_URL + "wp-json/wp/v2/posts?_embed&author=" + authorId).then(e => e.json()),
            fetch(STRINGS.DAILY_URL + "wp-json/tsd/v1/authors/" + authorId).then(e => e.json())
        ]).then(values => this.setState({
            posts: values[0],
            details: values[1]

        }));
    }
    render() {
        return (<View style={{ flex: 1 }}>

            <Header share={true} postID={0} goBack={this.goBack} />

            <ScrollView style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>

                <View style={{ flex: 1 }}>
                    <Swiper
                        style={{}}
                        height={500}
                        loop={false}
                        showsButtons={true}
                        dotColor='grey'
                        activeDotColor='black'>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 2 }}>
                                <Image
                                    style={{
                                        flex: 1,
                                        width: undefined,
                                        height: 375
                                    }}
                                    source={require('../../media/cover.jpg')}
                                    // source={this.state.details.coverImage}
                                >
                                </Image>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    fontSize: 16, lineHeight: 18,
                                    margin: 10,
                                    fontFamily: "Hoefler Text", color: "black"
                                }}>
                                    Alex Tsai ’21 is a desk editor for The Daily’s University beat. She was born and raised in Hong Kong and moved to La Jolla, CA for high school. Alex is a member of the varsity lacrosse team and is interested in computer science. She is also developing the Daily mobile app. Contact her at aotsai 'at' stanford.edu.
                                    {/* {this.state.details.blurb} */}
                                </Text>
                            </View>
                        </View>


                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 2 }}>
                                <Image
                                    style={{
                                        flex: 1,
                                        width: undefined,
                                        height: 325
                                    }}
                                    source={require('../../media/hoover.jpg')}
                                // source={{uri: this.state.details.funnyImage}}
                                >
                                </Image>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    fontSize: 16, lineHeight: 18,
                                    margin: 10,
                                    fontFamily: "Hoefler Text", color: "black"
                                }}>
                                    • I'm from: La Jolla, CA{"\n"}
                                    • My go-to TAP order is: Waffle fries{"\n"}
                                    • My favorite dining hall is: Casper
                                    {/* • I'm from: {this.state.details.hometown}{"\n"}
                                    • My go-to TAP order is: {this.state.details.tapOrder}{"\n"}
                                    • My favorite dining hall is: {this.state.details.diningHall} */}
                                </Text>
                            </View>
                        </View>

                    </Swiper>

                </View>

                {/* author details */}
                <View style={{ flex: 0.1, paddingBottom: 1, backgroundColor: "white", flexDirection: "row" }}>

                    {/* Staff details: name and position */}
                    <View style={{ flex: 3, marginLeft: 20, backgroundColor: "white" }}>
                        <Text style={{ fontSize: 25, fontFamily: "HoeflerText-Black", marginTop: 5, marginBottom: 5 }}>
                            {/* {this.state.details.name} */}
                            Alexandra Tsai
                            </Text>

                        <Text style={{ fontSize: 18, fontFamily: "Hoefler Text" }}>
                            Desk Editor '21
                            {/* {this.state.details.section} */}
                        </Text>
                    </View>
                    {/* Article count */}
                    <View style={{
                        flex: 0.85,
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
                            48
                </Text>
                        <Text style={{
                            fontSize: 13, fontFamily: "Helvetica",
                            marginBottom: 5, textAlign: "center", textAlignVertical: "center"
                        }}>
                            articles
                </Text>
                    </View>

                </View>


                {/* TODO: populate "recent article list" with data (Vivian) */}
                {this.state.posts && this.state.posts.map(post => <View style={{ flex: 0.1, margin: 2, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "gray", flexDirection: "column" }}>

                    <View style={{ flex: 1, marginTop: 1, backgroundColor: "white", flexDirection: "row" }}>
                        <View style={{ flex: 2, padding: 7, aspectRatio: 3 / 2 }}>
                            <Image
                                style={{
                                    flex: 1,
                                    alignSelf: 'center',
                                    width: '100%',
                                    height: undefined
                                }}
                                source={{ uri: post._embedded && post._embedded["wp:featuredmedia"] && post._embedded["wp:featuredmedia"][0].source_url }}
                            />
                        </View>
                        <View style={{ flex: 3, paddingTop: 20, paddingBottom: 10, paddingLeft: 5, paddingRight: 10 }}>
                            <TouchableHighlight onPress={() => Linking.openURL(post.link)}>
                                <Text style={{ fontSize: 16, fontFamily: "Hoefler Text" }}>
                                    <HTML html={post.title.rendered} />
                                </Text>
                            </TouchableHighlight>
                            <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: 'gray', paddingTop: 5 }}>
                                {new Date(post.date).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                </View>)}

            </ScrollView>


            {/* Fixed footer of social media links (outside of ScrollView) */}
            {this.state.details &&
                <View style={{ padding: 2, height: 35, backgroundColor: "white", flexDirection: "row" }}>

                    <View style={{ flex: 1, margin: 0, backgroundColor: "white" }}>
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