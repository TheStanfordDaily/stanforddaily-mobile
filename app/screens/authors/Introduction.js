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
import { FONTS, STRINGS, DEFAULT_IMAGE } from "../../assets/constants";


export default (props) =><View style={{ flex: 1 }}>
                            <View style={{ flex: 2 }}>
                                <Image
                                    style={{
                                        flex: 1,
                                        width: undefined,
                                        // height: 325
                                    }}
                                    source={{uri: props.details.funnyImage || DEFAULT_IMAGE}}
                                >
                                </Image>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{
                                    fontSize: 16, lineHeight: 18,
                                    margin: 10,
                                    fontFamily: "Hoefler Text", color: "black"
                                }}>
                                    {props.details.hometown && <React.Fragment>• I'm from: {props.details.hometown}{"\n"}</React.Fragment>}
                                    {props.details.tapOrder && <React.Fragment>• My go-to TAP order is: {props.details.tapOrder}{"\n"}</React.Fragment>}
                                    {props.details.diningHall && <React.Fragment>• My favorite dining hall is: {props.details.diningHall}</React.Fragment>}
                                </Text>
                            </View>
                        </View>
