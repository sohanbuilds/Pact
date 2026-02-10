import type {
  User,
  Task,
  Friendship,
  Group,
  GroupMember,
  CreateTaskDto,
  CreatePrivateTaskDto,
  UpdateTaskDto,
  Role,
} from '@/types';

// Use Next.js API proxy to avoid CORS issues
// The proxy routes are at /api/proxy/[...path]
const API_BASE = '/api/proxy';

async function fetchAPI(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${API_BASE}/${cleanEndpoint}`;
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error.message || error.error || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response;
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetchAPI(endpoint, { method: 'GET' });
  return response.json();
}

export async function apiPost<T>(endpoint: string, data?: unknown): Promise<T> {
  const response = await fetchAPI(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
  return response.json();
}

export async function apiPatch<T>(endpoint: string, data?: unknown): Promise<T> {
  const response = await fetchAPI(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
  return response.json();
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await fetchAPI(endpoint, { method: 'DELETE' });
  return response.json();
}

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    apiPost<{ success: boolean }>('/auth/login', data),
  
  register: (data: { email: string; username: string; password: string }) =>
    apiPost<{ success: boolean }>('/auth/register', data),
  
  logout: () => apiPost<{ success: boolean }>('/auth/logout'),
  
  getGoogleAuthUrl: () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    return `${API_URL}/auth/google`;
  },
  
  getMe: () => apiGet<User>('/me'),
};

// Tasks API
export const tasksAPI = {
  getPersonal: () => apiGet<Task[]>('/tasks/personal'),
  
  createPersonal: (data: CreateTaskDto) =>
    apiPost<Task>('/tasks/personal', data),
  
  // Backend expects CreateTaskDto (all fields required except description/deadline)
  updateTask: (id: string, data: CreateTaskDto) =>
    apiPatch<Task>(`/tasks/${id}`, data),
  
  deleteTask: (id: string) => apiDelete<{ success: boolean }>(`/tasks/${id}`),
  
  getPrivate: () => apiGet<Task[]>('/tasks/private'),
  
  createPrivate: (data: CreatePrivateTaskDto) =>
    apiPost<Task>('/tasks/private', data),
  
  // Backend expects UpdateTaskDto (all fields optional)
  updatePrivate: (id: string, data: UpdateTaskDto) =>
    apiPatch<Task>(`/tasks/private/${id}`, data),
  
  deletePrivate: (id: string) =>
    apiDelete<{ success: boolean }>(`/tasks/private/${id}`),
  
  getShared: (groupId: string) =>
    apiGet<Task[]>(`/tasks/group/${groupId}/tasks`),
  
  createShared: (groupId: string, data: CreateTaskDto) =>
    apiPost<Task>(`/tasks/group/${groupId}/tasks`, data),
};

// Friends API
export const friendsAPI = {
  sendRequest: (userId: string) =>
    apiPost<Friendship>(`/friends/request/${userId}`),
  
  getRequests: () => apiGet<Friendship[]>('/friends/requests'),
  
  acceptRequest: (requestId: string) =>
    apiPost<Friendship>(`/friends/accept/${requestId}`),
  
  blockRequest: (requestId: string) =>
    apiPost<Friendship>(`/friends/block/${requestId}`),
  
  listFriends: () => apiGet<Friendship[]>('/friends/list'),
};

// Groups API
export const groupsAPI = {
  list: () => apiGet<Group[]>('/groups'),
  
  create: (name: string) => apiPost<Group>('/groups', { name }),
  
  invite: (groupId: string, userId: string, role: Role) =>
    apiPost<GroupMember>(`/groups/${groupId}/invite`, { userId, role }),
};

