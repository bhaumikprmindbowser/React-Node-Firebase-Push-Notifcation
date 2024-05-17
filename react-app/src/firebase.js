import {initializeApp} from "firebase/app"
import {config} from "./config"
import {getAuth} from "firebase/auth"
import {getMessaging} from "firebase/messaging"

const {firebaseConfig} = config

export const firebase = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  databaseURL: firebaseConfig.databaseURL,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
})

export const auth = getAuth(firebase)

export const messaging = getMessaging(firebase)

// messaging.onTokenRefresh(() => {
//   messaging
//     .getToken()
//     .then((refreshedToken) => {
//       console.log("Token refreshed:", refreshedToken)
//       // Send the updated token to your backend to update the subscription
//       // You need to implement this function
//       updateTokenOnServer(refreshedToken)
//     })
//     .catch((error) => {
//       console.error("Error refreshing token:", error)
//     })
// })
