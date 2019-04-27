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

export default (props) =><View style={{ padding: 1, height: 35, backgroundColor: "white", flexDirection: "row" }}>

<View style={{ flex: 1, margin: 0, backgroundColor: "white"}}>
</View>

<TouchableHighlight onPress={() => Linking.openURL("mailto:" + props.email)}>
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
</View>