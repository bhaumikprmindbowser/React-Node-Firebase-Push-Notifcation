import {useEffect} from "react"
import "./App.css"
import NotificationComp from "./component/Notification"
import AuthProvider from "./provider/AuthProvider"
import Routes from "./routes"

function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("./firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Registration successful, scope is:", registration.scope)
        })
        .catch((err) => {
          console.log("Service worker registration failed, error:", err)
        })
    }
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
