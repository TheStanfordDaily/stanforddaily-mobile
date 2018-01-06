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
import {REFS, ICONS, Images, COLORS, ALIGNMENTS, STRINGS} from '../../assets/constants.js';
import styles from '../styles/header.js';
import ActivityView from 'react-native-activity-view';

export default class Header extends Component {
    constructor() {
        super();
    }

    toProfile() {
      // console.log(this.state);
      this.props.toProfile(null);
    }

    shareHandler() {
    ActivityView.show({
      url: STRINGS.DAILY_URL + "?p=" + this.props.postID
    });
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
                      <Text numberOfLines={1} ellipsizeMode={ALIGNMENTS.MIDDLE} style={styles.wordsTitle}>
                        {this.props.title}
                      </Text>
                    </View>)
                  }

                  {this.props.toProfile ===  undefined &&
                    this.props.searchHandler ===  undefined &&
                    this.props.share === undefined &&
                    <View style={styles.leftButton}/>
                  }

                  {this.props.share !== undefined &&
                    <TouchableWithoutFeedback style={styles.rightButton} onPress={this.shareHandler.bind(this)}>
                      <View style={styles.rightButton}>
                        <Icon name={ICONS.SHARE} size={34} color={COLORS.WHITE}/>
                      </View>
                    </TouchableWithoutFeedback>
                  }

                  {this.props.toProfile !== undefined && (
                    <TouchableWithoutFeedback onPress={this.toProfile.bind(this)}>
                      <View style={styles.rightButton}>
                        <Image source={Images.PROFILE} style={styles.profileImage}/>
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                  {this.props.searchHandler !== undefined && (
                    <TouchableWithoutFeedback style={styles.rightButton} onPress={() => this.props.searchHandler()}>
                      <View style={styles.rightButton}>
                        <Icon name={ICONS.SEARCH} size={34} color={COLORS.WHITE}/>
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                </View>
            </View>
        )

    }
}
