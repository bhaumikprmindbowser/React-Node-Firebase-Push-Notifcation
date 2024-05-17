import express from "express"
import morgan from "morgan"
import bodyParser from "body-parser"
import cors from "cors"

import {router as todoRoutes} from "./api/routes/todos.js"
import {router as authRoutes} from "./api/routes/auth.js"

export const app = express()

app.use(morgan("dev"))
app.use("/uploads", express.static("uploads"))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(cors())

app.use("/todos", todoRoutes)
app.use("/auth", authRoutes)

app.use((req, res, next) => {
  const error = new Error("Not found")
  error.status = 404
  next(error)
})  

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})
