# Leaderboard System

Full-stack demo with Node.js/Express + MongoDB + React (Vite). Features:

- Add users
- Claim random points (1-10)
- Real-time leaderboard via Socket.IO
- Paginated claim history

## Backend

Env vars (create `Backend/.env`):
```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/leaderboard
```

Install & run:
```
cd Backend
npm install
npm run dev
```
Seed initial 10 users (one time):
```
POST http://localhost:4000/api/users/seed
```

## Frontend
```
cd Frontend
npm install
npm run dev
```
Visit http://localhost:5173

Set custom API base by creating `Frontend/.env`:
```
VITE_API_BASE=http://localhost:4000/api
```

## Notes
- Leaderboard updates broadcast after each claim.
- History pagination uses simple skip/limit.
- UI kept intentionally minimal; extend with avatars, tabs, theming as desired.
