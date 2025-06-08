import axios from 'axios';

const baseURL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to handle authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Global Memory API endpoints
export interface GlobalMemory {
  id: string;
  key: string;
  value: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const globalMemoryApi = {
  getAll: async (): Promise<GlobalMemory[]> => {
    const response = await api.get('/global-memory');
    return response.data;
  },
  getById: async (id: string): Promise<GlobalMemory> => {
    const response = await api.get(`/global-memory/${id}`);
    return response.data;
  },
  create: async (data: Omit<GlobalMemory, 'id'>): Promise<GlobalMemory> => {
    const response = await api.post('/global-memory', data);
    return response.data;
  },
  update: async (id: string, data: Partial<GlobalMemory>): Promise<GlobalMemory> => {
    const response = await api.put(`/global-memory/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/global-memory/${id}`);
  },
};
