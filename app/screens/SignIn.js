'use strict';

import React, {Component} from 'react';
import ReactNative from 'react-native';
const firebase = require('firebase');

const {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
  Image,
  TouchableWithoutFeedback,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Switch,
  Button,
  Animated,
  Dimensions,
  Keyboard
} = ReactNative;

import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationActions} from 'react-navigation';

const {width, height} = Dimensions.get('window');

export default class SignIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
        marginRight: new Animated.Value(0),
        marginLeft: new Animated.Value(0),
        height: 303,
        currProcess: 'signIn',
        signUpButtonLabel: 'Not a user? Sign Up'
    };
  }

  dismissModal() {
    this.props.navigation.dispatch(NavigationActions.back());
  }

  signIn() {
    var firebaseApp = firebase.apps[0];
    var load = this.props.navigation.state.params.loadPosts;
    var view = this;
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function(user) {
        // view.signedIn = true;
        // currUser = user.uid;
        // view.listenForItems(view.itemsRef);
        load();
        view.dismissModal();
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        view.signedIn = false;
        view.error = true;
        if (errorCode === 'auth/wrong-password') {
            // alert('Wrong password.');
        } else {
            // alert(errorMessage);
        }
      });
  }

  prepareSignUpCard() {
    this.setState({
      height: 365,
      currProcess: 'signUp',
      signUpButtonLabel: 'Sign Up'
    });
    Animated.timing(this.state.marginLeft, {
      toValue: 0,
      duration: 400
    }).start();
  }

  showSignUp() {
    var view = this;
    Animated.timing(this.state.marginLeft, {
      toValue: width*2,
      duration: 400
    }).start(view.prepareSignUpCard.bind(view));
  }

  prepareSignUpCard() {
    this.setState({
      height: 365,
      currProcess: 'signUp',
      signUpButtonLabel: 'Sign Up'
    });
    Animated.timing(this.state.marginLeft, {
      toValue: 0,
      duration: 400
    }).start();
  }

  backToSignIn() {
    var view = this;
    Animated.timing(this.state.marginLeft, {
      toValue: width*2,
      duration: 400
    }).start(view.prepareSignInCard.bind(view));
  }

  prepareSignInCard() {
    this.setState({
      height: 303,
      currProcess: 'signIn',
      signUpButtonLabel: 'Not a user? Sign Up'
    });
    Animated.timing(this.state.marginLeft, {
      toValue: 0,
      duration: 400
    }).start();
  }

  actuallySignUp() {
    console.log('registering');
    // TODO: validate user input

    // Commence call to firebase to register user
    var emailDomain = this.state.email.substring(this.state.email.length - 12);
    console.log('email' + emailDomain);
    var scope = this;
    var load = this.props.navigation.state.params.loadPosts;
    if(emailDomain === 'stanford.edu') {
      var newCurrUser = firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(function(user) {
          // send verification email
          user.sendEmailVerification().then(function() {
            AlertIOS.alert(
              'Verification Email Sent',
              'An email has been sent to ' + scope.state.email + '. Please click the verification link.',
              [{text: 'Okay', onPress: () => scope.dismissModal(), style: 'cancel'}],
            );
          }).catch(function(error) {
            // error
            console.log('error when verifying email' + error);
          });
          user.updateProfile({displayName: scope.state.displayName});
      }).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
              // alert('Wrong password.');
          } else {
              console.log('broblem' + errorMessage);
          }
        });
      } else {
        console.log('biiiiiiiitch. Nnnnno');
      }
  }

  signUp() {
    // Keyboard.dismiss();
    if(this.state.currProcess === 'signIn') {
      this.showSignUp();
    } else {
      this.actuallySignUp();
    }
  }

  render() {
    const {marginRight,marginLeft,height} = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar
          hidden={true}
        />
        <View style={styles.closeWrapper}>
          <TouchableWithoutFeedback onPress={this.dismissModal.bind(this)}>
            <Image style={styles.close} source={require('../media/Close.png')}/>
          </TouchableWithoutFeedback>
        </View>
        <KeyboardAvoidingView style={styles.cardWrapper} behavior={'padding'}>
          <Animated.View style={[styles.card, {marginRight,marginLeft,height}]}>
            <Image style={styles.logo} source={require('../media/Daily.png')}/>
            <View style={styles.textWrapper}>
              <Text style={styles.label}>Stanford Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder={'Stanford Email'}
                keyboardType={'email-address'}
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholderTextColor={'#A5A5A5'}
                selectionColor={'#94171C'}
                onChangeText={(text) => this.setState({email: text})}
              />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.textInput}
                placeholder={'Password'}
                secureTextEntry={true}
                placeholderTextColor={'#A5A5A5'}
                selectionColor={'#94171C'}
                onChangeText={(text) => this.setState({password: text})}
              />
            </View>
            {this.state.currProcess === 'signIn' && <TouchableHighlight
              style={styles.signInButton}
              onPress={this.signIn.bind(this)}
              underlayColor='#4e4e4e'>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableHighlight>}
            {this.state.currProcess === 'signUp' && <View style={styles.textWrapper}>
              <Text style={styles.label}>Display Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder={'Display Name'}
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholderTextColor={'#A5A5A5'}
                selectionColor={'#94171C'}
                onChangeText={(text) => this.setState({displayName: text})}
              />
            </View>}
            <TouchableHighlight
              style={styles.signUpButton}
              onPress={this.signUp.bind(this)}
              underlayColor='#4e4e4e'>
                <Text style={styles.buttonText}>{this.state.signUpButtonLabel}</Text>
            </TouchableHighlight>
            {this.state.currProcess === 'signUp' &&
              <TouchableHighlight
                style={styles.signUpButton}
                onPress={this.backToSignIn.bind(this)}
                underlayColor='#4e4e4e'>
                  <Text style={styles.buttonText}>Back To Sign In</Text>
              </TouchableHighlight>
            }
          </Animated.View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }

}

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#94171C',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  close: {
    width: 17,
    height: 17,
    tintColor: 'white',
    marginTop: 21,
    marginRight: 14,
    alignSelf: 'flex-end',
    top: 0,
  },
  closeWrapper: {
    width: '100%',
  },
  cardWrapper: {
    justifyContent: 'center',
    flex: 1
  },
  card: {
    width: 335,
    backgroundColor: 'white',
    borderRadius: 13,
    alignItems: 'center'
  },
  logo: {
    width: 42,
    height: 37.8,
    tintColor: '#94171C',
    marginTop: 24,
    marginRight: 20
  },
  textWrapper: {
    width: '100%',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 15
  },
  label: {
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    color: '#4e4e4e',
    marginBottom: 4
  },
  textInput: {
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    color: '#4e4e4e',
    marginBottom: 4,
    width: '100%',
    height: 28,
    borderWidth: 1,
    borderColor: '#A5A5A5',
    borderRadius: 7,
    paddingLeft: 8,
    paddingRight: 8
  },
  signInButton: {
    backgroundColor:'#94171C',
    borderRadius:8,
    width: '94%',
    height: 38,
    marginTop: 13,
  },
  signUpButton: {
    backgroundColor:'#94171C',
    borderRadius:8,
    width: '94%',
    height: 38,
    marginTop: 7
  },
  buttonText:{
    color:'#fff',
    textAlign:'center',
    marginTop: 11,
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
  },
})
