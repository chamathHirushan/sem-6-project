import { toast } from "react-toastify";
import { auth } from "../../firebase.config";
import { getAccessToken, setAccessToken } from "../utils/tokenStore";
import { isPublicRoute } from "../utils/publicRoutes";

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

  private async request<T>(method: string, endpoint: string, body?: any, params?: Record<string, string>, retry: boolean = true): Promise<T> {
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const queryParams = new URLSearchParams(params).toString();
      url = `${url}?${queryParams}`;
    }

    const headers: Record<string, string> = {};
    const token = getAccessToken();
    if (token && !isPublicRoute()) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers
    };

    if (body) {
      headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 && retry) {
          const refreshed = await this.tryRefreshToken();
          if (refreshed) {
            return this.request(method, endpoint, body, params, false);
          } else {
            await auth.signOut();
            this.redirectToLogin();
          }
        }
        throw new Error(errorData.detail || 'An error occurred');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error in ${method} ${endpoint}:`, error);
      throw error;
    }
  }

  private async tryRefreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      setAccessToken(data.token);
      return response.ok;
    } catch (err) {
      console.error('Refresh token request failed:', err);
      return false;
    }
  }

  private redirectToLogin() {
      window.history.pushState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
      toast.warn("Please login again!", { toastId: "login-warning" });
    }
  }

export const apiClient = new ApiClient();