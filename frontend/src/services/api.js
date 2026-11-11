import axios from 'axios';

const BASE_URL = '/api/tasks';

const api = {
  getTasks: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(`${BASE_URL}?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await axios.post(BASE_URL, taskData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  },

  getTaskById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch task');
    }
  },

  updateTask: async (id, updates) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  },

  updateTaskStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${BASE_URL}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update task status');
    }
  },

  deleteTask: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  },

  getWeeklySummary: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.status) params.append('status', filters.status);

      const response = await axios.get(`${BASE_URL}/weekly-summary?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch weekly summary');
    }
  }
};

export default api;
