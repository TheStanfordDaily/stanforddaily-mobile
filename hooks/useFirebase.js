import { APIKEY, APP_ID, MEASUREMENT_ID, MESSAGING_SENDER_ID, SERVICE_ACCOUNT_ID } from "@env";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, push, ref } from "firebase/database";
import { useEffect, useState } from "react";

import { validateConfig } from "../utils/format";

const FIREBASE_CONFIG = {
  apiKey: APIKEY,
  authDomain: "daily-mobile-app-notifications.firebaseapp.com",
  databaseURL: "https://daily-mobile-app-notifications-default-rtdb.firebaseio.com",
  projectId: "daily-mobile-app-notifications",
  storageBucket: "daily-mobile-app-notifications.appspot.com",
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
  serviceAccountId: SERVICE_ACCOUNT_ID,
};

/**
 * This custom hook helps initialize a Firebase application and authenticate using email and password.
 * Once authenticated, it stores the Firebase app and database instances in its state and returns them.
 * It also pushes the provided Expo push token to the ExpoPushTokens node in the Firebase Realtime Database.
 * It is to be stored there for purposes of sending remote notifications, given the user has subscribed to them.
 * The hook uses useEffect to ensure the Firebase initialization and authentication process only runs
 * once when the component mounts, or if the expoPushToken or password changes.
 *
 * @param {string} expoPushToken - An anonymous Expo device token.
 * @param {string} password - A valid password for an official user account in Firebase write access.
 * @returns {Object} An object containing the initialized Firebase app and database instances.
 */
export const useFirebase = (expoPushToken, password) => {
  const [app, setApp] = useState(null);
  const [database, setDatabase] = useState(null);

  useEffect(() => {
    if (validateConfig(FIREBASE_CONFIG)) {
      const firebase = initializeApp(FIREBASE_CONFIG);
      const auth = getAuth(firebase);
      const db = getDatabase(firebase);

      signInWithEmailAndPassword(auth, "tech@stanforddaily.com", password)
        .then(() => {
          // Set the push token with current date.
          const tokensRef = ref(db, "ExpoPushTokens");
          push(tokensRef, expoPushToken);
          setApp(firebase);
          setDatabase(db);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [expoPushToken, password]);

  return { app, database };
};
