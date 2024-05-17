import React, {useRef, useState} from "react"
import {Navigate, useNavigate, useLocation} from "react-router-dom"
import {useAuth} from "../provider/AuthProvider"

export default function Login() {
  const [isLogin, setLogin] = useState(true)
  const [error, setError] = useState(null)
  const emailRef = useRef()
  const passwordRef = useRef()
  const {signin, signup, token} = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/"

  const onFormSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const emailValue = emailRef.current?.value ?? ""
      const passwordValue = passwordRef.current?.value ?? ""
      const validInputs = Boolean(emailValue && passwordValue)
      if (!validInputs) {
        throw new Error("Please provide both an email and a password.")
      }
      const requestData = {
        email: emailValue,
        password: passwordValue
      }
      if (isLogin) {
        await signin(requestData)
      } else {
        await signup(requestData)
      }
      // return redirect("/todos")
      navigate(from)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        setError(error.message)
        return
      }
      setError(error.error)
    }
  }

  if (token) {
    // If authenticated, redirect to the Home page
    return <Navigate to="/" />
  }

  return (
    <div className="flex min-h-full flex-col justify-center mt-5 px-3 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-sm bg-white rounded shadow">
      <div className="w-full">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {!isLogin ? "Signup" : "Signin"} in to your account
        </h2>
      </div>

      <div className="mt-10 w-full">
        <form onSubmit={onFormSubmit} className="space-y-6">
          <fieldset>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
              </div>

              <div className="mt-2">
                <input
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  // autoComplete="email"
                  autoComplete="off"
                  required
                  placeholder="Email address"
                  aria-label="Email address"
                  autoFocus
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type="password"
                  // autoComplete="current-password"
                  autoComplete="off"
                  placeholder="Password"
                  aria-label="Password"
                  minLength={8}
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </fieldset>
          {error && typeof error === "string" ? (
            <p>
              <mark>
                <small>{error}</small>
              </mark>
            </p>
          ) : (
            <br />
          )}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {!isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm text-gray-500">
          <button
            onClick={() => setLogin(!isLogin)}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {!isLogin ? "Already have an account?" : `Don't have account?`}
          </button>
        </p>
      </div>
    </div>
  )
}
