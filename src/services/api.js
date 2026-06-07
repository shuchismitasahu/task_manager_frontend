// Base API URL — proxied to http://localhost:8080 via vite.config.js
const BASE_URL = '/api'

// Get JWT token from localStorage
const getToken = () => localStorage.getItem('token')

// Build headers with optional Authorization
const buildHeaders = (auth = true) => {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

// Generic fetch wrapper
const request = async (method, url, body = null, auth = true) => {
  const options = {
    method,
    headers: buildHeaders(auth),
  }
  if (body) options.body = JSON.stringify(body)

  const response = await fetch(`${BASE_URL}${url}`, options)

  // If 401 — clear token and redirect to login
  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.reload()
    return
  }

  const data = await response.json()

  // Throw error for non-2xx responses
  if (!response.ok) {
    throw { response: { data, status: response.status } }
  }

  return data
}

// =============================================
// Auth API
// =============================================
export const authApi = {
  register: (data) => request('POST', '/auth/register', data, false),
  login: (data) => request('POST', '/auth/login', data, false),
}

// =============================================
// Task API
// =============================================
export const taskApi = {
  getAll: () => request('GET', '/tasks'),
  getById: (id) => request('GET', `/tasks/${id}`),
  create: (data) => request('POST', '/tasks', data),
  update: (id, data) => request('PUT', `/tasks/${id}`, data),
  delete: (id) => request('DELETE', `/tasks/${id}`),
  updateStatus: (id, status) => request('PATCH', `/tasks/${id}/status`, { status }),
}

// =============================================
// AI API
// =============================================
export const aiApi = {
  generate: (title) => request('POST', '/ai/generate', { title }),
}
