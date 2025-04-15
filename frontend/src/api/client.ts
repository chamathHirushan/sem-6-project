import { auth } from "../../firebase.config";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async get(endpoint: string, params?: Record<string, string>) {
    return this.request('GET', endpoint, undefined, params);
  }

  async post(endpoint: string, body: any, params?: Record<string, string>) {
    return this.request('POST', endpoint, body, params);
  }

  async put(endpoint: string, body: any, params?: Record<string, string>) {
    return this.request('PUT', endpoint, body, params);
  }

  async delete(endpoint: string, params?: Record<string, string>) {
    return this.request('DELETE', endpoint, undefined, params);
  }

  private async request(method: string, endpoint: string, body?: any, params?: Record<string, string>) {
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const queryParams = new URLSearchParams(params).toString();
      url = `${url}?${queryParams}`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = await auth.currentUser?.getIdToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'An error occurred');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error in ${method} ${endpoint}:`, error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();