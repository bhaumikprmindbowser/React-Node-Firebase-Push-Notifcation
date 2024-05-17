import admin from "firebase-admin"

import serviceAccount from "./serviceAccountKey.json" assert {type: "json"}
import config from "./config.js"

export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.firebaseConfig.databaseURL
})

export const db = admin.firestore(firebaseApp)

export const messaging = admin.messaging(firebaseApp)

export async function sendNotification(payload) {
  // Send the push notification using Firebase Cloud Messaging
  const response = await admin.messaging().send(payload)
  console.log("Successfully sent message:", response)
}
