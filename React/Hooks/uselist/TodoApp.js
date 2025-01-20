import React, { useState } from 'react';
import useList from './useList';

const TodoApp = () => {
  const { list, addItem, removeItem, updateItem, clearList } = useList();
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handleAddTask = () => {
    if (newTask) {
      addItem(newTask);
      setNewTask('');
    }
  };

  const handleEditTask = () => {
    if (editIndex !== null && editTask) {
      updateItem(editIndex, editTask);
      setEditIndex(null);
      setEditTask('');
    }
  };

  return (
    <div>
      <h2>Todo App</h2>

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add new task"
      />
      <button onClick={handleAddTask}>Add Task</button>

      {editIndex !== null && (
        <>
          <input
            type="text"
            value={editTask}
            onChange={(e) => setEditTask(e.target.value)}
            placeholder="Edit task"
          />
          <button onClick={handleEditTask}>Update Task</button>
        </>
      )}

      <ul>
        {list.map((task, index) => (
          <li key={index}>
            {task}
            <button onClick={() => removeItem(index)}>Remove</button>
            <button onClick={() => {
              setEditTask(task);
              setEditIndex(index);
            }}>
              Edit
            </button>
          </li>
        ))}
      </ul>

      <button onClick={clearList}>Clear All</button>
    </div>
  );
};

export default TodoApp;
