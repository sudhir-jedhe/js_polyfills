import axios from 'axios';
import { User } from '../types/User';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  addUser: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await axios.post(API_URL, user);
    return response.data;
  },

  updateUser: async (user: User): Promise<User> => {
    const response = await axios.put(`${API_URL}/${user.id}`, user);
    return response.data;
  },

  patchUser: async (id: number, partialUser: Partial<User>): Promise<User> => {
    const response = await axios.patch(`${API_URL}/${id}`, partialUser);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};

