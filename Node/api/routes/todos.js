import express from "express"
import {
  todos_get_all,
  todos_create_todo,
  todos_get_todo,
  todos_delete_todo,
  todos_update_todo
} from "../controllers/todos.js"
import {authMiddleware} from "../middleware/check-auth.js"

export const router = express.Router()

router.get("/", authMiddleware, todos_get_all)

router.post("/", authMiddleware, todos_create_todo)

router.get("/:todoId", authMiddleware, todos_get_todo)

router.delete("/:todoId", authMiddleware, todos_delete_todo)

router.put("/:todoId", authMiddleware, todos_update_todo)
