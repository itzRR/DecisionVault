import { auth } from '../lib/firebase';
import type { CreateDecisionInput, MakeDecisionInput, RecordOutcomeInput, UserPreferences, ApiResponse, Decision, DashboardStats, PersonalInsight } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

async function getAuthHeader(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) return {};
  try {
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch (err) {
    console.error('Error getting auth token', err);
    return {};
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = await getAuthHeader();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorData = await response.json();
      if (errorData.error) errorMessage = errorData.error;
      else if (errorData.message) errorMessage = errorData.message;
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

// Auth API
export const authApi = {
  createSession: () => request<ApiResponse<any>>('/api/auth/session', { method: 'POST' }),
  getMe: () => request<ApiResponse<any>>('/api/auth/me'),
  updatePreferences: (prefs: Partial<UserPreferences>) => request<ApiResponse<any>>('/api/auth/preferences', { method: 'PUT', body: JSON.stringify(prefs) }),
  deleteAccount: () => request<ApiResponse<void>>('/api/auth/account', { method: 'DELETE' }),
};

// Decisions API
export const decisionsApi = {
  create: (input: CreateDecisionInput) => request<ApiResponse<Decision>>('/api/decisions', { method: 'POST', body: JSON.stringify(input) }),

  getAll: (filters?: { category?: string; status?: string; search?: string; sort?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort) params.append('sort', filters.sort);
    const query = params.toString();
    return request<ApiResponse<Decision[]>>(`/api/decisions${query ? `?${query}` : ''}`);
  },

  get: (id: string) => request<ApiResponse<Decision>>(`/api/decisions/${id}`),
  update: (id: string, data: Partial<Decision>) => request<ApiResponse<Decision>>(`/api/decisions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => request<ApiResponse<void>>(`/api/decisions/${id}`, { method: 'DELETE' }),
  getStats: () => request<ApiResponse<DashboardStats>>('/api/decisions/stats'),
  analyze: (id: string) => request<ApiResponse<Decision>>(`/api/decisions/${id}/analyze`, { method: 'POST' }),
  makeDecision: (id: string, input: MakeDecisionInput) => request<ApiResponse<Decision>>(`/api/decisions/${id}/decide`, { method: 'POST', body: JSON.stringify(input) }),
  recordOutcome: (id: string, input: RecordOutcomeInput) => request<ApiResponse<Decision>>(`/api/decisions/${id}/outcome`, { method: 'POST', body: JSON.stringify(input) }),
  generateReplay: (id: string) => request<ApiResponse<Decision>>(`/api/decisions/${id}/replay`, { method: 'POST' }),
};

// Insights API
export const insightsApi = {
  getInsights: () => request<ApiResponse<{ insights: PersonalInsight[]; message?: string }>>('/api/insights'),
};

// Export API
export const exportApi = {
  exportJSON: async () => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/api/export/json`, { headers });
    if (!response.ok) throw new Error('Export failed');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'decisionvault_export.json';
    a.click();
    window.URL.revokeObjectURL(url);
  },
  exportCSV: async () => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_URL}/api/export/csv`, { headers });
    if (!response.ok) throw new Error('Export failed');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'decisionvault_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  },
};
