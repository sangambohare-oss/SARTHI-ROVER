import type {
  DetectionResult, Report, RoverState, Mission, WeatherData, User, CropHealth, HistoryEntry, Farm
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('agrivision_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = { ...getAuthHeaders(), ...(options.headers || {}) };
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || `API ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function loginApi(email: string, password: string): Promise<{ user: User; token: string }> {
  return request<{ user: User; token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function registerApi(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
  return request<{ user: User; token: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
}

export async function predictDisease(imageFile: File): Promise<DetectionResult> {
  const formData = new FormData();
  formData.append('file', imageFile);
  const token = localStorage.getItem('agrivision_token');
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers,
    body: formData
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Prediction failed' }));
    throw new Error(errorData.error || 'Prediction failed');
  }
  return res.json();
}

export async function getReports(): Promise<Report[]> {
  return request<Report[]>('/reports');
}

export async function getRoverStatus(): Promise<RoverState> {
  return request<RoverState>('/rover/status');
}

export async function controlRover(action: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>('/rover/control', {
    method: 'POST',
    body: JSON.stringify({ action })
  });
}

export async function startMission(farmId: string, farmName?: string): Promise<{ mission: Mission }> {
  return request<{ mission: Mission }>('/mission/start', {
    method: 'POST',
    body: JSON.stringify({ farmId, farmName })
  });
}

export async function stopMission(missionId?: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>('/mission/stop', {
    method: 'POST',
    body: JSON.stringify({ missionId })
  });
}

export async function getWeather(): Promise<WeatherData> {
  return request<WeatherData>('/weather');
}

export async function getProfile(): Promise<User> {
  return request<User>('/profile');
}

export async function updateProfile(updates: Partial<User>): Promise<User> {
  return request<User>('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

export async function getCropHealth(): Promise<CropHealth> {
  return request<CropHealth>('/crop-health');
}

export async function getHistory(): Promise<HistoryEntry[]> {
  return request<HistoryEntry[]>('/history');
}

export async function getFarms(): Promise<Farm[]> {
  return request<Farm[]>('/api/farms');
}

export async function createFarm(farm: Partial<Farm>): Promise<Farm> {
  return request<Farm>('/api/farms', {
    method: 'POST',
    body: JSON.stringify(farm)
  });
}

export async function deleteFarm(farmId: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/api/farms/${farmId}`, {
    method: 'DELETE'
  });
}
