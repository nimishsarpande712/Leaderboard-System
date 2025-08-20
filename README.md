<div align="center">

# ⚡ Leaderboard System
Live Deployed Link :- https://leaderboard-system-1-1j3g.onrender.com/?tab=live
Modern real‑time leaderboard application.

Node.js (Express + Socket.IO) • MongoDB (Atlas) • React + Vite • Pure CSS (glass / neon / responsive)  
Supports live point claiming, animated podium, ranking list, claim history & pagination.

</div>

## ✨ Features
- Add users & claim random points (1‑10) – instantly reflected through Socket.IO
- Animated podium (Top 3) + scrollable ranking list + responsive (mobile → desktop)
- Real‑time settlement timer pill (demo countdown)
- Claim history with pagination & slide/fade-in animation
- Glassmorphic dark UI (no UI framework, pure CSS)

## 🗂 Project Structure
```
Backend/   Express API + Socket.IO + Mongoose models
Frontend/  React (Vite) client
mongo-backup/  BSON backup (optional import)
```

## ⚙️ Backend (Express API)

Create `Backend/.env` (Render will let you add these as environment variables):
```
PORT=4000
MONGO_URI=<your MongoDB Atlas connection string>
```
`MONGO_URI` can be the SRV string from Atlas (do not append a port to mongodb+srv URIs).

Install & run locally:
```
cd Backend
npm install
npm run dev
```

Seed initial demo users (optional, one time):
```
POST http://localhost:4000/api/users/seed
```

### API Endpoints (brief)
| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | /api/users | List users with totals |
| POST | /api/users | Create user { name } |
| POST | /api/users/seed | Seed 10 demo users |
| POST | /api/users/:id/claim | Claim random points (1‑10) |
| GET | /api/users/leaderboard/list | Ranked list (with rank) |
| GET | /api/users/history?page=&limit= | Paginated claim history |

Socket.IO event: `leaderboard` emits full ordered array after each claim.

## 💻 Frontend (React + Vite)
```
cd Frontend
npm install
npm run dev
```
Visit: http://localhost:5173

Environment override (`Frontend/.env`):
```
VITE_API_BASE=http://localhost:4000/api
```

Build production bundle:
```
cd Frontend
npm run build
```
Output goes to `dist/`.

## 🚀 Deploying on Render

You can deploy backend & frontend as two Render services (recommended) or serve the built frontend from a static site service.

### 1. Deploy MongoDB (Already on Atlas)
Nothing extra required other than ensuring the Render IP ranges are allowed in your Atlas Network Access list (0.0.0.0/0 for quick testing or specific egress ranges).

### 2. Deploy Backend (Web Service)
1. Push repo to GitHub (public or private).  
2. In Render: New → Web Service → select repo.  
3. Root directory: `Backend`  
4. Build Command: `npm install`  
5. Start Command: `npm start`  
6. Runtime: Node 18+  
7. Add Environment Variables:  
	- `PORT` = `4000` (Render sets `PORT` automatically; you can omit, but keeping is fine)  
	- `MONGO_URI` = your Atlas string  
8. Deploy. After build, note the service URL, e.g. `https://leaderboard-api.onrender.com`.

Health check: open base URL (`/`) should show `Leaderboard API running`.

### 3. Deploy Frontend (Static Site)
1. New → Static Site → same repo.  
2. Root directory: `Frontend`  
3. Build Command: `npm install && npm run build`  
4. Publish Directory: `dist`  
5. Add Environment Variable:  
	- `VITE_API_BASE` = `https://leaderboard-api.onrender.com/api` (replace with your backend URL)  
6. Deploy.  

Render handles CDN + compression automatically.

### Single Service Alternative (Not Recommended for Scale)
If you prefer one service, you could serve the built frontend via Express `app.use(express.static(...))` but this repo keeps concerns separate for clarity. For that you'd copy the `dist` folder into the backend or add a postbuild step; not implemented by default.

## 🔒 Security & Production Notes
- CORS currently allows `*`. In production, restrict to your frontend domain.
- Rate limiting & auth are not implemented (demo). Add authentication before exposing publicly.
- Validation is minimal; add stronger schema validation (e.g., celebrate / zod) for production.
- WebSockets broadcast the entire leaderboard; for very large datasets consider diff or pagination.

## 🧪 Local Dev Quick Start
```
git clone <repo>
cd Leaderboard-System

# Backend
cd Backend
cp .env.example .env  # (create one based on README values if example not present)
npm install
npm run dev

# Frontend (new terminal)
cd ../Frontend
npm install
echo VITE_API_BASE=http://localhost:4000/api > .env
npm run dev
```

## 📡 Real-Time Flow
1. Client calls `POST /api/users/:id/claim`.
2. Server updates user, emits `leaderboard` event via Socket.IO.
3. Client updates local state instantly; claim history is fetched via REST pagination.

## 🛠 Tech Stack
| Layer | Tech |
| ----- | ---- |
| Backend | Node.js, Express, Mongoose, Socket.IO |
| Frontend | React 18 + Vite, Pure CSS (no frameworks) |
| Database | MongoDB Atlas |

## 🧩 Future Improvements (Ideas)
- User avatars upload
- Authentication / JWT
- Server-side filtering & search
- Rate limiting & anti-spam on claim route
- Leaderboard time windows / seasonal resets
- Unit & integration tests

## 📄 License
MIT

---
Enjoy building with it! Feel free to open issues or enhancements.
