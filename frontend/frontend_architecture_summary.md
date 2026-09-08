# Frontend architecture

The application is a React/Vite client for the Alzheimer EEG-group randomization workflow.

## Patient flow

1. Register a hospital and HN.
2. Complete inclusion and exclusion screening.
3. Pause and resume a session when required.
4. Select the doctor's EEG assessment: `SEA` or `NO_SEA`.
5. Display the A/B allocation code returned by the backend.

The browser keeps only the current workflow state. All patient, screening, allocation, dashboard, and export data comes from the Express API.

## API configuration

`VITE_API_BASE_URL` is the only deployment setting used by the frontend. It defaults to `http://localhost:10000/api` for local development and accepts either an API host URL or an API host URL ending in `/api` for Render.

The frontend does not connect to Supabase directly and contains no database credentials or treatment-decoding lists.

## Administration

The dashboard displays the API's session data, including EEG group, blinded A/B allocation code, status, and export data. It does not calculate scores, risk strata, or treatment names in the browser.
