const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async get(endpoint: string) {
    return this.request('GET', endpoint);
  }

  async post(endpoint: string, body: any) {
    return this.request('POST', endpoint, body);
  }

  private async request(method: string, endpoint: string, body?: any) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      method,
      headers,
      credentials: 'include', // For cookies if using session-based auth
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error in ${method} ${endpoint}:`, error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();