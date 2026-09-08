const LOCAL_API_BASE_URL = 'http://localhost:10000/api';

function getApiBaseUrl(value = import.meta.env.VITE_API_BASE_URL) {
  const baseUrl = (value || LOCAL_API_BASE_URL).trim().replace(/\/+$/, '');
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
}

const API_BASE_URL = getApiBaseUrl();

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch {
    throw new Error('Cannot reach the trial server. If it is hosted on Render, wait a minute for it to wake up and try again.');
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await response.json() : null;
  if (!response.ok) {
    if (response.status === 503) throw new Error('The trial server is temporarily unavailable. Please try again shortly.');
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
  return body;
}

export const startSession = (payload) => request('/sessions/start', { method: 'POST', body: JSON.stringify(payload) });
export const submitInclusion = (id, payload) => request(`/sessions/${id}/inclusion`, { method: 'POST', body: JSON.stringify(payload) });
export const submitExclusion = (id, payload) => request(`/sessions/${id}/exclusion`, { method: 'POST', body: JSON.stringify(payload) });
export const pauseSession = (id) => request(`/sessions/${id}/pause`, { method: 'POST', body: '{}' });
export const resumeSession = (id) => request(`/sessions/${id}/resume`, { method: 'POST', body: '{}' });
export const randomizeSession = (id, eegGroup) => request(`/sessions/${id}/randomize`, { method: 'POST', body: JSON.stringify({ eegGroup }) });
export const fetchDashboardStats = () => request('/admin/dashboard');

export { getApiBaseUrl };
