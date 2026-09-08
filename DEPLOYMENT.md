# Deployment

The browser communicates only with the Express API. The Express API communicates with PostgreSQL through Prisma. Do not add Supabase keys, database passwords, or connection URLs to Vercel or frontend source code.

## Supabase

1. Rotate any database password that has been shared outside your password manager.
2. In Supabase, open **Connect** and copy the **Session Pooler** PostgreSQL URL on port `5432`.
3. Set both `DATABASE_URL` and `DIRECT_URL` in Render to that URL. This app uses a persistent Express server, so it uses the Session Pooler rather than the transaction pooler.
4. The backend deployment applies committed migrations with `prisma migrate deploy`. Do not run `prisma db push` against the hosted database.

## Render

Create a Web Service from this repository using [render.yaml](render.yaml), or enter the equivalent values manually:

| Setting | Value |
| --- | --- |
| Root directory | `backend` |
| Build command | `npm ci && npx prisma generate && npx prisma migrate deploy` |
| Start command | `npm start` |
| Health check | `/api/keep-alive` |
| Region | Singapore |
| Plan | Free |

Create these secret environment variables in Render:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Supabase Session Pooler URL |
| `DIRECT_URL` | Same Supabase Session Pooler URL |
| `FRONTEND_ORIGIN` | `https://alzheimer-s-disease.vercel.app` |

The free Render service sleeps after inactivity. The first request after sleep can take about a minute.

## Vercel

In the existing Vercel project, add this Production environment variable and redeploy:

```text
VITE_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com/api
```

The frontend also accepts the URL without `/api`; it adds that path automatically. Vite embeds this value during the build, so a redeploy is required after changing it.

## Post-deployment check

1. Open `https://YOUR-RENDER-SERVICE.onrender.com/api/keep-alive`; it should return `status: ok` and `database: ok`.
2. Open the Vercel site and register a temporary test HN.
3. Complete screening and confirm the dashboard loads.
4. Delete only temporary test records in Supabase before starting real allocations, so sequence 1 remains available.
