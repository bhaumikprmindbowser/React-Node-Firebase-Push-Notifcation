import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"

import firebase from "../../firebase.js"

const auth = getAuth(firebase)

export const singup = async (req, res, next) => {
  const {email, password} = req.body

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user

    // Get Firebase token
    const token = await user.getIdToken()

    res
      .status(201)
      .json({
        message: "User created successfully",
        token,
        user: user.toJSON()
      })
  } catch (error) {
    console.error("Error creating user:", error.message)
    res.status(400).json({error: error.message})
  }
}

export const singin = async (req, res, next) => {
  const {email, password} = req.body

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user

    // Get Firebase token
    const token = await user.getIdToken()

    res.status(200).json({
      message: "User signed in successfully",
      token,
      user: user.toJSON()
    })
  } catch (error) {
    console.error("Error signing in:", error.message)
    res.status(401).json({error: "Invalid credentials"})
  }
}

export const signout = async (req, res, next) => {
  try {
    await signOut(auth)
    res.status(200).json({message: "User signed out successfully"})
  } catch (error) {
    console.error("Error signing out:", error.message)
    res.status(500).json({error: error.message})
  }
}

export const token = async (req, res, next) => {
  try {
    const decodedToken = await auth.currentUser.getIdToken(true)
    res.status(200).json({
      token: decodedToken
    })
  } catch (error) {
    console.error("Error fetching user:", error.message)
    res.status(500).json({error: error.message})
  }

}