# Alzheimer Trial Frontend

The Vite frontend calls the local Express API. Set `VITE_API_BASE_URL` in `.env` when the backend is not running on `http://localhost:10000/api`.

Doctors complete screening, select `SEA` or `No SEA`, and receive the backend-provided randomization code A or B. The frontend does not contain treatment labels or allocation sequences.
