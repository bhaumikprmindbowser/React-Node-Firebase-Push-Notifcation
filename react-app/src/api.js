import axios from "axios"
const API = axios.create({
  baseURL: "http://localhost:5000"
})

API.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token")
    const deviceToken = localStorage.getItem("deviceToken")
    config.headers.Authorization = token ? `Bearer ${token}` : ""
    config.headers["devicetoken"] = deviceToken ? deviceToken : ""
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

API.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    if (error.response.status === 401 && localStorage.getItem("token")) {
      const refreshToken = localStorage.getItem("refreshToken")
      if (refreshToken) {
        try {
          const response = await API.post("/auth/refresh-token", {refreshToken})
          const {token} = response.data
          localStorage.setItem("token", token)
          error.config.headers.Authorization = `Bearer ${token}`
          return axios(error.config)
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError)
          localStorage.removeItem("token")
          localStorage.removeItem("refreshToken")
          localStorage.removeItem("deviceToken")
          window.location.href = "/login"
        }
      } else {
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("deviceToken")
        window.location.href = "/login"
        // No refresh token available, handle accordingly (e.g., redirect to login)
      }
    }
    return Promise.reject(error)
  }
)

export default API
