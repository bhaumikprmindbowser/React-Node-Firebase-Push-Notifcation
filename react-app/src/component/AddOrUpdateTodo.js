import React, {useState, useRef} from "react"
import API from "../api"
import Modal from "./Modal"

export default function AddOrUpdateTodo({
  open,
  onClose,
  currentTodo,
  setTodos
}) {
  return (
    <Modal open={open} onClose={onClose}>
      {open && (
        <AddOrUpdateTodoForm
          currentTodo={currentTodo}
          setTodos={setTodos}
          onClose={onClose}
        />
      )}
    </Modal>
  )
}

function AddOrUpdateTodoForm({currentTodo, setTodos, onClose}) {
  const [error, setError] = useState(null)
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    const title = titleRef.current.value
    const description = descriptionRef.current.value
    const requestData = {
      title,
      description,
      completed: currentTodo?.completed ?? false
    }
    try {
      if (currentTodo) {
        const {data} = await API.put(`/todos/${currentTodo.id}`, requestData)
        setTodos((prev) => {
          const index = prev.findIndex((todo) => todo.id === currentTodo.id)
          prev[index] = data.todo
          return [...prev]
        })
      } else {
        const {data} = await API.post("/todos", requestData)
        setTodos((prev) => [...prev, data.todo])
      }
      titleRef.current = ""
      descriptionRef.current = ""
      onClose()
    } catch (error) {
      console.log(error)
      setError("Failed to add/update todo")
    }
  }

  return (
    <div className="text-center w-full">
      <div className="mx-auto my-4 w-48">
        <h3 className="text-lg font-black text-gray-800">
          {currentTodo ? "Update" : "Create"} Todo
        </h3>
      </div>
      <div>
        <form onSubmit={onSubmit}>
          <fieldset>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Title
                </label>
              </div>

              <div className="mt-2">
                <input
                  ref={titleRef}
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="Title for Todo"
                  aria-label="Title for Todo"
                  autoFocus
                  defaultValue={currentTodo ? currentTodo.title : ""}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
              </div>
              <div className="mt-2">
                <input
                  ref={descriptionRef}
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Description for Todo"
                  aria-label="Description for Todo"
                  required
                  defaultValue={currentTodo ? currentTodo.description : ""}
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
              {currentTodo ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
