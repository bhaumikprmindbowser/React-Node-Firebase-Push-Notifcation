import React, {useEffect, useState} from "react"
import API from "../api"
import {PlusSquare, LogOut} from "react-feather"
import {useAuth} from "../provider/AuthProvider"
import TodoItem from "../component/TodoItem"
import AddOrUpdateTodo from "../component/AddOrUpdateTodo"

export default function Todo() {
  const [todos, setTodos] = useState([])
  const [error, setError] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [currentTodo, setCurrentTodo] = useState(null)
  const {signout} = useAuth()

  useEffect(() => {
    ;(async () => {
      const {data} = await API.get("/todos")
      setTodos(data.todos)
    })()
  }, [])

  const closeDialog = () => {
    setCurrentTodo(null)
    setOpenDialog(false)
  }

  const handleDelete = async (id) => {
    try {
      setError(null)
      await API.delete(`/todos/${id}`)
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    } catch (error) {
      console.error(error)
      setError("Failed to delete todo")
    }
  }

  const toggleComplete = async (todo) => {
    try {
      const {data} = await API.put(`/todos/${todo.id}`, {
        ...todo,
        completed: !todo.completed
      })
      setTodos((prev) => {
        const index = prev.findIndex((todoI) => todoI.id === todo.id)
        prev[index] = data.todo
        return [...prev]
      })
    } catch (error) {
      console.error(error)
      setError("Failed to toggle todo")
    }
  }

  const handleLogout = async () => {
    try {
      await signout()
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
    } catch (error) {
      setError("Failed to logout")
    }
  }

  return (
    <div className="w-full flex items-center justify-center bg-teal-lightest font-sans">
      <AddOrUpdateTodo
        open={openDialog}
        onClose={closeDialog}
        currentTodo={currentTodo}
        setTodos={setTodos}
      />
      <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
        <div className="mb-4">
          <div className="flex text-center items-center">
            <h1 className="text-grey-darkest flex-1 font-extrabold">
              Todo List
            </h1>
            <button
              className="ml-auto flex-no-shrink p-1 mr-2 border-2 rounded text-teal border-teal hover:text-blue-500 hover:bg-teal"
              onClick={handleLogout}
            >
              <LogOut fontSize={20} />
            </button>
          </div>
          <div className="flex mt-4">
            <button
              className="flex-no-shrink p-2 border-2 rounded text-teal border-teal hover:text-blue-500 hover:bg-teal"
              onClick={() => {
                setCurrentTodo(null)
                console.log(currentTodo,"current")
                setOpenDialog(true)
              }}
            >
              <PlusSquare fontSize={20} />
            </button>
          </div>
        </div>
        <div>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEditClick={() => {
                setCurrentTodo(todo)
                setOpenDialog(true)
              }}
              handleDelete={(e) => {
                handleDelete(todo.id)
              }}
              toggleComplete={(e) => {
                toggleComplete(todo)
              }}
            />
          ))}
        </div>
        {error && typeof error === "string" ? (
          <p>
            <mark>
              <small>{error}</small>
            </mark>
          </p>
        ) : (
          <br />
        )}
      </div>
    </div>
  )
}
