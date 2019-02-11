import React, { Component } from 'react';
import { Alert, Image, Animated, AppRegistry, TouchableHighlight, TouchableOpacity, ScrollView, StyleSheet, View, Text, Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';
import _ from "lodash";
import HTML from '../../HTML';
import MapView from 'react-native-maps';
import { FONTS, STRINGS, DEFAULT_IMAGE } from "../../assets/constants";
//import { emit } from 'cluster';
let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.4275;
const LONGITUDE = -122.1697;
const LATITUDE_DELTA = 0.0300;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const ZOOM_MULTIPLIER = 0.5;

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

const initialRegion = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
}

export default class MapExample extends Component {
  constructor() {
    super();
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
      }
    };
  }


  toggleStatus() {
    this.setState({
      shown: !this.state.shown
    });
  }

  componentDidMount() {
    this.fetchAuthor(1001803);

    fetch(STRINGS.DAILY_URL + "wp-json/tsd/v1/locations")
    .then(e => e.json()) //convert to json
    .then(markers => {
      // for (let section of markers) {
      // }
      this.setState({ markers: markers });
    })
    .catch(e => {throw e});

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
      this.fetchAuthor(nextProps.navigation.state.params.id);
    }
  }

  fetchAuthor(authorId) {

    // Todo: post pagination
    fetch(STRINGS.DAILY_URL + "wp-json/wp/v2/posts?_embed").then(e => {
      return e.json();
    }).then(e => {
      this.setState({ posts: e })
    })
  }

  //Calls a fetch to get the relevant locations
  handleLocationInput(textInput) {
    //fetch("http://stanforddaily2.staging.wpengine.com/wp-json/tsd/v1/locations?q=Memorial%20Church")
    fetch("http://stanforddaily2.staging.wpengine.com/wp-json/tsd/v1/locations?q=" + encodeURIComponent(textInput))
    .then(e => {
      return e.json();
    }).then(e => {
      //throw e.length;
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

      e.map(element => element[0].toggleStatus());
//this.toggleStatus()
//this.setState({name: element[0].name})
//this.fetchLocation(element[0].id})

      //this.setState({ textInputLocations: e.map(marker)})

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
    return (
      <View style={{ flex: 1 }}>

        <View style={{ flex: 1 }}>
          <View>
            <SearchBar style={{ position: "fixed", flex: 1 }}

              onChangeText={search => {
                this.setState({ search: search});
              }}
              value={this.state.search}
              onSubmitEditing={e => this.handleLocationInput(this.state.search)}
             showLoading={true}
              lightTheme
              platform="default"
              round={true}
              cancelButtonTitle="Cancel"
              placeholder="Search" />
          </View>

          <MapView
            style={styles.container}
            showsUserLocation={true}
            //followsUserLocation = {true}
            showsCompass={true}
            ref={map => this.map = map}
            onMapReady={this.onMapReady}
            initialRegion={initialRegion}
            //region={ this.state.region }
            //minZoomLevel = {12}
            //onRegionChange={this.handleMapRegionChange}
            //onRegionChangeComplete={this.handleRegionChangeComplete}
            //onRegionChange={region => this.setState({ region })}
            //onRegionChangeComplete={region => this.setState({ region })}
          //setMapBoundaries: {true}

          >
            <MapView.Marker
              coordinate={{ latitude: 37.425690, longitude: -122.170600 }}
              title={"The Stanford Daily Building"}
              //onMarkerPress={() => this.toggleStatus()}
              onPress={() => this.toggleStatus()}
            />

          {this.state.markers && this.state.markers.map(marker => (
              <MapView.Marker
                key={marker.id}
                coordinate={{latitude: marker.coordinates[0],
                  longitude: marker.coordinates[1]}}
                title={marker.name}
                description={marker.description}
                icon={marker.icon}
                //iconBackgroundColor={marker.iconBackgroundColor}
                //iconBorderColor={marker.iconBorderColor}
                //iconColor={marker.iconColor}
                //pinColor = {randomColor()}
              />
          ))}
          </MapView>
        </View>





        {this.state.shown ?
          <View style={{
            flex: 1,
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20}}>

          <View style={{
              marginTop: 5,
              flex: 0.2,
              alignContent: "center",
              flexDirection: "row"
            }}>

              <View style={{ flex: 2 }}>
                <Image
                  style={{ marginTop: 7, width: 16, height: 35, alignSelf: "center" }}
                  source={require('../../media/pin.png')}
                />
              </View>

              <View style={{ flex: 7 }}>
                <Text style={{
                  flex: 1,
                  marginTop: 10,
                  fontSize: 16,
                  fontFamily: "Hoefler Text",
                  fontWeight: "bold"
                }}>
                  Articles related to: {"\n"}
                  Rodin Sculpture Garden
              </Text>
              </View>

              <TouchableHighlight style={{
                flex: 3,
                margin: 8,
                borderRadius: 5,
                alignSelf: "center",
                backgroundColor: "maroon"
              }}>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert('You will now receive push notifications alerting you about new articles related to the Rodin Sculpture Garden!')
                  }}>
                  <Text style={{
                    margin: 5,
                    fontSize: 15,
                    color: "white",
                    alignSelf: "center"
                  }}>
                    Follow
                  </Text>
                </TouchableOpacity>
              </TouchableHighlight>





            </View>


            <ScrollView showsVerticalScrollIndicator={true} style={{ flex: 1, flexDirection: "column" }}
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>

              {this.state.posts && this.state.posts.map(post => <View key={post.id} style={{ flex: 0.1, margin: 2, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "gray", flexDirection: "column" }}>

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
              )}

            </ScrollView>
          </View>

          : <View></View>}

      </View >



    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  }
});
