import React, {useState, useEffect} from "react"
import toast, {Toaster} from "react-hot-toast"
// import {messaging} from "../firebase"
import {onMessage, getMessaging} from "firebase/messaging"

const Notification = () => {
  const [notification, setNotification] = useState({title: "", body: ""})
  const notify = () => toast(<ToastDisplay />)
  function ToastDisplay() {
    return (
      <div>
        <p>
          <b>{notification?.title}</b>
        </p>
        <p>{notification?.body}</p>
      </div>
    )
  }

  useEffect(() => {
    if (notification?.title) {
      notify()
    }
  }, [notification])

  useEffect(() => {
    const messaging = getMessaging()
    const unsubscribe = onMessage(messaging, (payload) => {
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body
      })
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return <Toaster />
}

export default Notification
