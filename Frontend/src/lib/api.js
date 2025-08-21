// Simple API helper for fetch-based requests.
// Reads base URL from Vite env: VITE_API_BASE_URL (e.g. https://your-backend.onrender.com)
// Paths passed to get/post should start with a leading slash, e.g. '/api/users'.

// Normalize base: remove trailing slash, and if user mistakenly includes '/api' strip it (frontend code appends '/api/...').
let rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
// Support overriding via ?apiBase= query param for quick local testing without rebuild
try {
  const urlParamBase = new URLSearchParams(window.location.search).get('apiBase');
  if(urlParamBase) rawBase = urlParamBase;
} catch(_) {}
rawBase = rawBase.replace(/\/$/, '');
const API = rawBase.endsWith('/api') ? rawBase.slice(0, -4) : rawBase;
export const SOCKET_ORIGIN = API; // Used for socket.io client (must match server CORS origin exactly)

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
