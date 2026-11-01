import axiosInstance from './axiosInstance';

export const authApi = {
  register: (payload) => axiosInstance.post('/auth/register', payload),
  login:    (payload) => axiosInstance.post('/auth/login', payload),
  me:       ()        => axiosInstance.get('/auth/me'),
};
