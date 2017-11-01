import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Animated
} from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {STRINGS, COLORS} from '../../assets/constants.js';

const {width, height} = Dimensions.get('window');
const PLACEHOLDER_SHIMMER = [COLORS.PLACEHOLDER_LIGHT, COLORS.PLACEHOLDER_DARK, COLORS.PLACEHOLDER_LIGHT];

export default class Placeholder extends Component {

  constructor(props) {
    super(props);
    this.bigImageAndSomeRowsAnimated = [];
  }

  runBigAvatarAndSomeRowsAnimated() {
  if (Array.isArray(this.bigImageAndSomeRowsAnimated) && this.bigImageAndSomeRowsAnimated.length > 0) {
    Animated.parallel(
      [
        this.bigImageAndSomeRowsAnimated[0].getAnimated(),
        ...this.bigImageAndSomeRowsAnimated.slice(1).map(animate => {
        if (animate && animate.getAnimated) {
          return animate.getAnimated();
        }
          return null;
        }),
      ],
      {
        stopTogether: false,
      }).start(() => {
        this.runBigAvatarAndSomeRowsAnimated();
      })
  }
}
    render() {
        return (
          <View style={styles.placeholderBackground}>
          <ShimmerPlaceHolder
              ref={(ref) => this.bigImageAndSomeRowsAnimated.push(ref)}
              width={width}
              height={width/3}
              visible={false}
              autoRun={true}
              style={{backgroundColor: 'white'}}
              colorShimmer={PLACEHOLDER_SHIMMER}
            />
            <View style={styles.dateAndAuthor}>
              <ShimmerPlaceHolder
                ref={(ref) => this.bigImageAndSomeRowsAnimated.push(ref)}
                width={75}
                height={7}
                visible={false}
                autoRun={true}
                style={{backgroundColor: 'white'}}
                colorShimmer={PLACEHOLDER_SHIMMER}
              />
              <ShimmerPlaceHolder
                ref={(ref) => this.bigImageAndSomeRowsAnimated.push(ref)}
                style={{ marginTop: 15 }}
                width={75}
                height={7}
                visible={false}
                autoRun={true}
                style={{backgroundColor: 'white'}}
                colorShimmer={PLACEHOLDER_SHIMMER}
              />
            </View>
            <View style={styles.title}>
              <ShimmerPlaceHolder
                ref={(ref) => this.bigImageAndSomeRowsAnimated.push(ref)}
                height={13}
                width={width-28}
                visible={false}
                autoRun={true}
                style={{backgroundColor: 'white'}}
                colorShimmer={PLACEHOLDER_SHIMMER}
              />
            </View>
            <View style={styles.title}>
              <ShimmerPlaceHolder
                ref={(ref) => this.bigImageAndSomeRowsAnimated.push(ref)}
                height={13}
                width={width-100}
                visible={false}
                autoRun={true}
                style={{backgroundColor: 'white'}}
                colorShimmer={PLACEHOLDER_SHIMMER}
              />
            </View>
            <View style={[styles.description,{marginTop: 8}]}>
              <ShimmerPlaceHolder
                ref={(ref) => this.bigImageAndSomeRowsAnimated.push(ref)}
                height={7}
                width={width-28}
                visible={false}
                autoRun={true}
                style={{backgroundColor: 'white'}}
                colorShimmer={PLACEHOLDER_SHIMMER}
              />
            </View>
            <View style={styles.description}>
              <ShimmerPlaceHolder
                ref={(ref) => this.bigImageAndSomeRowsAnimated.push(ref)}
                height={7}
                width={width-28}
                visible={false}
                autoRun={true}
                style={{backgroundColor: 'white'}}
                colorShimmer={PLACEHOLDER_SHIMMER}
              />
            </View>
            <View style={styles.description}>
              <ShimmerPlaceHolder
                ref={(ref) => this.bigImageAndSomeRowsAnimated.push(ref)}
                height={7}
                width={width-28}
                visible={false}
                autoRun={true}
                style={{backgroundColor: 'white'}}
                colorShimmer={PLACEHOLDER_SHIMMER}
              />
            </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
  placeholderBackground: {
      borderTopColor: '#A5A5A5',
      borderTopWidth: 1,
      backgroundColor: '#fcfcfc',
      width: '100%',
      borderTopColor: '#A5A5A5',
      borderTopWidth: 2,
      // flex: 1
  },
  dateAndAuthor: {
    flexDirection: 'row',
    justifyContent:"space-between",
    marginTop: 6,
    marginLeft: 14,
    marginRight: 14,
  },
  title: {
    marginTop: 6,
    marginLeft: 14,
    marginRight: 14,
  },
  description: {
    marginBottom: 6,
    marginLeft: 14,
    marginRight: 14,
  }
})
