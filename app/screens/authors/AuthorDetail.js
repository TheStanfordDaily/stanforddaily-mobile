import React, { Component } from 'react';
import {
    View,
    StatusBar,
    ScrollView,
    Dimensions,
    Text,
    Image,
    TouchableHighlight,
    Linking
} from 'react-native';
import Header from '../common/header';
import HTML from "react-native-render-html";
import FONTS from "../../assets/constants";

export default () => <View style={{ flex: 1 }}>
    <Header share={true} postID={0} goBack={this.goBack} />

    <ScrollView style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>

        <View style={{ flex: 10, margin: 0, backgroundColor: "blue" }}>
            <Image
                style={{
                    flex: 1,
                    alignSelf: 'stretch',
                    width: undefined,
                    height: undefined
                }}
                source={require('../../media/cover.jpg')}
            />
        </View>

        <View style={{ flex: 0.2, margin: 0, backgroundColor: "white", flexDirection: "row" }}>
            <View style={{ flex: 1, margin: 0, backgroundColor: "white" }}>
                <Image
                    style={{ width: 100, height: 100 }}
                    source={require('../../media/bitmoji.png')}
                />
            </View>
            <View style={{ flex: 2.5, marginTop: 20, marginLeft: 20, backgroundColor: "white" }}>
                <Text style={{ fontSize: 30, fontFamily: "Bodoni 72", fontWeight: "bold", marginTop: 5, marginLeft: 5 }}>
                    Alex Tsai
                </Text>
                <Text style={{ fontSize: 20, fontFamily: "Bodoni 72", marginLeft: 5 }}>
                    Desk editor '21
                </Text>
            </View>
            <View style={{ 
                flex: 1, 
                marginTop: 20,
                marginBottom: 20,
                marginLeft: 15,
                marginRight: 15,
                borderWidth: 1,
                borderColor: "black",
                backgroundColor: "white"
                }}>
                <Text style={{ fontSize: 22, fontFamily: "Helvetica", fontWeight: "bold",
                    marginTop: 5, textAlign: "center", textAlignVertical: "center" }}>
                    48
                </Text>
                <Text style={{ fontSize: 18, fontFamily: "Helvetica",
                    margin: -2, textAlign: "center", textAlignVertical: "center" }}>
                    articles
                </Text>
            </View>

        </View>

        {/* <Image style={{ width: "100%", height: 200, marginVertical: 5 }} source={{ uri: this.state.featuredMedia }} /> */}

        <View style={{ flex: 4, margin: 10, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "gray"}}>
            <Text style={{margin: 10}}>Recent articles here ––</Text>
        </View>

        <View style={{ flex: 0.2, margin: 0, backgroundColor: "white", flexDirection: "row" }}>

            <View style={{ flex: 4, margin: 0, backgroundColor: "white" }}>
            </View>

            <View style={{ flex: 1, margin: 0, backgroundColor: "white" }}>
                <TouchableHighlight onPress={() => Linking.openURL("mailto:aotsai@stanford.edu")}>
                    <Image
                        style={{ width: 30, height: 30 }}
                        source={require('../../media/mail.png')}
                    />
                </TouchableHighlight>
            </View>

            <View style={{ flex: 1, margin: 0, backgroundColor: "white" }}>
                <TouchableHighlight onPress={() => Linking.openURL("http://www.facebook.com")}>
                    <Image
                        style={{ width: 30, height: 30 }}
                        source={require('../../media/facebook.png')}
                    />
                </TouchableHighlight>
            </View>

            <View style={{ flex: 1, margin: 0, backgroundColor: "white" }}>
                <TouchableHighlight onPress={() => Linking.openURL("http://www.twitter.com")}>
                    <Image
                        style={{ width: 30, height: 30 }}
                        source={require('../../media/twitter.jpg')}
                    />
                </TouchableHighlight>
            </View>

            <View style={{ flex: 1, margin: 0, backgroundColor: "white" }}>
                <TouchableHighlight onPress={() => Linking.openURL("http://www.instagram.com")}>
                    <Image
                        style={{ width: 30, height: 30 }}
                        source={require('../../media/instagram.png')}
                    />
                </TouchableHighlight>
            </View>

            <View style={{ flex: 1, margin: 0, backgroundColor: "white" }}>
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

    </ScrollView>

</View>;


