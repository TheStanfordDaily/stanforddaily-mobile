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
    Image,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {REFS, COLORS, ICONS, Images, FONTS, ALIGNMENTS, MARGINS, HEIGHTS} from '../../assets/constants.js';

const iphone_x = Dimensions.get('window').height == 812;
const top_margin = iphone_x ? MARGINS.IPHONEX_HEADER_ADDITION+MARGINS.NORMAL_HEADER_MARGINS : MARGINS.NORMAL_HEADER_MARGINS

export default class Header extends Component {
    constructor() {
        super();
    }

    toProfile() {
      // console.log(this.state);
      this.props.toProfile(null);
    }

    render() {

        return (
            <View ref={REFS.CONTAINER}>
                <View style={styles.container}>
                  {this.props.goBack === undefined && this.props.drawerHandler === undefined && <View style={styles.leftButton}/>}
                  {this.props.goBack !== undefined && (
                      <TouchableWithoutFeedback onPress={() => this.props.goBack()}>
                        <View style={styles.leftButton}>
                          <Icon name={ICONS.BACK} size={34} color={COLORS.WHITE}/>
                        </View>
                      </TouchableWithoutFeedback>
                  )}
                  {this.props.drawerHandler !== undefined && (
                    <TouchableWithoutFeedback style={styles.leftButton} onPress={() => this.props.drawerHandler()}>
                      <View style={styles.leftButton}>
                        <Icon name={ICONS.MENU} size={34} color={COLORS.WHITE}/>
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                  {this.props.title === undefined && <Image source={Images.DAILY_FULL} style={styles.title}/>}
                  {this.props.title !== undefined && (
                    <View style={styles.title}>
                      <Text numberOfLines={1} ellipsizeMode={'middle'} style={styles.wordsTitle}>
                        {this.props.title}
                      </Text>
                    </View>)
                  }

                  {this.props.toProfile ===  undefined && <View style={styles.leftButton}/>}
                  {this.props.toProfile !== undefined && (
                    <TouchableWithoutFeedback onPress={this.toProfile.bind(this)}>
                      <View style={styles.rightButton}>
                        <Image source={Images.PROFILE} style={styles.profileImage}/>
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                </View>
            </View>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: iphone_x ? MARGINS.IPHONEX_HEADER_ADDITION+HEIGHTS.APP_HEADER : HEIGHTS.APP_HEADER,
        backgroundColor: '#94171C',
    },
    leftButton: {
      width:40,
      marginLeft: 10,
      marginTop: top_margin
    },
    title: {
      width: 243,
      height: 30,
      marginTop: top_margin
    },
    wordsTitle: {
      color: COLORS.WHITE,
      fontFamily:FONTS.HNEUE,
      fontSize:20,
      textAlign:ALIGNMENTS.CENTER
    },
    rightButton: {
      width: 40,
      height: 23,
      marginTop: top_margin,
    },
    profileImage: {
      tintColor: COLORS.WHITE,
      width: 20,
      height: 23
    }
})
