import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { MapView } from 'expo'; //takes place of react-native-maps
//mport MapView, { Marker, ProviderPropType } from 'react-native-maps';

var markers = [
  {
    latitude: 45.65,
    longitude: -78.90,
    title: 'Foo Place',
    subtitle: '1234 Foo Drive'
  }
];

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

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      markers: [],
    }
  }

  render() {
    return (
      <View style = {styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.425612, //changed coordinates to center on Stanford
          longitude: -122.170641, //changed coordinates to center on Stanford
          latitudeDelta: 0.02, //0.0922,
          longitudeDelta: 0.015,//0.0421,
        }}>
      <MapView.Marker
        coordinate={{latitude: 37.425690, longitude: -122.170600}}
        title={"test run"}
        description={"marker.description"}
      />
      </MapView>
      </View>
    );
  }

  
}
/*
        {this.state.markers.map(marker => (//List of markers to render
          <Marker
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}
*/
//Goal: add geotag locations onto the map