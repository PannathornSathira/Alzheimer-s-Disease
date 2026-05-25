# Epilepsy-After-Ischemic-Stroke API Documentation

This document provides a detailed overview of the backend API endpoints for the Epilepsy-After-Ischemic-Stroke clinical trial system.

**Base URL:** `http://localhost:5000/api` (Local Development)

---

## 1. Session Management (`/api/sessions`)

These endpoints handle the patient screening flow from registration to randomization.

### 1.1 Start Session
Initialize or retrieve a screening session for a patient.

- **URL:** `/start`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "hospitalPrefix": "KCMH",
    "hospitalName": "King Chulalongkorn Memorial Hospital",
    "uniqueId": "HN12345",
    "userId": 1
  }
  ```
- **Description:** 
  - Checks if a session already exists for the given Patient HN at the specified hospital.
  - If it exists, returns the existing session.
  - If not, generates a unique **Trial System ID** (e.g., `KCMH-123-456`) with a retry mechanism to prevent collisions and creates a new session.
- **Response (Success - 201):**
  ```json
  {
    "message": "Session started successfully",
    "session": { "id": "uuid", "trialSystemId": "KCMH-123-456", "currentStatus": "REGISTERED", ... }
  }
  ```

### 1.2 Submit Inclusion Criteria
Save the result of the inclusion screening.

- **URL:** `/:id/inclusion`
- **Method:** `POST`
- **Params:** `id` (Session UUID)
- **Body:**
  ```json
  {
    "passed": true,
    "failedReason": null
  }
  ```
- **Description:**
  - Updates the `inclusionPassed` status and sets the `inclusionPageTimestamp`.
  - Sets `currentStatus` to `INCLUSION_PASSED` or `DISQUALIFIED`.

### 1.3 Submit Exclusion Criteria
Save the result of the exclusion screening.

- **URL:** `/:id/exclusion`
- **Method:** `POST`
- **Params:** `id` (Session UUID)
- **Body:**
  ```json
  {
    "conditions": {
      "hasUnstableDisease": false,
      "hasTumor": false,
      "isPregnant": false,
      ...
    }
  }
  ```
- **Description:**
  - The backend checks if **any** condition is `true`.
  - If any are `true`, the patient is `DISQUALIFIED`.
  - Otherwise, status moves to `EXCLUSION_PASSED`.

### 1.4 Submit SeLECT Score & Randomize
Finalize the screening and perform randomization.

- **URL:** `/:id/select-score`
- **Method:** `POST`
- **Params:** `id` (Session UUID)
- **Body:**
  ```json
  {
    "severityScore": 2,
    "largeArteryScore": 1,
    "earlySeizureScore": 0,
    "corticalInvolvementScore": 1,
    "territoryMcaScore": 1,
    "assignedArm": "Intervention Arm (Drug X)"
  }
  ```
- **Description:**
  - Automatically calculates the `totalSelectScore` (sum of component scores).
  - Determines the **Strata** (Low, Moderate, High Risk) based on the score.
  - If score is ≥ 4, patient is marked as `RANDOMIZED` and the `randomizationTimestamp` is recorded.
  - If score < 4, patient is `DISQUALIFIED`.

---

## 2. Admin & Dashboard (`/api/admin`)

Endpoints for monitoring the trial progress.

### 2.1 Get Dashboard Statistics
Retrieve real-time stats and the full audit trail.

- **URL:** `/dashboard`
- **Method:** `GET`
- **Description:**
  - Aggregates all session data to compute KPIs (Total Randomized, Arm Distribution, etc.).
  - Returns a formatted list for the Audit Trail table, including human-readable timestamps.
- **Response (Success - 200):**
  ```json
  {
    "stats": {
      "totalRand": 13,
      "intArm": 13,
      "placArm": 0,
      "failInc": 2,
      "failExc": 1,
      "hospStats": { "KCMH": { "rand": 5, "fail": 1 }, ... },
      "scoreFreq": { "4": 2, "5": 3, ... },
      "compStats": { "severity": 10, "athero": 5, ... }
    },
    "data": [
      {
        "id": "KCMH-123-456",
        "hn": "12345",
        "hospital": "KCMH",
        "status": "Randomized",
        "timestamps": { "start": "Mar 27, 01:56 PM", "inc": "01:57 PM", ... },
        "score": 6,
        "arm": "Intervention Arm"
      }
    ]
  }
  ```

---

## 3. Data Models (Key Entities)

### TrialSession
- `trialSystemId`: Anonymized public ID.
- `currentStatus`: `REGISTERED`, `INCLUSION_PASSED`, `EXCLUSION_PASSED`, `RANDOMIZED`, `DISQUALIFIED`.
- `registrationTimestamp`: Auto-generated when session starts.
- `randomizationTimestamp`: Only set when status reaches `RANDOMIZED`.
