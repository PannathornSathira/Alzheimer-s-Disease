# Alzheimer EEG-Group Randomization System

Local clinical-trial screening and randomization workflow. Doctors select `SEA` or `No SEA`; the backend assigns the next blinded code from that group’s approved A/B sequence.

## Run locally

```bash
npm install
cd backend && npm install && cp .env.example .env && cd ..
npm run db:up
npm run db:migrate
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:10000` and PostgreSQL runs in Docker on port `5432`.

## Allocation lists

- `backend/randomList/sea.csv` and `backend/randomList/no-sea.csv` are the runtime lists. They contain codes A/B only.
- The source and converted Excel files in `Random/` stay local and are ignored by Git.
- Each group has 34 allocations, with 17 A and 17 B. The application never reuses a list after it is exhausted.

Run `npm test` to verify the runtime lists.

## Cloud deployment

The Vite frontend stays on Vercel and the Express API is deployed separately to Render. See [DEPLOYMENT.md](DEPLOYMENT.md) for the required environment variables and deployment settings. Do not add Supabase credentials to the frontend.
