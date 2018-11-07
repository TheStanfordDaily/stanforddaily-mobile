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

        <View style={{ flex: 6, margin: 0, backgroundColor: "blue" }}>
            <Text>PICTURE GOES HERE</Text>
        </View>

        <View style={{ flex: 1, margin: 0, backgroundColor: "red" }}>
            <Text>Alex Tsai</Text>
            <Text>Desk editor '21</Text>
        </View>

        {/* <Image style={{ width: "100%", height: 200, marginVertical: 5 }} source={{ uri: this.state.featuredMedia }} /> */}

        <View style={{ flex: 4, margin: 0, backgroundColor: "yellow" }}>
            <Text>test content</Text>
        </View>

        <View style={{ flex: 0.5, margin: 0, backgroundColor: "green" , flexDirection: "row"}}>
            <View style={{ flex: 1, margin: 0, backgroundColor: "red" }}>
                <TouchableHighlight onPress={() => Linking.openURL("http://www.facebook.com")}>
                    <Image
                        style={{ width: 30, height: 30 }}
                        source={require('../../media/facebook.png')}
                    />
                </TouchableHighlight>
            </View>
            <View style={{ flex: 1, margin: 0, backgroundColor: "green" }}>
                <TouchableHighlight onPress={() => Linking.openURL("http://www.facebook.com")}>
                    <Image
                        style={{ width: 30, height: 30 }}
                        source={require('../../media/facebook.png')}
                    />
                </TouchableHighlight>
            </View>
        </View>

    </ScrollView>

</View>;


