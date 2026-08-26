import axios from 'axios';
import { User } from '../types/User';

const API_URL = 'https://jsonplaceholder.typicode.com';

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  addUser: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  },

  updateUser: async (user: User): Promise<User> => {
    const response = await axios.put(`${API_URL}/users/${user.id}`, user);
    return response.data;
  },

  patchUser: async (id: number, partialUser: Partial<User>): Promise<User> => {
    const response = await axios.patch(`${API_URL}/users/${id}`, partialUser);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/users/${id}`);
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  getUserPosts: async (userId: number): Promise<Post[]> => {
    const response = await axios.get(`${API_URL}/users/${userId}/posts`);
    return response.data;
  },

  getPostComments: async (postId: number): Promise<Comment[]> => {
    const response = await axios.get(`${API_URL}/posts/${postId}/comments`);
    return response.data;
  }
};

