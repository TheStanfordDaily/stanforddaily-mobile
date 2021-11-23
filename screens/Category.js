import React, { Component } from 'react';
import { View, Dimensions, Text, TouchableWithoutFeedback, Image } from 'react-native';

export default function Category(props) {
    const { title } = props.route.params;
    return (
        <Text>{title} page</Text>
    )
}