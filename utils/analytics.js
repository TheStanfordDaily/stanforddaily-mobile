import { APIKEY, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID, SERVICE_ACCOUNT_ID, TECH_PASSWORD } from "@env"
import { initializeApp } from "firebase/app" 
import { getDatabase, ref, child, update } from "firebase/database"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { validateConfig } from "./format"
import { useNavigation } from "@react-navigation/native"

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

const SESSION_ID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
const TODAY = new Date().toISOString().split("T")[0]

const firebase = initializeApp(firebaseConfig)
const db = getDatabase(firebase)
const auth = getAuth(firebase)

var currentScreen;
export const onStateChange = (state) => {
    console.log(TODAY)
    const previousScreen = currentScreen;
    const currentRouteName = state.routes[state.index].name;
    const currentId = state.routes[state.index].params?.article?.id

    if (previousScreen !== currentRouteName) {
        // Update the current screen in the Firebase Realtime Database
        signInWithEmailAndPassword(auth, "tech@stanforddaily.com", TECH_PASSWORD).then((userCredential) => {
            const sessionRef = ref(db, `${TODAY}/${currentRouteName}/${currentId}`)
            update(sessionRef, { count: (currentScreen === currentRouteName && currentValue ? currentValue + 1 : 1) })
            // Update the current screen variable
            currentScreen = currentRouteName;
            currentValue = 1
        }).catch(error => console.trace("eedeee", error));
    } else {
        // Update the current screen counter in the Firebase Realtime Database
        const sessionRef = ref(db, `${TODAY}/${currentRouteName}/${currentId}`)
        const currentValue = child(sessionRef, 'count')
        update(sessionRef, { count: currentValue ? currentValue + 1 : 1 })
    }
}


//export const logExpoPushToken = (token, session) => {

// const useNavigationTracking = () => {
//   const navigation = useNavigation()
//   const [visitedScreens, setVisitedScreens] = useState([]);
  
//   useEffect(() => {
//     const unsubscribe = navigation.addListener('state', (event) => {
//       // Get the current route name
//       const currentRouteName = event.data.state.routeNames[event.data.state.index];
//       // Check if the current screen has already been visited
//       if (!visitedScreens.includes(currentRouteName)) {
//         // Add the current screen to the list of visited screens
//         setVisitedScreens([...visitedScreens, currentRouteName]);

//         // Add the current screen to the Firebase Realtime Database
//         const sessionRef = ref(db, `sessions/${sessionId}`);
//         update(child(sessionRef, `visited/${currentRouteName}`), { visited: true });
//       }
//     });

//     return unsubscribe;
//   }, [navigation, visitedScreens]);

//   return null;
// };