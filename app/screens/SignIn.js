import React, {Component} from 'react';
import firebase from 'firebase';

import {
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
  Animated,
  Dimensions,
} from 'react-native';

import styles from './styles/signin.js';
import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationActions} from 'react-navigation';
import {HEIGHTS, STRINGS, Images, ICONS, COLORS} from '../assets/constants.js';

const {width, height} = Dimensions.get('window');

export default class SignIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
        marginRight: new Animated.Value(0),
        marginLeft: new Animated.Value(0),
        height: HEIGHTS.SIGN_IN_CARD,
        currProcess: STRINGS.SIGN_IN,
        signUpButtonLabel: 'Not a user? Sign Up'
    };
  }

  //Goes back when 'x' is tapped
  dismissModal() {
    this.props.navigation.dispatch(NavigationActions.back());
  }

  //Attempts signing in the user using firebase
  signIn() {
    var firebaseApp = firebase.apps[0];
    var load = this.props.navigation.state.params.loadPosts;
    var view = this;
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function(user) {
      //In case of success load the chatter and go back to it
        load();
        view.dismissModal();
    }).catch(function(error) {
      //In case of failure print a message explaining the problem
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

  //Animation to show sign up card
  prepareSignUpCard() {
    this.setState({
      height: HEIGHTS.SIGN_UP_CARD,
      currProcess: STRINGS.SIGN_UP,
      signUpButtonLabel: 'Sign Up'
    });
    Animated.timing(this.state.marginLeft, {
      toValue: 0,
      duration: 400
    }).start();
  }

  //Animation to swap out sign in card and get sign up
  showSignUp() {
    var view = this;
    Animated.timing(this.state.marginLeft, {
      toValue: width*2,
      duration: 400
    }).start(view.prepareSignUpCard.bind(view));
  }

  //Animation to swap out sign up card and get sign in
  backToSignIn() {
    var view = this;
    Animated.timing(this.state.marginLeft, {
      toValue: width*2,
      duration: 400
    }).start(view.prepareSignInCard.bind(view));
  }

  //Animation to show sign in card
  prepareSignInCard() {
    this.setState({
      height: HEIGHTS.SIGN_IN_CARD,
      currProcess: STRINGS.SIGN_IN,
      signUpButtonLabel: 'Not a user? Sign Up'
    });
    Animated.timing(this.state.marginLeft, {
      toValue: 0,
      duration: 400
    }).start();
  }

  //Attempts to sign up the user
  actuallySignUp() {

    // Commence call to firebase to register user
    var emailDomain = this.state.email.substring(this.state.email.length - 12);
    // console.log('email' + emailDomain);
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
              //alert('other problem')
          }
        });
      } else {
        //alert('Not a stanford student')
      }
  }


  signUp() {
    // Keyboard.dismiss();
    if(this.state.currProcess === STRINGS.SIGN_IN) {
      this.showSignUp();
    } else {
      this.actuallySignUp();
    }
  }

  render() {
    /* Breakdown:
     * Scrollview that wraps around the 'x' and the cards
     * The cards are keyboardavoiding to allow easy typing and animated to allow the animations
     * At the top is the "S"
     * Then the 2 text inputs with their labels
     * A third text box is added in sign up
     * The 2 remaining buttons depens on the process whether sign in or sign up
     */
    const {marginRight,marginLeft,height} = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar
          hidden={true}
        />
        <View style={styles.closeWrapper}>
          <TouchableWithoutFeedback onPress={this.dismissModal.bind(this)}>
            <Image style={styles.close} source={Images.CLOSE}/>
          </TouchableWithoutFeedback>
        </View>
        <KeyboardAvoidingView style={styles.cardWrapper} behavior={'padding'}>
          <Animated.View style={[styles.card, {marginRight,marginLeft,height}]}>
            <Image style={styles.logo} source={Images.DAILY_S}/>
            <View style={styles.textWrapper}>
              <Text style={styles.label}>Stanford Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder={'Stanford Email'}
                keyboardType={'email-address'}
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholderTextColor={COLORS.LIGHT_GRAY}
                selectionColor={COLORS.CARDINAL}
                onChangeText={(text) => this.setState({email: text})}
              />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.textInput}
                placeholder={'Password'}
                secureTextEntry={true}
                placeholderTextColor={COLORS.LIGHT_GRAY}
                selectionColor={COLORS.CARDINAL}
                onChangeText={(text) => this.setState({password: text})}
              />
            </View>
            {this.state.currProcess === STRINGS.SIGN_IN && <TouchableHighlight
              style={styles.signInButton}
              onPress={this.signIn.bind(this)}
              underlayColor={COLORS.DARK_GRAY}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableHighlight>}
            {this.state.currProcess === STRINGS.SIGN_UP && <View style={styles.textWrapper}>
              <Text style={styles.label}>Display Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder={'Display Name'}
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholderTextColor={COLORS.LIGHT_GRAY}
                selectionColor={COLORS.CARDINAL}
                onChangeText={(text) => this.setState({displayName: text})}
              />
            </View>}
            <TouchableHighlight
              style={styles.signUpButton}
              onPress={this.signUp.bind(this)}
              underlayColor={COLORS.DARK_GRAY}>
                <Text style={styles.buttonText}>{this.state.signUpButtonLabel}</Text>
            </TouchableHighlight>
            {this.state.currProcess === STRINGS.SIGN_UP &&
              <TouchableHighlight
                style={styles.signUpButton}
                onPress={this.backToSignIn.bind(this)}
                underlayColor={COLORS.DARK_GRAY}>
                  <Text style={styles.buttonText}>Back</Text>
              </TouchableHighlight>
            }
          </Animated.View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }

}
