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
} from 'react-native';
import { LinearGradient } from 'expo';
import Header from '../common/header';
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
            funnyShown: false,
            posts: null,
            details: null
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
            fetch(STRINGS.DAILY_URL + "wp-json/wp/v2/posts?_embed&author=" + authorId).then(e => e.json()),
            fetch(STRINGS.DAILY_URL + "wp-json/tsd/v1/authors/" + authorId).then(e => e.json())
        ]).then(values => this.setState({
            posts: values[0],
            details: values[1]

        }));
    }

    // toggleStatus() {
    //     this.setState({
    //         shown: !this.state.shown
    //     });
    // }

    
    onSwipeRight(gestureState) {

        this.setState({
            funnyShown: !this.state.funnyShown
        })
    }


    render() {
        const defaultImage = 'https://pbs.twimg.com/profile_images/828118030605381636/G3wb0UIB_400x400.jpg'
        return (<View style={{ flex: 1 }}>

            <Header share={true} postID={0} goBack={this.goBack} />
            {!this.state.details && <ActivityIndicator />}
            {this.state.details &&
                <ScrollView style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>

                    <View style={{ flex: 10, margin: 0, backgroundColor: "transparent" }}>

                        {/* Cover photo */}
                        <GestureRecognizer onSwipeRight={(state) => this.onSwipeRight(state)} style={{ flex: 1 }} activeOpacity={.95}>
                            <ImageBackground
                                style={{
                                    flex: 1,
                                    flexDirection: "column",
                                    alignSelf: 'stretch',
                                    width: undefined,
                                    height: undefined,
                                    minHeight: 350
                                }}
                                
                                    source={{ uri: (this.state.funnyShown ? this.state.details.funnyImage : this.state.details.coverImage) || defaultImage} }>
                                {this.state.shown ? <View style={{ flex: 1 }}>
                                }

                                    <View style={{ position: 'absolute', bottom: 0 }}>
                                        <Text style={{
                                            fontSize: 17,
                                            marginLeft: 15, marginRight: 15, marginBottom: 10,
                                            fontFamily: "Hoefler Text", color: "white", lineHeight: 22
                                        }}>
                                            {this.state.details.blurb}
                                        </Text>
                                        <Text style={{
                                            fontSize: 17,
                                            marginLeft: 15, marginRight: 15, marginBottom: 15,
                                            fontFamily: "Hoefler Text", color: "white", fontStyle: "italic", lineHeight: 22
                                        }}>
                                            I'm from: {this.state.details.hometown}
                                            {"\n"}My go-to TAP order is: {this.state.details.tapOrder}
                                            {"\n"}My favorite dining hall is: {this.state.details.diningHall}
                                        </Text>
                                    </View>
                                </View> :

                                    <View style={{ flex: 1, height: '100%' }}></View>}


                            </ImageBackground>

                            {this.state.funnyShown && <View style={{ flex: 1, margin: 8 }}>
                                <Text style={{
                                    fontSize: 15,
                                    fontFamily: "Hoefler Text", color: "black", lineHeight: 17
                                }}>
                                    •  I'm from: {this.state.details.hometown}
                                    {"\n"}•  My go-to TAP order is: {this.state.details.tapOrder}
                                    {"\n"}•  My favorite dining hall is: {this.state.details.diningHall}
                                </Text>
                            </View>}
                            {!this.state.funnyShown && <View style={{ flex: 1, margin: 8 }}>
                                <Text style={{
                                    fontSize: 15,
                                    fontFamily: "Hoefler Text", color: "black", lineHeight: 17
                                }}>
                                    {this.state.details.blurb}
                                </Text>
                            </View>}


                        </GestureRecognizer>

                    </View>

                    <View style={{ flex: 0.1, paddingTop: 1, paddingBottom: 1, backgroundColor: "white", flexDirection: "row" }}>

                        {/* Staff details: name and position */}
                        <View style={{ flex: 3, marginLeft: 20, backgroundColor: "white" }}>
                            <Text style={{ fontSize: 25, fontFamily: "HoeflerText-Black", marginTop: 5, marginBottom: 5 }}>
                                {this.state.details.name}
                            </Text>
                            <Text style={{ fontSize: 18, fontFamily: "Hoefler Text" }}>
                                {/* {this.state.details.section} */}
                            </Text>
                        </View>
                        {/* Article count */}
                        <View style={{
                            flex: 0.85,
                            marginTop: 20,
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
                                {this.state.posts.length}
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
                    { this.state.posts && this.state.posts.map(post=> <View key={post.id} style={{ flex: 0.1, margin: 2, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "gray", flexDirection: "column" }}>

                        <View style={{ flex: 1, marginTop: 1, backgroundColor: "white", flexDirection: "row" }}>
                            <View style={{ flex: 2, padding: 7, aspectRatio: 3 / 2 }}>
                                <Image
                                    style={{
                                        flex: 1,
                                        // resizeMode: 'resize',
                                        alignSelf: 'center',
                                        width: '100%',
                                        height: undefined
                                    }}
                                    source={{uri: (post._embedded && post._embedded["wp:featuredmedia"] && post._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail.source_url) || defaultImage}}
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

                </ScrollView>}


            {/* Fixed footer of social media links (outside of ScrollView) */}
            {this.state.details &&
                <View style={{ padding: 2, height: 30, backgroundColor: "white", flexDirection: "row" }}>

                    <View style={{ flex: 1, margin: 0, backgroundColor: "white" }}>
                    </View>

                    <TouchableHighlight onPress={() => Linking.openURL("mailto:" + this.state.details.email)}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1}}>
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