import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchTodos, updateTodo, deleteTodo, toggleTodo } from '../store/todoSlice';

const TodoList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, status, error } = useSelector((state: RootState) => state.todos);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  const handleToggle = (id: string) => {
    dispatch(toggleTodo(id));
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      dispatch(updateTodo({ ...todo, completed: !todo.completed }));
    }
  };

  const handleDelete = (id: string) => {
    dispatch(deleteTodo(id));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Todos</h2>
      {todos.map(todo => (
        <div key={todo.id} className="flex items-center bg-white shadow-md rounded px-8 py-4 mb-4">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggle(todo.id)}
            className="mr-4"
          />
          <span className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.title}
          </span>
          <button
            onClick={() => handleDelete(todo.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default TodoList;

