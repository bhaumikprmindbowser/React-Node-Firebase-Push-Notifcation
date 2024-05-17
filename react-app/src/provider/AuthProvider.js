import API from "../api"
import {createContext, useContext, useEffect, useMemo, useState} from "react"
import {messaging} from "../firebase"
import {getToken} from "firebase/messaging"

const AuthContext = createContext()

const AuthProvider = ({children}) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem("token"))
  const [user, setUser] = useState(null)
  const [deviceToken, setDeviceToken] = useState(
    localStorage.getItem("deviceToken") || null
  )

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken)
  }

  useEffect(() => {
    if (token) {
      API.defaults.headers.common["Authorization"] = "Bearer " + token
      localStorage.setItem("token", token)
    } else {
      delete API.defaults.headers.common["Authorization"]
      localStorage.removeItem("token")
    }
  }, [token])

  useEffect(() => {
    if (deviceToken) {
      API.defaults.headers.common["x-device-token"] = deviceToken
      localStorage.setItem("deviceToken", deviceToken)
    } else {
      delete API.defaults.headers.common["x-device-token"]
      localStorage.removeItem("deviceToken")
    }
  }, [deviceToken])

  const signup = async ({email, password}) => {
    try {
      const {data} = await API.post("/auth/signup", {email, password})
      const {token, user} = data
      const deviceToken = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
      })
      setToken(token)
      setUser(user)
      setDeviceToken(deviceToken)
      return data
    } catch (error) {
      return Promise.reject(error.response.data)
    }
  }

  const signin = async ({email, password}) => {
    try {
      const response = await API.post("/auth/signin", {email, password})
      console.log(response, "response")
      const {token, user} = response.data
      const deviceToken = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
      })
      console.log(deviceToken, "deviceToken")
      setToken(token)
      setUser(user)
      setDeviceToken(deviceToken)
      return response.data
    } catch (error) {
      console.log(error, "error")
      return Promise.reject(error.response.data)
    }
  }

  const signout = async () => {
    try {
      await API.post("/auth/signout")
      setToken(null)
      setUser(null)
      setDeviceToken(null)
    } catch (error) {
      return Promise.reject(error.response.data)
    }
  }

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      user,
      signin,
      signup,
      signout
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, user]
  )

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export default AuthProvider
