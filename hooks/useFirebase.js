import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { validateConfig } from "../utils/format";
import { Strings } from "../utils/constants";
import { APIKEY, APP_ID, MEASUREMENT_ID, MESSAGING_SENDER_ID, SERVICE_ACCOUNT_ID } from "@env";

const FIREBASE_CONFIG = {
  apiKey: APIKEY,
  authDomain: "daily-mobile-app-notifications.firebaseapp.com",
  databaseURL: "https://daily-mobile-app-notifications-default-rtdb.firebaseio.com",
  projectId: "daily-mobile-app-notifications",
  storageBucket: "daily-mobile-app-notifications.appspot.com",
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
  serviceAccountId: SERVICE_ACCOUNT_ID
};

export const useFirebase = (expoPushToken, password) => {
  const [app, setApp] = useState(null);
  const [database, setDatabase] = useState(null);

  useEffect(() => {
    if (validateConfig(FIREBASE_CONFIG)) {
      const app = initializeApp(FIREBASE_CONFIG);

      const auth = getAuth(app);
      const database = getDatabase(app);

      signInWithEmailAndPassword(auth, Strings.techEmailAddress, password)
        .then(() => {
        // Set the push token with current date
          const tokensRef = ref(database, "ExpoPushTokens");
          push(tokensRef, expoPushToken);
          setApp(app);
          setDatabase(database);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [expoPushToken, password]);

  return { app, database };
};
