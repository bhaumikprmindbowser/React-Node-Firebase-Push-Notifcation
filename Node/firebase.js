// import {initializeApp} from "firebase/app"

// const firebaseConfig = {
//   apiKey: "AIzaSyAFpV715P6krFxL5DVQ-pGMvUs5svx1QV4",
//   authDomain: "fir-node-e7a6e.firebaseapp.com",
//   projectId: "fir-node-e7a6e",
//   storageBucket: "fir-node-e7a6e.appspot.com",
//   messagingSenderId: "944927119874",
//   appId: "1:944927119874:web:7b16fc3badaa500b0be51b"
// }

// const app = initializeApp(firebaseConfig)


import {initializeApp} from "firebase/app"
import config from "./config.js"

const firebase = initializeApp(config.firebaseConfig)

export default firebase
