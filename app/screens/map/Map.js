import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {
  COLORS,
  FONTS,
  FONT_SIZES,
  STRINGS,
  DEFAULT_IMAGE
} from '../../assets/constants';

import { MapView } from 'expo'; //takes place of react-native-maps
import Header from '../common/header';

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRegion: {
        latitude: 37.425612, //changed coordinates to center on Stanford
        longitude: -122.170641, //changed coordinates to center on Stanford
        latitudeDelta: 0.02, //0.0922,
        longitudeDelta: 0.015,//0.0421,
      },

      //Get current location
      myPosition: null,

      markers: [],
      // markers: [
      //   {
          
      //     coordinate: {latitude: 37.425690, longitude: -122.170600},
      //     title: "The Stanford Daily Building",
      //     description: "Where the magic happens! :)",
      //     color: randomColor(),
      //     id: 1
      //   },
      // ],
    };
  }
  //Once components load, load data. All data is passed down from previous screen
  componentDidMount() {
    this.fetchData();
  }

  //Gets data and makes it look as expected
  fetchData() {
    fetch(STRINGS.DAILY_URL + "wp-json/tsd/v1/locations")
      .then(e => e.json()) //convert to json
      .then(markers => {
        // for (let section of markers) {
        // }
        this.setState({ markers: markers });
      })
      .catch(e => {throw e});
  }

  // watchLocation() {
  //   this.watchID = navigator.geolocation.watchPosition((position) => {
  //     const myLastPosition = this.state.myPosition;
  //     const myPosition = position.coords;
  //     if (!isEqual(myPosition, myLastPosition)) {
  //       this.setState({ myPosition });
  //     }
  //   }, null, this.props.geolocationOptions);
  // }

  render() {
    return (
      <View style = {styles.container}>
      <Header ref='postHeader'/>
      <MapView
        style={styles.map}
        initialRegion={this.state.initialRegion}
      >
      {this.state.markers.map(marker => (
          <MapView.Marker
            key={marker.id}
            coordinate={{latitude: marker.coordinates[0], 
              longitude: marker.coordinates[1]}}
            title={marker.name}
            description={marker.description}
            pinColor = {randomColor()}
          />
      ))}
      </MapView>
      </View>
    );
  } 
}

//Took default, w/ more changes
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }
});
