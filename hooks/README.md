# Hooks

## useFirebase
This custom hook helps initialize a Firebase application and authenticate using email and password.
Once authenticated, it stores the Firebase app and database instances in its state and returns them.
It also pushes the provided Expo push token to the ExpoPushTokens node in the Firebase Realtime Database.
It is to be stored there for purposes of sending remote notifications, given the user has subscribed to them.
The hook uses useEffect to ensure the Firebase initialization and authentication process only runs
once when the component mounts, or if the expoPushToken or password changes.

**Returns**: An object containing the initialized Firebase app and database instances.  

| Param | Type | Description |
| --- | --- | --- |
| expoPushToken | <code>string</code> | An anonymous Expo device token. |
| password | <code>string</code> | A valid password for an official user account in Firebase write access. |

## useWordPress
This custom hook retrieves posts from a WordPress site via `Model`.
It fetches posts based on different categories and includes pagination. It returns an object
containing the retrieved data, articles, loading status, and any error occurred during the fetch.
Data fetching only runs in `useWordPress` when the component mounts, or if `pageNumber` changes.

**Returns**: An object containing the retrieved data, articles, loading status, and any error occurred during the fetch.  

| Param | Type | Description |
| --- | --- | --- |
| pageNumber | <code>number</code> | The page number to fetch from WordPress. Defaults to 1. |

**Example**  
```js
const { data, articles, desks, loading, error } = useWordPress();
```
