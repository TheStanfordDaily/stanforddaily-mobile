import { APIKEY, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID, SERVICE_ACCOUNT_ID, TECH_PASSWORD } from "@env"
import { initializeApp } from "firebase/app" 
import { getDatabase, ref, push, set } from "firebase/database"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: "daily-mobile-app-notifications.firebaseapp.com",
  databaseURL: "https://daily-mobile-app-notifications-default-rtdb.firebaseio.com",
  projectId: "daily-mobile-app-notifications",
  storageBucket: "daily-mobile-app-notifications.appspot.com",
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
  serviceAccountId: SERVICE_ACCOUNT_ID
}

const firebase = initializeApp(firebaseConfig)
const database = getDatabase(firebase)
const auth = getAuth(firebase)

export const logNavigationEvent = (screenName, session) => {
  if (!validateConfig(firebaseConfig)) return;
  const ref = firebase.database().ref(`navigationEvents/${session}`);
  
  ref.once('value', (snapshot) => {
    const visitedScreens = snapshot.val() || {};
    if (!visitedScreens[screenName]) {
      visitedScreens[screenName] = true;
      ref.set(visitedScreens);
    }
  });
};