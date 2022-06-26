import * as React from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';

export default function Byline(props) {
    return (
        <View>
            <Text style={props.style}>{props.names.map((t, i) => 
                    <TouchableWithoutFeedback onPress = {() => console.log("Going to navigate to author with coauthor ID ", props.identifiers[i])}>
                        <Text>{t}</Text>
                    </TouchableWithoutFeedback>
                ).reduce((prev, curr, ind) => [prev, ind === props.names.length - 1 ? ' and ' : ', ', curr])}
            </Text>
        </View>
    )
}