# Moodify

Moodify is a full-stack mood wellness app with:

- auth and protected routes
- mood logging and analytics
- face-based mood detection
- mood-based song and movie suggestions
- journal entries
- sleep tracking
- realtime chat and direct messages

## Project structure

- `Frontend/`: React + Vite client
- `Backend/`: Express + MongoDB + Socket.IO API

## Local setup

### 1. Backend

```bash
cd Backend
npm install
cp .env.example .env
npm run dev
```

Required backend env vars:

- `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URLS`

Optional:

- `REDIS_URL` or `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD`

If Redis is not configured, Moodify falls back to an in-memory cache for token blacklisting.

### 2. Frontend

```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

Frontend env vars:

- `VITE_API_URL`
- `VITE_SOCKET_URL`

## Production deployment

### Backend

Deploy the `Backend/` folder to a Node host such as Render, Railway, or Fly.io.

Use:

- build command: `npm install`
- start command: `npm start`

Set:

- `NODE_ENV=production`
- `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URLS=https://your-frontend-domain.com`
- `REDIS_URL` if you have managed Redis

In production, auth cookies automatically switch to `Secure` and `SameSite=None` so frontend and backend can live on different domains over HTTPS.

### Frontend

Deploy the `Frontend/` folder to Vercel, Netlify, or another static host.

Set:

- `VITE_API_URL=https://your-backend-domain.com`
- `VITE_SOCKET_URL=https://your-backend-domain.com`

Run:

```bash
npm run build
```

## Health check

Backend health endpoint:

```text
/api/health
```

## Notes

- The face-expression route is lazy-loaded to keep the initial bundle smaller.
- Chat uses Socket.IO and the same auth cookie as the REST API.
- Mood suggestions page can open YouTube searches directly based on the detected mood.
