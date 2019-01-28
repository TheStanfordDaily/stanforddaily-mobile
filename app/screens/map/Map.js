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

      //temporarily hardcoded for now; will change to get info from backend
      //Also so that description includes link to the article itself
      markers: [],
      // markers: [
      //   {
          
      //     coordinate: {latitude: 37.425690, longitude: -122.170600},
      //     title: "The Stanford Daily Building",
      //     description: "Where the magic happens! :)",
      //     color: randomColor(),
      //     id: 1
      //   },
      //   {
      //     coordinate: {latitude: 37.429720, longitude: -122.170630},
      //     title: "testing2222",
      //     description: "testing",
      //     color: randomColor(),
      //     id: 2
      //   },
      //   {
      //     coordinate: {latitude: 37.420000, longitude: -122.171730},
      //     title: "another test",
      //     description: "testing",
      //     color: randomColor(),
      //     id: 3
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
      <MapView
        style={styles.map}
        initialRegion={this.state.initialRegion}
      >
      {this.state.markers.map(marker => (
          <MapView.Marker
            //key={marker.id}
            coordinate={{latitude: marker.coordinates[0], longitude: marker.coordinates[1]}}
            title={marker.name}
            description={marker.description}
            //pinColor= randomColor()
            //pinColor={marker.color}
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
/*
        {this.state.markers.map(markers => (//List of markers to render
          <Marker
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))}

        //Just place 1 coordinate hard code
      <MapView.Marker
        coordinate={{latitude: 37.425690, longitude: -122.170600}}
        title={"The Stanford Daily Building"}
        description={"Where the magic happens! :)"}
      />
*/
//Goal: add geotag locations onto the map

/*
Note: using the post.js as a template for this page; hoping it mostly works!
Each time to run again: call "npm run ios"
*/
/*
'use strict';
import React, { Component } from 'react';
import {
  View,
  StatusBar,
  ScrollView,
  Dimensions,
  Text,
  Image,
  SectionList,
  TouchableOpacity
} from 'react-native';

import {
  COLORS,
  FONTS,
  FONT_SIZES,
  STRINGS,
  DEFAULT_IMAGE
} from '../../assets/constants';
import NestedListView from "./NestedListView";

import Header from '../common/header';

const { width, height } = Dimensions.get('window'); //Dimensions of the current device screen


class AuthorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }
  }

  //Once components load, load data. All data is passed down from previous screen
  componentDidMount() {
    this.fetchData();
  }

  //Gets data and makes it look as expected
  fetchData() {
    fetch(STRINGS.DAILY_URL + "wp-json/tsd/v1/authors/")
      .then(e => e.json()) //convert to json
      .then(data => {
        for (let section of data) {
          section.data = section.members.filter(member => member && member.name && member.name.trim());
        }
        this.setState({ data: data });
      })
  }

  createMarkup(text) {
    return text;
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header ref='postHeader' postID={this.state.id} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <StatusBar
            barStyle="light-content"
          />
          <ScrollView style={{ flex: 1, flexDirection: "row", backgroundColor: "white" }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
            {this.state.data.length ?
              <NestedListView
                data={this.state.data}
                navigate={id => this.props.navigation.navigate("AuthorDetail", { id: id })}
              /> : <View />}
          </ScrollView>
        </View>
      </View>
    );
  }
};

export default AuthorList;
*/
