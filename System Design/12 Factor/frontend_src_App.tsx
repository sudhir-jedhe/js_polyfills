import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Task {
  id: number;
  title: string;
  description: string;
}

interface User {
  id: number;
  username: string;
  role: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (token) {
      setIsLoggedIn(true);
      setIsAdmin(userRole === 'admin');
      fetchTasks();
      if (userRole === 'admin') {
        fetchUsers();
      }
    }
    setLoadTime(performance.now());
  }, []);

  useEffect(() => {
    if (loadTime !== null) {
      api.post('/metrics/pageload', { loadTime });
    }
  }, [loadTime]);

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    withCredentials: true
  });

  const fetchTasks = async () => {
    try {
      const startTime = performance.now();
      const response = await api.get<Task[]>('/tasks');
      const endTime = performance.now();
      setTasks(response.data);
      api.post('/metrics/apiresponse', { 
        endpoint: '/tasks', 
        responseTime: endTime - startTime 
      });
    } catch (error) {
      toast.error('Error fetching tasks');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get<User[]>('/admin/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Error fetching users');
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startTime = performance.now();
      await api.post('/tasks', { title, description });
      const endTime = performance.now();
      setTitle('');
      setDescription('');
      fetchTasks();
      toast.success('Task created successfully');
      api.post('/metrics/apiresponse', { 
        endpoint: '/tasks', 
        responseTime: endTime - startTime 
      });
    } catch (error) {
      toast.error('Error creating task');
    }
  };

  const updateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      const startTime = performance.now();
      await api.put(`/tasks/${editingTask.id}`, { title, description });
      const endTime = performance.now();
      setTitle('');
      setDescription('');
      setEditingTask(null);
      fetchTasks();
      toast.success('Task updated successfully');
      api.post('/metrics/apiresponse', { 
        endpoint: `/tasks/${editingTask.id}`, 
        responseTime: endTime - startTime 
      });
    } catch (error) {
      toast.error('Error updating task');
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const startTime = performance.now();
      await api.delete(`/tasks/${id}`);
      const endTime = performance.now();
      fetchTasks();
      toast.success('Task deleted successfully');
      api.post('/metrics/apiresponse', { 
        endpoint: `/tasks/${id}`, 
        responseTime: endTime - startTime 
      });
    } catch (error) {
      toast.error('Error deleting task');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startTime = performance.now();
      await api.post('/register', { username, password, role });
      const endTime = performance.now();
      toast.success('Registered successfully. Please log in.');
      api.post('/metrics/apiresponse', { 
        endpoint: '/register', 
        responseTime: endTime - startTime 
      });
    } catch (error) {
      toast.error('Error registering');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startTime = performance.now();
      const response = await api.post('/login', { username, password });
      const endTime = performance.now();
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      setIsLoggedIn(true);
      setIsAdmin(response.data.role === 'admin');
      fetchTasks();
      if (response.data.role === 'admin') {
        fetchUsers();
      }
      toast.success('Logged in successfully');
      api.post('/metrics/apiresponse', { 
        endpoint: '/login', 
        responseTime: endTime - startTime 
      });
    } catch (error) {
      toast.error('Error logging in');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      setIsLoggedIn(false);
      setIsAdmin(false);
      setTasks([]);
      setUsers([]);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="App">
        <h1>Task Manager</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Register</button>
        </form>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <button onClick={handleLogout}>Logout</button>
      <form onSubmit={editingTask ? updateTask : createTask}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
        />
        <button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <button onClick={() => setEditingTask(task)}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {isAdmin && (
        <div>
          <h2>User Management</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.username} - {user.role}
              </li>
            ))}
          </ul>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;

