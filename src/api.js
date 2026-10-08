import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const api = axios.create({
  baseURL: rawBaseUrl.replace(/\/api\/?$/, ''),
});

export default api;
