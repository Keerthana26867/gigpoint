import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, updateData) => {
  const response = await api.patch(`/products/${id}`, updateData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const mutateInventory = async (mutationPayload) => {
  const response = await api.post('/inventory/mutate', mutationPayload);
  return response.data;
};

export const queryInventory = async (queryPayload) => {
  const response = await api.post('/inventory/query', queryPayload);
  return response.data;
};

export const getLowStockProducts = async () => {
  const response = await api.get('/inventory/low-stock');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/inventory/stats');
  return response.data;
};

export const reseedDatabase = async () => {
  const response = await api.post('/inventory/seed');
  return response.data;
};

export const parseVoiceTranscript = async (transcript, language = 'en-IN') => {
  const response = await api.post('/voice/parse', { transcript, language });
  return response.data;
};

export const processVoiceCommand = async (transcript, language = 'en-IN') => {
  const response = await api.post('/voice/command', { transcript, language });
  return response.data;
};

export const getTransactions = async (limit = 20) => {
  const response = await api.get('/transactions', { params: { limit } });
  return response.data;
};

export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default api;
