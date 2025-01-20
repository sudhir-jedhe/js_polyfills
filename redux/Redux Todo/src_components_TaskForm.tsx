import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../store/taskSlice';
import { Task } from '../types/Task';
import { v4 as uuidv4 } from 'uuid';

interface TaskFormProps {
  taskToEdit?: Task;
  onEditComplete?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ taskToEdit, onEditComplete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
    }
  }, [taskToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      if (taskToEdit) {
        dispatch(updateTask({ ...taskToEdit, title, description }));
        if (onEditComplete) onEditComplete();
      } else {
        dispatch(addTask({
          id: uuidv4(),
          title,
          description,
          completed: false,
        }));
      }
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        {taskToEdit ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;

