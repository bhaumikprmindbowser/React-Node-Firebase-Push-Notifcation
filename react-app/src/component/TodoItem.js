import React from "react"
import {Trash, CheckSquare, Square, Edit} from "react-feather"

export default function TodoItem({
  todo,
  handleDelete,
  toggleComplete,
  onEditClick
}) {
  const {completed, title, description} = todo
  return (
    <div className="flex mb-4 items-center">
      <div className="flex flex-col gap-2 flex-1 text-left">
        <p className="w-full text-black font-semibold">{title}</p>
        <p className="w-full text-gray-darkest">{description}</p>
      </div>

      <button
        className={`flex-no-shrink p-1 ml-2 mr-2 border-2 rounded hover:text-blue-500 text-green border-green hover:bg-green ${
          completed ? "text-green-700" : "text-red-700"
        }`}
        onClick={toggleComplete}
      >
        {completed ? <CheckSquare fontSize={20} /> : <Square fontSize={20} />}
      </button>
      <button
        onClick={onEditClick}
        className="flex-no-shrink p-1 ml-2 mr-2 border-2 rounded hover:text-blue-500 text-green border-green hover:bg-green"
      >
        <Edit fontSize={20} />
      </button>
      <button
        className="flex-no-shrink p-1 ml-2 border-2 rounded text-red border-red hover:text-blue-500 hover:bg-red"
        onClick={handleDelete}
      >
        <Trash fontSize={20} />
      </button>
    </div>
  )
}
