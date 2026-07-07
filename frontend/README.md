# Alzheimer's Disease Trial Frontend Mockup

This is the React + Vite frontend web application for the clinical trial enrollment and randomization system adapted for the **Efficacy of Low-Dose Levetiracetam on Cognitive Function in Patients with Early-Onset Alzheimer's Disease** study.

It is currently configured as a visual workflow mockup for customer review and feedback.

---

## Key Features

1. **Patient Registration**: Capture hospital name, HN, and register a new session.
2. **Inclusion & Exclusion Criteria**: Clinical screening checklist inputs.
3. **Pending EEG Monitoring (Paused Stage)**: Allows pausing the flow while awaiting EEG screening results, with HN lookup retrieval.
4. **EEG Finding (Stratification)**: Simplified parameter input screen showing only **SEA** or **No SEA** options.
5. **Randomization Result (Blinded)**: Displays the outcome with blinded arm codes (**A** or **B**) and hides the risk score to keep clinical investigators blinded.
6. **Admin Dashboard**: Displays blinded statistics (Arm A/Arm B), trend charts, and anonymized CSV data exports.

---

## Local Development

To run the frontend client locally:

```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Build production assets
npm run build
```

---

## Mockup Notes

- **Input-to-Score Mapping**: Selecting **SEA** assigns `6` points (stratified into stratum `SEA Stratum`), and selecting **No SEA** assigns `4` points (stratified into stratum `No SEA Stratum`).
- **Blinded Outcomes**: The actual randomization results (`Drug Arm (Levetiracetam)` or `Placebo Arm`) returned by the database/mock API are mapped to display proxy letters:
  - `Drug Arm (Levetiracetam)` &rarr; **A** (or **Arm A** in charts)
  - `Placebo Arm` &rarr; **B** (or **Arm B** in charts)
- **Backend Schema status**: The backend still tracks individual score columns and returns original string names. This frontend performs runtime client-side mapping for presentation purposes. Complete backend updates will be completed after alignment on this frontend workflow mockup.
