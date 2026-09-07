const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'Request failed');
  return body;
}

export const startSession = (payload) => request('/sessions/start', { method: 'POST', body: JSON.stringify(payload) });
export const submitInclusion = (id, payload) => request(`/sessions/${id}/inclusion`, { method: 'POST', body: JSON.stringify(payload) });
export const submitExclusion = (id, payload) => request(`/sessions/${id}/exclusion`, { method: 'POST', body: JSON.stringify(payload) });
export const pauseSession = (id) => request(`/sessions/${id}/pause`, { method: 'POST', body: '{}' });
export const resumeSession = (id) => request(`/sessions/${id}/resume`, { method: 'POST', body: '{}' });
export const randomizeSession = (id, eegGroup) => request(`/sessions/${id}/randomize`, { method: 'POST', body: JSON.stringify({ eegGroup }) });
export const fetchDashboardStats = () => request('/admin/dashboard');
