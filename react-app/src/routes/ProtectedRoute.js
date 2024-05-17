import {Navigate, Outlet, useLocation} from "react-router-dom"
import {useAuth} from "../provider/AuthProvider"

export const ProtectedRoute = () => {
  const {token} = useAuth()
  const location = useLocation()

  // Check if the user is authenticated
  if (!token) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" state={{from: location}} replace />
  }

  // If authenticated, render the child routes
  return <Outlet />
}
