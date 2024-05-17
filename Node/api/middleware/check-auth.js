import admin from "firebase-admin"

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]

    if (!token) {
      throw new Error("Authorization token not provided")
    }

    // Verify ID token
    const decodedToken = await admin.auth().verifyIdToken(token)

    const deviceToken = req.headers["x-device-token"]

    // Attach authenticated user's information to the request object
    req.user = decodedToken
    req.token = token
    req.deviceToken = deviceToken

    next()
  } catch (error) {
    console.error("Error authenticating user:", error.message)
    res.status(401).json({error: "Unauthorized"})
  }
}
