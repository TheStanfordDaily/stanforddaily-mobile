/**
 * Created by ggoma on 12/17/16.
 */
import React, {Component} from 'react';
import {
    Animated,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

export default class Header extends Component {
    constructor() {
        super();
        this.state = {
            height: new Animated.Value(64),
            original: 64,
            animating: false,
            hidden: false,
            opacity: new Animated.Value(1.0),
        };
    }

    hide() {

        if(this.state.animating) {
            return;
        }
        console.log('animating');

        this.setState({animating: true, hidden: true});
        Animated.parallel([
          Animated.timing(this.state.height, {
            toValue: 20,
            duration: 500
          }),
          Animated.timing(this.state.opacity, {
            toValue: 0.0,
            duration: 500,
            useNativeDriver: true,
          })
        ]).start();
    }

    show() {
        if(!this.state.animating) {
            return;
        }
        console.log('animating');
        this.setState({animating: false, hidden:false});
        Animated.parallel([
          Animated.timing(this.state.height, {
            toValue: 64,
            duration: 500
          }),
          Animated.timing(this.state.opacity, {
            toValue: 1.0,
            duration: 500,
            useNativeDriver: true,
          })
        ]).start();
    }

    render() {

        const {height} = this.state;
        return (
            <View ref='container'>
                <Animated.View style={[styles.container, {height}]}>
                  {this.props.goBack === undefined && <View style={{width: 20}}/>}
                  {this.props.goBack !== undefined && (
                    <Animated.View style={{width:20, marginLeft:16, marginTop: 8, opacity: this.state.opacity}}>
                      <Icon name="ios-arrow-back" size={34} color="#ffffff" onPress={() => this.props.goBack()}/>
                    </Animated.View>
                  )}
                  {this.props.title === undefined && <Animated.Image source={require('../../media/DailyLogo.png')} style={{width: 243, height: 30, marginTop: 13, opacity: this.state.opacity}}/>}
                  {this.props.title !== undefined && <Animated.View style={{marginTop: 15, height: 30, width: 243}}><Text numberOfLines={1} ellipsizeMode={'middle'} style={{color: 'white', fontFamily:'Helvetica Neue', fontSize:20, textAlign: 'center'}}>{this.props.title}</Text></Animated.View>}
                  <View style={{width: 20}}/>
                </Animated.View>
            </View>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 64,
        backgroundColor: '#94171C',
    },

})
