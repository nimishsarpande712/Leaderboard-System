// Simple API helper for fetch-based requests.
// Reads base URL from Vite env: VITE_API_BASE_URL (e.g. https://your-backend.onrender.com)
// Paths passed to get/post should start with a leading slash, e.g. '/api/users'.

const API = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '');
export const SOCKET_ORIGIN = API; // Used for socket.io client

async function handle(res) {
  const ct = res.headers.get('content-type') || '';
  const isJSON = ct.includes('application/json');
  const data = isJSON ? await res.json().catch(()=> ({})) : await res.text();
  if(!res.ok) {
    const msg = (data && data.error) || data.message || res.statusText || 'Request failed';
    throw new Error(msg);
  }
  return data;
}

export const get = (path) => fetch(`${API}${path}`, { credentials:'omit' }).then(handle);
export const post = (path, body) => fetch(`${API}${path}`, {
  method:'POST',
  headers:{ 'Content-Type':'application/json' },
  body: body ? JSON.stringify(body) : undefined,
}).then(handle);

export const api = { get, post, base: API };
