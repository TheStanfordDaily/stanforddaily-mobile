import {STRINGS, CATEGORIES, REFS, KEYS, ALIGNMENTS, FONTS, COLORS} from '../assets/constants.js';
import React, {Component} from 'react';
import {Image} from 'react-native';
import Modal from "react-native-modal"
import ToggleSwitch from 'toggle-switch-react-native'
import {
    Alert,
    View,
    Text,
    Dimensions,
    RefreshControl,
    ListView,
    StatusBar,
    ActivityIndicator,
    NetInfo,
    FlatList,
    TouchableOpacity,
    TouchableHighlight,
    SectionList
} from 'react-native';
// import Drawer from 'react-native-drawer'

// //Components for this app imports
// import Header from './common/header';
// import NewsFeedItem from './common/newsfeed-item';
// import Placeholder from './common/placeholder';
import _ from 'lodash';

//Styles for the page
import styles from './styles/headlines';

import {Amplitude} from 'expo';

const amplitude = Amplitude.initialize(KEYS.AMPLITUDE_API);

//A map between categories names and their codes
const {width, height} = Dimensions.get('window');
var selectedCategory = STRINGS.FEATURED_HEADLINES; //The currently selected category

//Do I need props?
export default class SettingsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: true,
            isOnBreakingNews: false,
            isOnEveryDay: false,
            isOnEveryWeek: false,
        };
      //  this.openSettings = this.openSettings.bind(this);
       // this.closeSettings = this.closeSettings.bind(this);
    }

    // openSettings() {
    //   this.setState({ isModalVisible: true});
    //   Alert.alert("settings are opened, settings page");
    // }
   
    // closeSettings() {
    //   this.setState({ isModalVisible: false});
    // }

    render() {
      return (      
        <Modal 
            style = {{
              backgroundColor: 'white'}}
              isVisible={this.props.isModalVisible}
              >
  
          {/* Header */}
          <View 
            style = {{
              marginTop: 40,
              borderBottomWidth: 4,
              borderColor: 'grey',
              alignItems: 'center',
              flex: 0.4, 
            }}> 
            
            <Text style= {{
              fontFamily: 'PT Serif', 
              fontSize: 24
            }}>Notifications</Text>
            
            <Text style= {{
              fontFamily: 'PT Serif'
            }}>How often do you want to hear from The Daily?</Text>
          
          </View>
  
          <View 
            style = {{
              flex: 1, 
              backgroundColor: 'white',
            }}> 
  
            <View style = {{ flex: 1 , flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'grey'}}> 
              <View style = {{margin: 10, flex: 1, alignItems: 'center'}}>
                <Image 
                style={{ width: 35, height: 35 }}
                source={require('../media/breaking.png')}></Image>
              </View>
  
              <View style = {{flex: 4, margin: 5}}>
                <Text style = {{fontSize: 16, fontFamily: 'PT Serif'}}>Breaking News</Text>
                <Text style = {{fontSize: 13, fontFamily: 'PT Serif'}}>Important stories, as they happen</Text>
              </View>
  
              <View style = {{margin: 15, flex: 1, alignItems: 'center'}}>
              {<ToggleSwitch
                isOn={this.state.isOnBreakingNews}
                onColor='maroon'
                offColor='grey'
                size='small'
                onToggle={ isOnBreakingNews => this.setState(( {isOnBreakingNews})) }
                />}
              </View>
  
            </View>
  
            <View style = {{ flex: 1 , flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'grey'}}> 
              <View style = {{margin: 10, flex: 1, alignItems: 'center'}}>
                <Image 
                style={{ width: 35, height: 35 }}
                source={require('../media/sunicon.png')}></Image>
              </View>
  
              <View style = {{flex: 4, margin: 5}}>
                <Text style = {{fontSize: 16, fontFamily: 'PT Serif'}}>Every day</Text>
                <Text style = {{fontSize: 13, fontFamily: 'PT Serif'}}>Daily news roundup</Text>
              </View>
  
              <View style = {{margin: 15, flex: 1, alignItems: 'center'}}>
              {<ToggleSwitch
                isOn={this.state.isOnEveryDay}
                onColor='maroon'
                offColor='grey'
                size='small'
                onToggle={ isOnEveryDay => this.setState(( {isOnEveryDay})) }
                /> }
              </View>
  
            </View>
  
            <View style = {{ flex: 1 , flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'grey'}}> 
              <View style = {{margin: 10, flex: 1, alignItems: 'center'}}>
                <Image 
                style={{ width: 32, height: 32 }}
                source={require('../media/calendaricon.png')}></Image>
              </View>
  
              <View style = {{flex: 4, margin: 5}}>
                <Text style = {{fontSize: 16, fontFamily: 'PT Serif'}}>Every week</Text>
                <Text style = {{fontSize: 13, fontFamily: 'PT Serif'}}>Weekly Leland's Digest</Text>
              </View>
  
              <View style = {{margin: 15, flex: 1, alignItems: 'center'}}>
              { <ToggleSwitch
                isOn={this.state.isOnEveryWeek}
                onColor='maroon'
                offColor='grey'
                size='small'
                onToggle={ isOnEveryWeek => this.setState(( {isOnEveryWeek})) }
                /> }
              </View>
  
            </View>
  
          </View>
  
          <View 
            style = {{
              flex: 3, 
              backgroundColor: 'white',
            }}> 
          </View>
  
          <View style = {{margin: 20, alignItems: 'center'}}>
              <TouchableOpacity 
                style = {{ 
                  height: 40,
                  width: 200,
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  backgroundColor:'maroon'}}
                onPress={() => this.props.closeSettings()}>
                <Text style={{
                  alignSelf: 'center', 
                  color: 'white',
                  fontFamily: 'Arial'
                  }}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
      )
    }
}