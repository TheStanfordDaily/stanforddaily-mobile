import React, { Component } from 'react';
import FollowButton from '../common/FollowButton';
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

export default (props) => <TouchableHighlight>
<View style={{ flex: 1, flexWrap: "wrap", marginLeft: 20, backgroundColor: "white" }}>
    <Text style={{ fontSize: 25, fontFamily: "Hoefler Text", marginTop: 5, marginBottom: 5, paddingBottom: 5, marginRight: 10}}>
{props.details.name} {props.details.section.map ((section)=><Text style={{fontStyle: "italic"}} >({section})</Text>)}
        {/*<Image
            style={{paddingLeft: 20, width: 25, height: 25 }}
            source={require('../../media/follow_icon.png')}
        />*/}
        </Text>
    {/* <Text style={{ fontSize: 18, fontFamily: "Hoefler Text" }}>
        {props.details.position}
    </Text>  */}
    <FollowButton type="author" id={props.id} />
</View>
</TouchableHighlight>