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
export default () =><View style={{
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