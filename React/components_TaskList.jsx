import React, { useState } from "react"
import { v4 as uuidv4 } from "uuid"

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState("all")

  const addTask = (e) => {
    e.preventDefault()
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: uuidv4(), text: newTask, completed: false }])
      setNewTask("")
    }
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const startEditing = (task) => {
    setEditingTask({ ...task })
  }

  const saveEdit = () => {
    setTasks(tasks.map((task) => (task.id === editingTask.id ? editingTask : task)))
    setEditingTask(null)
  }

  const cancelEdit = () => {
    setEditingTask(null)
  }

  const toggleComplete = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  return (
    <div>
      <form onSubmit={addTask} className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Task
        </button>
      </form>
      <div className="mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`mr-2 p-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`mr-2 p-2 rounded ${filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`p-2 rounded ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Completed
        </button>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} className={`mb-2 p-2 border ${task.completed ? "bg-green-100" : ""}`}>
            {editingTask && editingTask.id === task.id ? (
              <div>
                <input
                  type="text"
                  value={editingTask.text}
                  onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                  className="border p-1 mr-2"
                />
                <button onClick={saveEdit} className="bg-green-500 text-white p-1 rounded mr-2">
                  Save
                </button>
                <button onClick={cancelEdit} className="bg-gray-500 text-white p-1 rounded">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="mr-2"
                  />
                  <span className={task.completed ? "line-through" : ""}>{task.text}</span>
                </div>
                <div>
                  <button onClick={() => startEditing(task)} className="bg-yellow-500 text-white p-1 rounded ml-2 mr-2">
                    Edit
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="bg-red-500 text-white p-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskList

