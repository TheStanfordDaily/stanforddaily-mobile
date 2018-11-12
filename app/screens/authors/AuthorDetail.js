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
    Switch
} from 'react-native';
import { LinearGradient } from 'expo';
import Header from '../common/header';
import HTML from "react-native-render-html";
import FONTS from "../../assets/constants";

// export default () => <View style={{ flex: 1 }}>
export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            shown: false
        }
    }

    toggleStatus() {
        this.setState({
            shown: !this.state.shown
        });
    }

    render() {
        return (<View style={{ flex: 1 }}>

            <Header share={true} postID={0} goBack={this.goBack} />

            <ScrollView style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>

                <View style={{ flex: 10, margin: 0, backgroundColor: "transparent" }}>

                    {/* Cover photo */}
                    <TouchableHighlight onPress={() => this.toggleStatus()} style={{ flex: 1 }} activeOpacity={.95}>
                        <ImageBackground
                            style={{
                                flex: 1,
                                flexDirection: "column",
                                alignSelf: 'stretch',
                                width: undefined,
                                height: undefined,
                                minHeight: 350
                            }}
                            source={require('../../media/cover.jpg')} >

                            {this.state.shown ? <View style={{ flex: 1 }}>

                                <LinearGradient
                                    colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
                                    style={{
                                        flex: 1,
                                        width: '100%',
                                        height: '100%',
                                        alignSelf: 'stretch',
                                    }} >
                                </LinearGradient>

                                <View style={{ position: 'absolute', bottom: 0 }}>
                                    <Text style={{ 
                                        fontSize: 17, 
                                        marginLeft: 15, marginRight: 15, marginBottom: 10, 
                                        fontFamily: "Hoefler Text", color: "white", lineHeight: 22 }}>
                                        Hi! I'm Alex and I'm a desk editor for The Daily's University beat. I'm a member of the varsity lacrosse
                                        team and I'm interested in computer science!
                                    </Text>
                                    <Text style={{ 
                                        fontSize: 17, 
                                        marginLeft: 15, marginRight: 15, marginBottom: 15, 
                                        fontFamily: "Hoefler Text", color: "white", fontStyle: "italic", lineHeight: 22 }}>
                                        I'm from: La Jolla, CA
                                        {"\n"}I've been at The Daily for: 2 years
                                        {"\n"}My go-to TAP order is: waffle fries
                                        {"\n"}My favorite dining hall is: Casper
                                    </Text>
                                </View>
                            </View> :
                            
                            <View style={{ flex: 1, height: '100%' }}></View>}


                        </ImageBackground>
                    </TouchableHighlight>

                </View>

                {/* Bitmoji */}
                <View style={{ flex: 0.1, paddingTop: 1, paddingBottom: 1, backgroundColor: "white", flexDirection: "row" }}>
                    <View style={{ marginBottom: 10, backgroundColor: "white", position: "absolute" }}>
                        <Image
                            style={{ marginLeft: 10, marginTop: 5, width: 73, height: 73 }}
                            source={require('../../media/bitmoji.png')}
                        />
                    </View>
                    {/* Staff details: name and position */}
                    <View style={{ flex: 3, marginTop: 20, marginLeft: 100, backgroundColor: "white" }}>
                        <Text style={{ fontSize: 25, fontFamily: "HoeflerText-Black", marginTop: 5, marginLeft: 5 }}>
                            Alex Tsai
                        </Text>
                        <Text style={{ fontSize: 18, fontFamily: "Hoefler Text", marginLeft: 5 }}>
                            Desk editor '21
                </Text>
                    </View>
                    {/* Article count */}
                    <View style={{
                        flex: 0.85,
                        marginTop: 20,
                        marginBottom: 10,
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
                <View style={{ flex: 0.1, margin: 10, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "gray", paddingTop: 7, flexDirection: "column" }}>

                    <View style={{ flex: 1, marginTop: 1, backgroundColor: "white", flexDirection: "row" }}>
                        <View style={{ flex: 2, padding: 7, aspectRatio: 3/2 }}>
                            <Image
                                style={{
                                    flex: 1,
                                    resizeMode: 'resize',
                                    alignSelf: 'center',
                                    width: '100%',
                                    height: undefined
                                }}
                                source={require('../../media/football.jpg')}
                            />
                        </View>
                        <View style={{ flex: 3, paddingTop: 20, paddingBottom: 10, paddingLeft: 5, paddingRight: 10 }}>
                            <TouchableHighlight onPress={() => Linking.openURL("https://www.stanforddaily.com/2018/10/22/stanford-concussion-education-initiative-partners-with-pop-warner/")}>
                                <Text style={{ fontSize: 16, fontFamily: "Hoefler Text" }}>
                                    Stanford concussion education initiative partners with Pop Warner
                                </Text>
                            </TouchableHighlight>
                            <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: 'gray', paddingTop: 5 }}>
                                October 22, 2018
                                </Text>
                        </View>
                    </View>


                    <View style={{ flex: 1, marginTop: 1, backgroundColor: "white", flexDirection: "row" }}>
                        <View style={{ flex: 2, padding: 7, aspectRatio: 3/2 }}>
                            <Image
                                style={{
                                    flex: 1,
                                    resizeMode: 'resize',
                                    alignSelf: 'center',
                                    width: '100%',
                                    height: undefined
                                }}
                                source={require('../../media/hoover.jpg')}
                            />
                        </View>
                        <View style={{ flex: 3, paddingTop: 20, paddingBottom: 10, paddingLeft: 5, paddingRight: 10 }}>
                            <TouchableHighlight onPress={() => Linking.openURL("https://www.stanforddaily.com/2018/01/18/at-hoover-rex-tillerson-advocates-maintaining-u-s-presence-in-syria/")}>
                                <Text style={{ fontSize: 16, fontFamily: "Hoefler Text" }}>
                                    At Hoover, Rex Tillerson advocates maintaining U.S. presence in Syria
                                </Text>
                            </TouchableHighlight>
                            <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: 'gray', paddingTop: 5 }}>
                                January 18, 2018
                                </Text>
                        </View>
                    </View>

                </View>

            </ScrollView>


            {/* Fixed footer of social media links (outside of ScrollView) */}
            <View style={{ margin: 0, backgroundColor: "white", flexDirection: "row" }}>

                <View style={{ flex: 4, margin: 0, backgroundColor: "white" }}>
                </View>

                <View style={{ flex: 1, margin: 2, backgroundColor: "white" }}>
                    <TouchableHighlight onPress={() => Linking.openURL("mailto:aotsai@stanford.edu")}>
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require('../../media/mail.png')}
                        />
                    </TouchableHighlight>
                </View>

                <View style={{ flex: 1, margin: 2, backgroundColor: "white" }}>
                    <TouchableHighlight onPress={() => Linking.openURL("http://www.facebook.com")}>
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require('../../media/facebook.png')}
                        />
                    </TouchableHighlight>
                </View>

                <View style={{ flex: 1, margin: 2, backgroundColor: "white" }}>
                    <TouchableHighlight onPress={() => Linking.openURL("http://www.twitter.com")}>
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require('../../media/twitter.jpg')}
                        />
                    </TouchableHighlight>
                </View>

                <View style={{ flex: 1, margin: 2, backgroundColor: "white" }}>
                    <TouchableHighlight onPress={() => Linking.openURL("http://www.instagram.com")}>
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require('../../media/instagram.png')}
                        />
                    </TouchableHighlight>
                </View>

                <View style={{ flex: 1, margin: 2, backgroundColor: "white" }}>
                    <TouchableHighlight onPress={() => Linking.openURL("http://www.linkedin.com")}>
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require('../../media/linkedin.jpg')}
                        />
                    </TouchableHighlight>
                </View>

                <View style={{ flex: 4, margin: 0, backgroundColor: "white" }}>
                </View>
            </View>

            {/* </View>; */}
        </View>
        );
    }
}