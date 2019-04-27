import React, { Component } from 'react';
import {
    Alert,
    View,
    StatusBar,
    ScrollView,
    Dimensions,
    Text,
    Image
} from 'react-native';

export default (props) => <View style={{ flex: 1 }}>
                            <View style={{ flex: 2 }}>
                                <Image
                                    style={{
                                        flex: 1,
                                        width: undefined,
                                        height: 375
                                    }}
                                    source={{uri: props.details.coverImage || DEFAULT_IMAGE}}
                                >
                                </Image>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    fontSize: 16, lineHeight: 18,
                                    margin: 10,
                                    fontFamily: "Hoefler Text", color: "black"
                                }}>
                                    {props.details.blurb}
                                </Text>
                            </View>
                        </View>