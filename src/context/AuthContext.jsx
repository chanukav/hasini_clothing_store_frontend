import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hasini_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchMe = async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.status === 'success') {
        setUser(data.data.user);
      }
    } catch (error) {
      console.error('Auth fetch error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.status === 'success') {
      localStorage.setItem('hasini_token', data.token);
      setToken(data.token);
      setUser(data.data.user);
      return data.data.user;
    }
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    if (data.status === 'success') {
      localStorage.setItem('hasini_token', data.token);
      setToken(data.token);
      setUser(data.data.user);
      return data.data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('hasini_token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
