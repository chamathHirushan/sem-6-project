import { apiClient } from '../client';

//////// to be updated //////////

export const authApi = {
  login: (email: string, password: string) => 
    apiClient.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) => 
    apiClient.post('/auth/register', { name, email, password }),
  
  getCurrentUser: () => 
    apiClient.get('/auth/me'),
};