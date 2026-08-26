import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Redux Toolkit Todo App</h1>
        <AddTodoForm />
        <TodoList />
      </div>
    </Provider>
  );
};

export default App;

