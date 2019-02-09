import React, { Component } from 'react';
import { Animated, ListView, Image, TouchableHighlight, TouchableOpacity, ScrollView, StyleSheet, View, Text, Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';
import _ from "lodash";
import HTML from '../../HTML';
import MapView from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ICONS, COLORS, STRINGS, DEFAULT_IMAGE } from "../../assets/constants";
let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.4275;
const LONGITUDE = -122.1697;
const LATITUDE_DELTA = 0.0300;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const initialPostsViewHeight = 300;

export default class MapExample extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      shown: false,
      posts: null,
      details: null,
      postCount: null,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      scrollY: new Animated.Value(0),
      dataSource: ds.cloneWithRows([]),
      ViewScale: new Animated.Value(300),
    };
  }


  toggleShownStatus() {
    this.setState({
      shown: !this.state.shown
    });
  }

  componentDidMount() {

    fetch(STRINGS.DAILY_URL + "wp-json/tsd/v1/locations")
      .then(e => e.json()) //convert to json
      .then(markers => {
        // for (let section of markers) {
        // }
        this.setState({ markers: markers });
      })
      .catch(e => { throw e });

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });
      }
    );
  }



  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.id) {
      this.setState({ posts: [], details: [] });
      this.fetchLocation(nextProps.navigation.state.params.id);
    }
  }



  fetchLocation(locationID) {

    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    // Todo: post pagination
    fetch(STRINGS.DAILY_URL + "wp-json/tsd/v1/locations/" + locationID + "/posts?").then(e => {
      return e.json();
    }).then(e => {
      this.setState({ dataSource: ds.cloneWithRows(e) });
      console.log(this.state.dataSource);
    })
  }


  handleLocationInput(textInput) {
    this.setState({
      region: {
        latitude: textInput
      }
    });
  }


  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }


  renderRow(post) {
    console.log("yeppppp", post);
    if (post.id) {
      return (
        <View key={post.id} style={{ flex: 0.1, margin: 2, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "gray", flexDirection: "column" }}>
          <View style={{ flex: 1, marginTop: 1, backgroundColor: "white", flexDirection: "row" }}>
            <View style={{ flex: 2, padding: 7, aspectRatio: 3 / 2 }}>
              <Image
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  width: '100%',
                  height: undefined
                }}
                source={{ uri: _.get(post, "_embedded.wp:featuredmedia.0.media_details.sizes.thumbnail.source_url", DEFAULT_IMAGE) }}
              />
            </View>
            <View style={{ flex: 3, paddingTop: 20, paddingBottom: 10, paddingLeft: 5, paddingRight: 10 }}>
              <TouchableHighlight onPress={() => this.props.navigation.navigate(STRINGS.POST, { postID: post.id })}>
                <HTML baseFontStyle={{ fontSize: 16, fontFamily: "Hoefler Text" }} html={post.title.rendered} />
              </TouchableHighlight>
              <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", color: 'gray', paddingTop: 5 }}>
                {new Date(post.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      );
    }
    return (<View><Text>Loading</Text></View>);
  }


  render() {
    var headMov = this.state.scrollY.interpolate({
      inputRange: [0, initialPostsViewHeight, height],
      outputRange: [0, -initialPostsViewHeight, -height]
    });
    var headColor = this.state.scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: ["green", "blue"]
    });
    return (
      <View style={{ flex: 1 }}>
        {/*<ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderScrollComponent={this.renderScroll.bind(this)}
          style={{backgroundColor: "red"}}
        />*/}
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderScrollComponent={this.renderScroll.bind(this)}
          withSections={false}
          enableEmptySections={true}
          stickySectionHeadersEnable={true}
          renderSectionHeader={() => {
            return (
              <View style={{
                flex: 1,
                alignContent: "center",
                flexDirection: "row",
                backgroundColor: "red"
              }}
              >

                <View style={{ flex: 2 }}>
                  <Image
                    style={{ marginTop: 7, width: 16, height: 35, alignSelf: "center" }}
                    source={require('../../media/pin.png')}
                  />
                </View>

                <View style={{ flex: 7, justifyContent: "center" }}>
                  <Text style={{
                    flex: 1,
                    paddingTop: 12,
                    fontSize: 16,
                    fontFamily: "Hoefler Text",
                    fontWeight: "bold",
                    alignContent: "center",
                  }}>
                    Articles related to: {"\n"}
                    {this.state.name}
                  </Text>
                </View>

                <View style={{ flex: 3, justifyContent: "center" }}>
                  <TouchableHighlight style={{
                    height: 30,
                    width: 30,
                    margin: 2,
                    borderRadius: 100,
                    alignSelf: "center",
                    backgroundColor: "grey"
                  }}>
                    <TouchableOpacity
                      onPress={() => {
                        // Alert.alert('You will now receive push notifications alerting you about new articles related to the Rodin Sculpture Garden!')
                        this.closePostsView();
                      }}>
                      <Text style={{
                        margin: 5,
                        fontSize: 15,
                        color: "white",
                        alignSelf: "center"
                      }}>
                        X
                    </Text>
                    </TouchableOpacity>
                  </TouchableHighlight>
                </View>
              </View>
            );
          }}
        >



        </ListView>


        <Animated.View
          style={{
            position: "absolute",
            height: '100%',
            width: width,
            top: 0,
            justifyContent: "flex-end",
            flexDirection: "column",
            transform: [{ translateY: headMov }]
          }}
        >
          <MapView
            style={{ bottom: 0, width: width, height: '100%' }}
            showsUserLocation={true}
            //followsUserLocation = {true}
            showsCompass={true}
            initialRegion={this.state.region}
            //region={ this.state.region }
            //minZoomLevel = {12}
            onRegionChange={region => this.setState({ region })}
            onRegionChangeComplete={region => this.setState({ region })}
          //setMapBoundaries: {true}

          >

            {this.state.markers && this.state.markers.map(marker => (
              <MapView.Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.coordinates[0],
                  longitude: marker.coordinates[1]
                }}
                title={marker.name}

                description={marker.description}
                onPress={() => {
                  /*this.toggleStatus()
                  this.setState({ name: marker.name })
                  this.fetchLocation(marker.id);*/
                  this.closePostsView();
                }}
                onCalloutPress={() => {
                  /*this.toggleStatus()
                  this.setState({ name: marker.name })
                  this.fetchLocation(marker.id);*/

                  this.setState({ name: marker.name });
                  this.fetchLocation(marker.id);
                  this.toggle();
                }
                }
              >
                {/* https://stackoverflow.com/a/33471432/2603230 */}
                <View style={[styles.markerBackground, { backgroundColor: marker.iconBackgroundColor, borderColor: marker.iconBorderColor }]}>
                  <MaterialCommunityIcons name={marker.icon} size={20} color={marker.iconColor} style={styles.markerInnerIcon} />
                </View>
              </MapView.Marker>
            ))}
          </MapView>
        </Animated.View>
      </View>
    );
  }

  toggle() {
    if (!this.state.shown) {
      this.toggleShownStatus();
      Animated.timing(                    // Animate over time
        this.state.scrollY,             // The animated value to drive, this would be a new Animated.Value(0) object.
        {
          toValue: initialPostsViewHeight,                   // Animate the value
          duration: 500,                 // Make it take a while
        }
      ).start(() => { this.state.scrollY.extractOffset(); });
    }
  }

  closePostsView() {
    if (this.state.shown) {
      this.state.scrollY.flattenOffset();

      Animated.timing(                    // Animate over time
        this.state.scrollY,             // The animated value to drive, this would be a new Animated.Value(0) object.
        {
          toValue: 0,                   // Animate the value
          duration: 500,                 // Make it take a while
        }
      ).start(() => { this.toggleShownStatus(); });
    }
  }

  _handleScroll(e) {
    console.log(e.nativeEvent.contentOffset.y, "test");
    console.log(height);
  }

  renderScroll(props) {
    console.log("haha");
    return (
      <Animated.ScrollView
        {...props}
        scrollEventThrottle={16}

        contentContainerStyle={{
          paddingTop: height - 125 - initialPostsViewHeight,
        }}

        // Declarative API for animations ->
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: this.state.scrollY } }
            }
          ],
          { listener: this._handleScroll.bind(this) },
          {
            useNativeDriver: true // <- Native Driver used for animated events
          }
        )}
      />
    );
  }
}
const styles = StyleSheet.create({
  markerBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  markerInnerIcon: {
    width: 20,
    height: 20,
    left: 8,
    top: 8,
  }
});
