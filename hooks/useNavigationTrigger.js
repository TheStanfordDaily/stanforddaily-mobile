import { useEffect, useState } from "react";
import { getDatabase, ref, runTransaction } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Strings } from "../utils/constants";

export const useNavigationTrigger = (app, password, navigation) => {
  const [lastNavigationState, setLastNavigationState] = useState(null);
  const [sessionViews, setSessionViews] = useState({});

  useEffect(() => {
    return navigation.addListener("state", (state) => {
      if (state !== lastNavigationState) {
        setLastNavigationState(state);

        const auth = getAuth(app);
        const database = getDatabase(app);

        signInWithEmailAndPassword(auth, Strings.techEmailAddress, password).then(() => {
          const currentView = state.routes[state.index].name;

          // Add to impressions
          const impressionsRef = ref(database, `views/${currentView}/impressions`);
          runTransaction(impressionsRef, (impressions) => {
            return (impressions || 0) + 1;
          });

          // Add to sessions
          if (!sessionViews[currentView]) {
            const sessionsRef = ref(database, `views/${currentView}/sessions`);
            runTransaction(sessionsRef, (sessions) => {
              return (sessions || 0) + 1;
            });

            // Update sessionViews
            setSessionViews(prevSessionViews => {
              return { ...prevSessionViews, [currentView]: true };
            });
          }
        }).catch((error) => console.error(error));
      }
    });
  }, [navigation, app, password, lastNavigationState, sessionViews]);
};
