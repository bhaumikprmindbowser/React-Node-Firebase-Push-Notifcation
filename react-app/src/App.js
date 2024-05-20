import {useEffect} from "react"
import "./App.css"
import NotificationComp from "./component/Notification"
import AuthProvider from "./provider/AuthProvider"
import Routes from "./routes"
import {config} from "./config"

function App() {
  const registerServiceWorker = async () => {
    let scriptURL = "./firebase-messaging-sw.js"
    scriptURL += `?apiKey=${config.firebaseConfig.apiKey}`
    scriptURL += `&authDomain=${config.firebaseConfig.authDomain}`
    scriptURL += `&projectId=${config.firebaseConfig.projectId}`
    scriptURL += `&databaseURL=${config.firebaseConfig.databaseURL}`
    scriptURL += `&storageBucket=${config.firebaseConfig.storageBucket}`
    scriptURL += `&messagingSenderId=${config.firebaseConfig.messagingSenderId}`
    scriptURL += `&appId=${config.firebaseConfig.appId}`

    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(scriptURL)
        if (registration.installing) {
          console.log("Service worker installing")
        } else if (registration.waiting) {
          console.log("Service worker installed")
        } else if (registration.active) {
          console.log("Service worker active")
        }
      } catch (error) {
        console.error(`Registration failed with ${error}`)
      }
    }
  }
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return (
    <div className=" text-center">
      <AuthProvider>
        <Routes />
      </AuthProvider>
      <NotificationComp />
    </div>
  )
}

export default App
