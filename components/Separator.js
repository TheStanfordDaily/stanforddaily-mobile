import * as React from 'react';
import { View } from 'react-native';

export default function Separator() {
    return (<View
    style={{
        // borderBottomColor: COLORS.SEPARATOR,
        borderBottomWidth: 0.5,
        margin: 10,
    }}
    />)
}