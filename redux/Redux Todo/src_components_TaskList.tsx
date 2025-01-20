import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { deleteTask, toggleTaskCompletion } from '../store/taskSlice';
import { Task } from '../types/Task';
import TaskForm from './TaskForm';

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleDelete = (id: string) => {
    dispatch(deleteTask(id));
  };

  const handleToggleCompletion = (id: string) => {
    dispatch(toggleTaskCompletion(id));
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleEditComplete = () => {
    setEditingTask(null);
  };

  return (
    <div>
      {editingTask && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Edit Task</h2>
          <TaskForm taskToEdit={editingTask} onEditComplete={handleEditComplete} />
        </div>
      )}
      <h2 className="text-2xl font-bold mb-2">Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet. Add a task to get started!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="mb-4 p-4 border rounded">
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <p className="mb-2">{task.description}</p>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleCompletion(task.id)}
                  className="mr-2"
                />
                <span className={task.completed ? 'line-through' : ''}>
                  {task.completed ? 'Completed' : 'Incomplete'}
                </span>
                <button
                  onClick={() => handleEdit(task)}
                  className="ml-auto mr-2 px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;

