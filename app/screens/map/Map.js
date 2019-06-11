import React, { Component } from 'react';
import { Alert, Image, Animated, SectionList, TouchableHighlight, TouchableOpacity, ScrollView, StyleSheet, View, Text, Dimensions, Keyboard } from 'react-native';
import { SearchBar } from 'react-native-elements';
import _ from "lodash";
import HTML from '../../HTML';
import MapView from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ICONS, COLORS, HEIGHTS, STRINGS, DEFAULT_IMAGE, DAILY_URL } from "../../assets/constants";
import FollowButton from '../common/FollowButton';
let { width, height } = Dimensions.get('window');
const iphone_x = height == HEIGHTS.IPHONE_X;

const ASPECT_RATIO = width / height;
const LATITUDE = 37.4275;
const LONGITUDE = -122.1697;
const LATITUDE_DELTA = 0.0300;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const ZOOM_MULTIPLIER = 0.5;

const initialRegion = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
}

const OPENED_POSTS_VIEW_HEIGHT = 300;

export default class MapExample extends Component {
  constructor() {
    super();
    this.markers = {};
    this.state = {
      shown: false,
      postCount: null,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      scrollY: new Animated.Value(0),
      dataSource: [],
    };
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
      this.fetchLocation(nextProps.navigation.state.params.id);
    }
  }

  fetchLocation(locationID) {
    // Todo: post pagination
    fetch(STRINGS.DAILY_URL + "wp-json/tsd/v1/locations/" + locationID + "/posts?_embed").then(e => {
      return e.json();
    }).then(e => {
      this.setState({ dataSource: e });
    })
  }

  //Calls a fetch to get the relevant locations
  handleLocationInput(textInput) {
    //fetch("http://stanforddaily2.staging.wpengine.com/wp-json/tsd/v1/locations?q=Memorial%20Church")
    fetch(DAILY_URL + "/wp-json/tsd/v1/locations?q=" + encodeURIComponent(textInput))
    .then(e => {
      return e.json();
    }).then(e => {
      //Algorithm for finding center of min/max longitudes and latitudes and centering map there.
      let latitudes = e.map(element => element.coordinates[0]);
      let longitudes = e.map(element => element.coordinates[1]);

      let minLat = Math.min(...latitudes);
      let maxLat = Math.max(...latitudes);
      let minLong = Math.min(...longitudes);
      let maxLong = Math.max(...longitudes);

      let centerLat = (minLat + maxLat)/2.0;
      let centerLong = (minLong + maxLong)/2.0;

      let region = {
           latitude: centerLat,
           longitude: centerLong,
           latitudeDelta: LATITUDE_DELTA * ZOOM_MULTIPLIER,
           longitudeDelta: LONGITUDE_DELTA * ZOOM_MULTIPLIER,
      }
      this.map.animateToRegion(region);

      if(e && e[0]) {
        this.markers[e[0].id].showCallout();
      }
    })
  }


  onMapReady = (e) => {
    if(!this.state.ready) {
      this.setState({ready: true});
    }
  };

  handleMapRegionChange = region => {
    this.setState({ region });
  };

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }


  render() {
    var headMov = this.state.scrollY.interpolate({
      inputRange: [0, OPENED_POSTS_VIEW_HEIGHT, height],
      outputRange: [0, -OPENED_POSTS_VIEW_HEIGHT, -height]
    });
    return (
      <View style={{ flex: 1 }}>
        <SectionList
          sections={[{ data: this.state.dataSource }]}
          renderItem={({ item }) => this.renderRow(item)}
          renderScrollComponent={this.renderScroll.bind(this)}
          withSections={false}
          enableEmptySections={true}
          stickySectionHeadersEnable={true}
          renderSectionHeader={() => {
            return (
              <View style={{
                backgroundColor: COLORS.CARDINAL,
                paddingTop: 12,
                paddingBottom: 12,
              }}
              >
                <MaterialCommunityIcons name={this.state.icon} size={30} color="white" style={{ alignSelf: "center" }} />
                <Text style={{
                  marginTop: 6,
                  fontSize: 16,
                  fontFamily: "Hoefler Text",
                  fontWeight: "bold",
                  alignSelf: "center",
                  textAlign: 'center',
                  color: COLORS.WHITE
                }}>
                  Articles related to {this.state.name}
                </Text>

                <TouchableHighlight style={{
                  margin: 8,
                  borderRadius: 5,
                  alignSelf: "center",
                  backgroundColor: "maroon"
                }}>
                  <FollowButton type="location" id={this.state.name} containerStyle={{}} />
                </TouchableHighlight>

                <TouchableHighlight style={{
                  position: "absolute",
                  top: 15,
                  right: 15,
                  height: 30,
                  width: 30,
                  borderRadius: 100,
                  alignSelf: "center",
                  backgroundColor: "black"
                }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.closePostsView();
                    }}>
                    <Text style={{
                      margin: 5,
                      fontSize: 15,
                      color: "white",
                      alignSelf: "center"
                    }}>&times;</Text>
                  </TouchableOpacity>
                </TouchableHighlight>
              </View>
            );
          }}
        />

        <Animated.View
          style={{
            position: "absolute",
            height: '100%',
            width: '100%',
            top: 0,
            justifyContent: "flex-end",
            flexDirection: "column",
            transform: [{ translateY: headMov }]
          }}
        >
          <SearchBar style={{ position: "fixed", flex: 1 }}
            onChangeText={search => {
              this.setState({ search: search });
            }}
            value={this.state.search}
            onSubmitEditing={e => this.handleLocationInput(this.state.search)}
            showLoading={true}
            lightTheme
            platform="default"
            round={true}
            cancelButtonTitle="Cancel"
            placeholder="Search..." />
          <MapView
            style={{ bottom: 0, width: '100%', flex: 1 }}
            showsUserLocation={true}
            //followsUserLocation = {true}
            showsCompass={true}
            ref={map => this.map = map}
            onMapReady={this.onMapReady}
            initialRegion={initialRegion}
            loadingEnabled={true}
          >
            {this.state.markers && this.state.markers.length && this.state.markers.map(marker => (
              <MapView.Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.coordinates[0],
                  longitude: marker.coordinates[1]
                }}
                title={marker.name}
                description="See More&hellip;"
                onPress={() => {
                  this.closePostsView();
                }}
                onCalloutPress={() => {
                  this.locationOnClick(marker);
                }
                }
                ref={currMarker => this.markers[marker.id] = currMarker}
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

  renderRow(post) {
    //console.log("post: ", post);
    if (post.id) {
      return (
        <View key={post.id} style={{ flex: 0.1, padding: 2, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "gray", flexDirection: "column" }}>
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
    return (<View><Text>Loading...</Text></View>);
  }


  locationOnClick(marker) {
    Keyboard.dismiss();
    this.setState({ name: marker.name, icon: marker.icon });
    this.fetchLocation(marker.id);
    this.openPostsView();
  }

  toggleShownStatus() {
    this.setState({
      shown: !this.state.shown
    });
  }

  openPostsView() {
    if (!this.state.shown) {
      this.toggleShownStatus();
      Animated.timing(                    // Animate over time
        this.state.scrollY,             // The animated value to drive, this would be a new Animated.Value(0) object.
        {
          toValue: OPENED_POSTS_VIEW_HEIGHT,                   // Animate the value
          duration: 500,                 // Make it take a while
        }
      ).start(() => { this.state.scrollY.extractOffset(); });
    }
  }

  closePostsView() {
    if (this.state.shown) {
      this.state.scrollY.flattenOffset();

      Animated.timing(
        this.state.scrollY,
        {
          toValue: 0,
          duration: 500,
        }
      ).start(() => { this.toggleShownStatus(); });
    }
  }


  _handleScroll(e) {
    //console.log(e.nativeEvent.contentOffset.y, "test");
  }

  /*
  Ref:
  https://blog.nativebase.io/butter-smooth-scrolling-animations-in-react-native-49edbba6a38a
  https://github.com/Jasbir23/ScrollSwagger
  */
  renderScroll(props) {
    // Numbers based on testing
    var scrollViewPaddingTop = height - 70 - OPENED_POSTS_VIEW_HEIGHT;
    if (iphone_x) {
      scrollViewPaddingTop -= 58;
    }
    return (
      <Animated.ScrollView
        {...props}
        scrollEventThrottle={16}

        contentContainerStyle={{
          paddingTop: scrollViewPaddingTop,
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
