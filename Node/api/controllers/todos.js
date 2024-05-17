import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore"

import firebase from "../../firebase.js"
import {messaging} from "../../firebase-admin.js"

const db = getFirestore(firebase)
const collectionName = "todos"

export const todos_get_all = async (req, res, next) => {
  try {
    const todosQuery = query(
      collection(db, collectionName),
      where("userId", "==", req.user.uid)
    )
    const todos = await getDocs(todosQuery)
    const todoArray = []

    if (todos.empty) {
      res.status(200).json({
        message: "No Todos found",
        todos: []
      })
    } else {
      todos.forEach((doc) => {
        const updateDoc = {
          id: doc.id,
          ...doc.data()
        }
        todoArray.push(updateDoc)
      })

      res.status(200).json({
        todos: todoArray
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: error
    })
  }
}

export const todos_create_todo = async (req, res, next) => {
  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      completed: false,
      userId: req.user.uid
    }

    const docRef = await addDoc(collection(db, collectionName), data)

    // Retrieve the document data from Firestore using the docRef
    const docSnapshot = await getDoc(docRef)

    // Extract the document data
    const todo = docSnapshot.data()

    if (req.deviceToken) {
      const messageId = await messaging.send({
        token: req.deviceToken,
        notification: {
          title: "Todo Created",
          body: `Todo: ${data.title} created successfully`
        },
      })
      console.log("Successfully create sent message:", messageId)
    }

    await res.status(201).json({
      message: "Todo created successfully",
      todo: {
        id: docRef.id,
        ...todo
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: error
    })
  }
}

export const todos_get_todo = async (req, res, next) => {
  try {
    const todoId = req.params.todoId
    const todo = doc(db, collectionName, todoId)
    const data = await getDoc(todo)
    if (data.exists()) {
      res.status(200).json({
        todo: {
          id: data.id,
          ...data.data()
        }
      })
    } else {
      res.status(404).json({
        message: "Todo not found"
      })
    }
  } catch (error) {
    res.status(500).json({
      error: error
    })
  }
}

export const todos_delete_todo = async (req, res, next) => {
  try {
    const todoId = req.params.todoId
    await deleteDoc(doc(db, collectionName, todoId))

    if (req.deviceToken) {
      const messageId = await messaging.send({
        token: req.deviceToken,
        notification: {
          title: "Todo Deleted",
          body: `Todo deleted successfully`
        }
      })
      console.log("Successfully deleted sent message:", messageId)
    }

    res.status(200).json({
      message: "Todo deleted successfully"
    })
  } catch (error) {
    res.status(500).json({
      error: error
    })
  }
}

export const todos_update_todo = async (req, res, next) => {
  try {
    const todoId = req.params.todoId
    const data = req.body
    const todoRef = doc(db, collectionName, todoId)

    await updateDoc(todoRef, {...data, userId: req.user.uid})

    if (req.deviceToken) {
      const messageId = await messaging.send({
        token: req.deviceToken,
        notification: {
          title: "Todo Updated",
          body: `Todo: ${data.title} updated successfully`
        }
      })
      console.log("Successfully update sent message:", messageId)
    }

    res.status(200).json({
      message: "Todo updated successfully",
      todo: {
        id: todoId,
        ...data
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: error
    })
  }
}
