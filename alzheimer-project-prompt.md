# 🧠 Project Prompt: Alzheimer's Clinical Trial Randomization System

> **Purpose:** Give this entire prompt to an AI coding assistant (or use as your own specification) to build a full-stack web application that is architecturally and visually identical to the existing "Epilepsy After Ischemic Stroke" clinical trial system, but adapted for a new Alzheimer's disease study with a different user workflow.

---

## 📋 PROJECT OVERVIEW

Build a **Clinical Trial Patient Randomization Web Application** for the study:

**"Efficacy of Low-Dose Levetiracetam on Cognitive Function in Patients with Early-Onset Alzheimer's Disease: A Randomized Controlled Trial"**

This is a multi-site clinical trial system where clinical staff:
1. Register patients with a hospital number (HN) and select a hospital site
2. Screen patients through Inclusion and Exclusion criteria
3. Pause the session (patient leaves, returns later)
4. Resume the session to complete a Scoring/Assessment page
5. Receive a randomized arm assignment (Drug vs. Placebo)

An admin dashboard provides monitoring, statistics, and audit trail capabilities.

---

## 🏗️ TECH STACK (Must Match Exactly)

### Frontend
- **React 19** (JSX, functional components, hooks)
- **Vite 8** (build tool + dev server)
- **Tailwind CSS 4** (via `@tailwindcss/vite` plugin)
- **React Router DOM v7** (client-side routing)
- **Radix UI** primitives (for accessible UI components)
- **Lucide React** (icons)
- **Motion** (Framer Motion v12 — animations)
- **Recharts** (charts for admin dashboard)
- **Sonner** (toast notifications)
- **React Hook Form** (form handling)
- **class-variance-authority + clsx + tailwind-merge** (component styling utilities)

### Backend
- **Node.js + Express 5** (REST API)
- **Prisma ORM** (database access)
- **PostgreSQL** (via Supabase or similar hosted DB)
- **CORS + dotenv** (middleware)
- **Nodemon** (dev server)

### Monorepo Structure
```
project-root/
├── package.json          # Root — runs frontend+backend concurrently
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── vercel.json       # SPA rewrite rules for deployment
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       ├── config/              # ⬅️ NEW: Centralized config files
│       │   ├── studyConfig.js   # Title, hospitals, arms
│       │   ├── inclusionConfig.js
│       │   ├── exclusionConfig.js
│       │   └── scoreConfig.js   # Assessment scoring parameters
│       ├── api/
│       │   └── sessionApi.js
│       ├── context/
│       │   └── PatientContext.jsx
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── ArmAllocationChart.jsx
│       │   └── ui/              # Reusable Radix-based primitives
│       │       ├── Badge.jsx
│       │       ├── Button.jsx
│       │       ├── Card.jsx
│       │       ├── Input.jsx
│       │       ├── LoadingOverlay.jsx
│       │       └── ProgressBar.jsx
│       └── pages/
│           ├── Home.jsx
│           ├── Registration.jsx
│           ├── InclusionCriteria.jsx
│           ├── ExclusionCriteria.jsx
│           ├── PausePage.jsx       # ⬅️ NEW: "หน้าพัก" session saved page
│           ├── ScoreAssessment.jsx  # ⬅️ Replaces SelectScore.jsx
│           ├── RandomizationResult.jsx
│           ├── AdminHome.jsx
│           ├── AdminMenu.jsx
│           ├── AdminDashboard.jsx
│           └── PatientLookup.jsx
└── backend/
    ├── package.json
    ├── index.js
    ├── .env
    ├── .gitignore
    ├── db/
    │   └── prismaClient.js
    ├── prisma/
    │   └── schema.prisma
    ├── randomList/               # CSV files for block randomization
    │   ├── DrugArmBased.csv
    │   └── PlaceboArmBased.csv
    ├── controllers/
    │   ├── sessionController.js
    │   └── adminController.js
    └── routes/
        ├── sessionRoutes.js
        └── adminRoutes.js
```

---

## 🎨 DESIGN SYSTEM (Replicate Exactly)

### Color Palette
```css
@theme {
  --color-primary: #E91E63;          /* Hot pink — main accent */
  --color-primary-hover: #D81B60;
  --color-primary-light: #FCE4EC;
  --color-background-main: #FFFFFF;
  --color-background-alt: #F8FAFC;   /* Light slate background */
  --color-text-main: #0F172A;        /* Near-black for headings */
  --color-text-muted: #64748B;       /* Muted gray for descriptions */
  --color-success: #10B981;
  --color-success-bg: #D1FAE5;
  --color-danger: #EF4444;
  --color-danger-bg: #FEE2E2;
  --color-warning: #F59E0B;
  --color-warning-bg: #FEF3C7;
  --color-info: #3B82F6;
  --color-info-bg: #DBEAFE;
}
```

### Typography
- **Font:** `'Inter', system-ui, -apple-system, sans-serif`
- **Headings:** 28px, `font-bold`, `text-[#0f172a]`, `tracking-tight`
- **Subtitles:** 16px, `text-[#64748B]`
- **Body text:** 15-16px, `font-semibold` or `font-medium`
- **Labels:** 15px, `font-bold`, with pink `#` or icon prefix

### Component Patterns

#### Cards
- White background, `rounded-xl`, `border border-slate-200`, `shadow-sm`
- Padding: `p-8` to `p-10`
- Hover: `hover:shadow-lg transition-all`

#### Buttons (Primary)
- `bg-[#E91E63] hover:bg-[#D81B60] text-white`
- `font-bold rounded-lg shadow-md`
- `active:scale-[0.98] transition-transform`
- Disabled state: `bg-[#fbcfe8] text-white opacity-80 cursor-not-allowed`
- Alternative disabled: `bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed opacity-70`

#### Checkbox Items (Inclusion Criteria style)
- Unchecked: `bg-white border-slate-200 hover:border-slate-300`
- Checked: `bg-[#ECFDF5] border-[#10B981] ring-1 ring-[#10B981] shadow-sm`
- Checkmark box: `w-6 h-6 rounded-[6px] border-[2px]`

#### Yes/No Toggle Buttons (Exclusion Criteria style)
- "No" selected: `bg-[#ecfdf5] border-[#10b981] text-[#047857]`
- "Yes" selected: `bg-[#fff1f2] border-[#f43f5e] text-[#be123c]`
- Unselected: `bg-white border-slate-300 text-slate-600`

#### Radio Selection Items (Hospital / Score options)
- Unselected: `border-slate-200 bg-white hover:border-slate-300`
- Selected: `border-[#E91E63] shadow-sm bg-white` with inner dot `bg-[#0f172a]`

#### Navigation Footer (every form page)
- Left: "← Back" link button — `text-[#64748B] hover:text-slate-900 font-bold`
- Right: Primary action button — pink when active, gray when disabled

#### Loading Overlay
- Full-screen overlay with backdrop blur
- Centered spinner with pulsing message text

#### Modal Popups
- Backdrop: `bg-slate-900/40 backdrop-blur-[2px]`
- Card: `bg-white rounded-2xl shadow-2xl`
- Color-coded header (amber for warnings, blue for info)
- Two buttons: Cancel (gray) + Action (colored)

#### Warning Notices
- Left-border accent: `border-l-4 border-l-[#d97706]`
- Background: `bg-[#fffbeb] border-[#fde68a]`
- Icon + bold title + description text

### Layout Shell
- Background: `bg-[#F8FAFC]`
- Max content width: `max-w-[800px]` for forms, `max-w-[1400px]` for dashboard
- Fixed header (white, blurred) showing Active Patient Record when inside the flow
- ProgressBar component: circular step indicators (now 7 steps instead of 5)

### Print/PDF Support
- Include `@media print` styles for exporting dashboard
- Hide interactive elements with `.no-print`
- Force colors with `print-color-adjust: exact`

---

## ⚙️ CONFIGURATION FILES (Easy to Edit)

> **IMPORTANT:** All study-specific content MUST be defined in config files under `src/config/`, NOT hardcoded in page components. This makes it trivial to change criteria, hospitals, scoring, etc. without touching UI logic.

### `src/config/studyConfig.js`
```javascript
export const STUDY_CONFIG = {
  title: "Efficacy of Low-Dose Levetiracetam on Cognitive Function in Patients with Early-Onset Alzheimer's Disease",
  subtitle: "A Randomized Controlled Trial",
  shortName: "Alzheimer-LEV Trial",

  // Randomization arms
  arms: {
    intervention: "Drug Arm (Levetiracetam)",
    placebo: "Placebo Arm",
  },

  // Participating hospitals — add/remove/edit freely
  hospitals: [
    { prefix: "KCMH", name: "King Chulalongkorn Memorial Hospital" },
    { prefix: "BCH",  name: "Buddhachinaraj Hospital" },
    { prefix: "SWU",  name: "Faculty of Medicine, Srinakharinwirot University" },
    { prefix: "MNR",  name: "Maharat Nakhon Ratchasima Hospital" },
    { prefix: "CPA",  name: "Chao Phraya Abhaibhubejhr Hospital" },
    { prefix: "SRN",  name: "Surin Hospital" },
    { prefix: "QSV",  name: "Somdej Na Si Racha Hospital" },
    { prefix: "CBH",  name: "Chulabhorn Hospital" },
  ],

  // Status flow labels
  statuses: {
    REGISTERED: "Registered",
    INCLUSION_PASSED: "Passed Inclusion",
    EXCLUSION_PASSED: "Passed Exclusion",
    PAUSED: "Paused (Awaiting Return)",      // ⬅️ NEW status
    SCORED: "Score Assessed",                 // ⬅️ NEW status  
    RANDOMIZED: "Randomized",
    DISQUALIFIED: "Disqualified",
  },

  // Number of progress steps in the flow
  totalSteps: 7, // Home → Reg → Incl → Excl → Pause → Score → Result
};
```

### `src/config/inclusionConfig.js`
```javascript
// ============================================================
// INCLUSION CRITERIA — Edit the items below to match your study
// All criteria must be checked (true) for patient to proceed.
// ============================================================
export const INCLUSION_CRITERIA = [
  { id: 'inc1', text: 'Age ≥ 18 years' },
  { id: 'inc2', text: 'Diagnosed with early-onset Alzheimer\'s disease' },
  { id: 'inc3', text: 'MMSE score between 20–26 (mild cognitive impairment)' },
  { id: 'inc4', text: 'Provide informed consent and are willing to participate' },
];
// To add more criteria, simply add { id: 'inc5', text: '...' }, etc.
```

### `src/config/exclusionConfig.js`
```javascript
// ============================================================
// EXCLUSION CRITERIA — Edit the items below to match your study
// If patient answers "Yes" to ANY item, they are disqualified.
// ============================================================
export const EXCLUSION_CRITERIA = [
  { id: 'exc1', label: 'Unstable medical disease including any degree AV block' },
  { id: 'exc2', label: 'Intracranial tumors' },
  { id: 'exc3', label: 'Progressive neurodegenerative disorders (other than AD)' },
  { id: 'exc4', label: 'Encephalitis or meningitis within 3 years' },
  { id: 'exc5', label: 'Antiseizure medication use within 3 months' },
  { id: 'exc6', label: 'Severe chronic liver disease (Child-Pugh class C)' },
  { id: 'exc7', label: 'Severe renal dysfunction (CrCl <30 mL/min)' },
  { id: 'exc8', label: 'Major psychiatric disorders' },
  { id: 'exc9', label: 'Severe intellectual disability' },
  { id: 'exc10', label: 'Pregnant or lactating' },
  { id: 'exc11', label: 'Known history of epilepsy' },
];
// To add more, just add { id: 'exc12', label: '...' }, etc.
```

### `src/config/scoreConfig.js`
```javascript
// ============================================================
// SCORING/ASSESSMENT PARAMETERS
// This replaces the SeLECT Score from the epilepsy project.
// Edit the scoring categories and options to match your study.
// The system auto-sums the selected points.
// ============================================================

export const SCORE_CONFIG = {
  title: "Cognitive & Risk Assessment",
  description: "Determine the patient's risk classification for trial stratification.",
  
  // Minimum score required for randomization eligibility
  minimumScoreForRandomization: 4,

  // Risk stratification thresholds
  stratification: [
    { minScore: 0,  maxScore: 3,  label: "Low Risk (Ineligible)",  eligible: false },
    { minScore: 4,  maxScore: 5,  label: "Moderate Risk",           eligible: true  },
    { minScore: 6,  maxScore: 9,  label: "High/Very High Risk",     eligible: true  },
  ],

  // Scoring parameters — each has a key, label, optional description, and point options
  parameters: [
    {
      key: 'cognitiveSeverity',
      label: 'Cognitive Severity (MMSE)',
      description: '',
      options: [
        { id: 'cog0', label: 'Mild (MMSE 24-26)', points: 0 },
        { id: 'cog1', label: 'Moderate (MMSE 20-23)', points: 1 },
        { id: 'cog2', label: 'Severe (MMSE <20)', points: 2 },
      ]
    },
    {
      key: 'vascularRisk',
      label: 'Vascular Risk Factors',
      description: 'Hypertension, diabetes, or hyperlipidemia',
      options: [
        { id: 'vas0', label: 'Absent', points: 0 },
        { id: 'vas1', label: 'Present', points: 1 },
      ]
    },
    {
      key: 'behavioralSymptoms',
      label: 'Behavioral/Psychiatric Symptoms',
      description: 'NPI score assessment',
      options: [
        { id: 'beh0', label: 'No', points: 0 },
        { id: 'beh1', label: 'Yes', points: 3 },
      ]
    },
    {
      key: 'functionalImpairment',
      label: 'Functional Impairment (ADL)',
      description: 'Activities of Daily Living dependency',
      options: [
        { id: 'fun0', label: 'Independent', points: 0 },
        { id: 'fun1', label: 'Dependent', points: 2 },
      ]
    },
    {
      key: 'familyHistory',
      label: 'Family History of Dementia',
      description: '',
      options: [
        { id: 'fam0', label: 'No', points: 0 },
        { id: 'fam1', label: 'Yes', points: 1 },
      ]
    },
  ]
};

// To modify scoring:
// 1. Edit/add/remove items in the `parameters` array
// 2. Adjust `minimumScoreForRandomization` threshold
// 3. Update `stratification` ranges accordingly
```

---

## 🔀 USER FLOW (Two-Visit Workflow)

This is the CRITICAL difference from the original project. The flow has a **pause point** after Exclusion where the user logs out and returns later.

### Route Structure
```
/                    → Home.jsx (Landing page)
/registration        → Registration.jsx (HN + Hospital selection)
/inclusion           → InclusionCriteria.jsx (Checkbox checklist)
/exclusion           → ExclusionCriteria.jsx (Yes/No questions)
/pause               → PausePage.jsx ⬅️ NEW (Session saved confirmation)
/score               → ScoreAssessment.jsx (Scoring/Assessment)
/result              → RandomizationResult.jsx (Final arm assignment)
/admin               → AdminHome.jsx (Login)
/admin-menu          → AdminMenu.jsx (Admin portal menu)
/admin-dashboard     → AdminDashboard.jsx (Statistics + Audit Trail)
```

### Visit 1 Flow (Screening)
```
Home → Registration (enter HN, select hospital, generate System ID)
     → Inclusion Criteria (check all boxes → Continue)
     → Exclusion Criteria (answer all No → Continue)
     → Pause Page ("Session saved! Come back later.")
     → User closes browser / logs out
```

### Visit 2 Flow (Assessment & Randomization)
```
Home → Registration (re-enter same HN + same hospital)
     → System detects EXISTING session with status "PAUSED" or "EXCLUSION_PASSED"
     → Show "Resume" popup modal:
         "Incomplete Registration Found. Patient [HN] has an active session.
          Would you like to resume?"
         [Cancel] [Resume]
         
         ALSO show an [Edit] button if the user wants to go back and 
         re-check inclusion/exclusion (in case they typed wrong before)
         
     → If Resume: navigate directly to → Score Assessment page
     → If Edit: navigate to → Inclusion Criteria (they re-do the flow)
     
     → Score Assessment (select all parameters → Calculate & Randomize)
     → Randomization Result (show assigned arm: Drug vs Placebo)
     → "Return to Home" (clears context)
```

### Edge Cases for Registration
When a user enters HN + Hospital that already exists in the database:

1. **Session status = RANDOMIZED or DISQUALIFIED (completed)**
   → Show **Duplicate Alert** popup (amber warning)
   → "Patient Already Registered. A new System ID cannot be generated."
   → [Cancel] [View Record] — View Record goes to Result page

2. **Session status = PAUSED / EXCLUSION_PASSED (incomplete, awaiting return)**
   → Show **Resume** popup (blue info)
   → "Incomplete Registration Found. Would you like to resume?"
   → [Cancel] [Edit Criteria] [Resume]
   → Resume → navigates to Score page
   → Edit Criteria → navigates to Inclusion page (to redo screening)

3. **Session status = REGISTERED or INCLUSION_PASSED (incomplete, still in screening)**
   → Show **Resume** popup
   → Resume to the appropriate page based on status

---

## 📄 PAGE SPECIFICATIONS

### Page 1: Home (`Home.jsx`)
- Centered layout on `bg-[#F8FAFC]`
- Large bold title: study name
- Subtitle: "A Randomized Controlled Trial"
- Single card: "Register Patient / Continue Filling Patient"
  - Pink icon circle (person+ icon)
  - Description text
  - Pink "Continue" button → navigates to `/registration`

### Page 2: Registration (`Registration.jsx`)
- Page title: "Patient Registration" with subtitle
- Card with two sections:
  1. **Patient Unique ID** — text input for HN
     - Label with pink `#` prefix
     - Gray background input field (`bg-[#f8fafc]`)
     - Helper text below
  2. **Hospital Selection** — scrollable radio list
     - Read hospitals from `STUDY_CONFIG.hospitals`
     - Each item: card with radio circle + hospital name
     - Selected state: pink border with dark dot
- Footer: "← Back to Home" + "Generate System ID Or Continue" button
- **Logic:** Calls `POST /api/sessions/start`. Handles existing session detection with popup modals.

### Page 3: Inclusion Criteria (`InclusionCriteria.jsx`)
- Read criteria from `INCLUSION_CRITERIA` config
- Title: "Inclusion Criteria Assessment"
- Subtitle: "Step 2: Please confirm the patient meets ALL of the following inclusion criteria."
- Clickable checkbox cards (green when checked)
- Warning message if not all checked
- Footer: "← Back" + "Continue to Exclusion" (enabled only when all checked)
- **Logic:** Calls `POST /api/sessions/:id/inclusion`

### Page 4: Exclusion Criteria (`ExclusionCriteria.jsx`)
- Read criteria from `EXCLUSION_CRITERIA` config
- Title: "Exclusion Criteria Assessment"  
- Orange warning banner: "Any 'Yes' answer will immediately disqualify the patient"
- Yes/No toggle buttons per criterion
- Red disqualification alert if any "Yes" selected
- Footer: "← Back" + "Continue" (enabled only when all answered "No")
- **Logic:** Calls `POST /api/sessions/:id/exclusion`

### Page 5: Pause Page (`PausePage.jsx`) ⬅️ NEW
- **Purpose:** Confirmation that screening is saved. User is told to return later for scoring.
- Clean, centered card with:
  - ✅ Green checkmark icon circle
  - Title: "Screening Complete — Session Saved"
  - Subtitle: "The inclusion and exclusion screening for this patient has been completed and saved."
  - Info box showing:
    - System ID
    - Hospital
    - Inclusion: ✅ Passed
    - Exclusion: ✅ Passed
  - Instructions: "You may close this browser. When ready to continue, return to the home page and enter the same Hospital Number to resume the assessment."
  - Two buttons:
    - "Return to Home" (primary pink) → clears context, goes to `/`
    - "Continue to Assessment Now" (secondary/outline) → navigates to `/score` (for users who don't need to pause)
- **Logic:** Calls `POST /api/sessions/:id/pause` to update status to `PAUSED`

### Page 6: Score Assessment (`ScoreAssessment.jsx`)
- Read parameters from `SCORE_CONFIG` config
- Title: from `SCORE_CONFIG.title`
- Subtitle: step description
- For each parameter: bordered card with label + description + selectable buttons
  - Selected button: pink/primary color with `(+N)` badge
  - Unselected: white with slate border
- Bottom score summary:
  - "Total Risk Score" with large number display
  - Stratification label (from config)
  - Ineligibility warning if below threshold
- Footer: "← Back" + "Calculate & Randomize" button
- **Logic:** Calls `POST /api/sessions/:id/select-score` — backend performs block randomization

### Page 7: Randomization Result (`RandomizationResult.jsx`)
- Celebration card with green checkmark icon
- Title: "Randomization Successful"
- Grid showing System ID + Score
- Large arm assignment highlight:
  - Drug Arm: pink background with glow shadow
  - Placebo Arm: blue border with glow shadow
- "Return to Home Portal" button (clears all state)

---

## 🗄️ DATABASE SCHEMA (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Hospital {
  id       Int            @id @default(autoincrement())
  prefix   String         @unique
  name     String
  sessions TrialSession[]
  users    User[]
  patients Patient[]
}

model User {
  id         Int            @id @default(autoincrement())
  hospitalId Int
  role       String         // 'admin', 'doctor'
  hospital   Hospital       @relation(fields: [hospitalId], references: [id])
  sessions   TrialSession[]
}

model Patient {
  id         String         @id @default(uuid()) @db.Uuid
  hn         String
  hospitalId Int
  hospital   Hospital       @relation(fields: [hospitalId], references: [id])
  sessions   TrialSession[]
  createdAt  DateTime       @default(now()) @db.Timestamptz()
  updatedAt  DateTime       @updatedAt @db.Timestamptz()

  @@unique([hospitalId, hn])
}

model TrialSession {
  id                         String    @id @default(uuid()) @db.Uuid
  trialSystemId              String    @unique
  patientId                  String    @db.Uuid
  patient                    Patient   @relation(fields: [patientId], references: [id])
  hospitalId                 Int
  userId                     Int

  // Status Tracking
  // REGISTERED → INCLUSION_PASSED → EXCLUSION_PASSED → PAUSED → SCORED → RANDOMIZED
  // Any step can → DISQUALIFIED
  currentStatus              String    @default("REGISTERED")

  // Timestamps
  registrationTimestamp      DateTime  @default(now()) @db.Timestamptz()
  inclusionPageTimestamp      DateTime? @db.Timestamptz()
  exclusionPageTimestamp      DateTime? @db.Timestamptz()
  pauseTimestamp             DateTime? @db.Timestamptz()    // ⬅️ NEW
  resumeTimestamp            DateTime? @db.Timestamptz()    // ⬅️ NEW
  scoreTimestamp             DateTime? @db.Timestamptz()
  randomizationTimestamp     DateTime? @db.Timestamptz()

  // Criteria Results
  inclusionPassed            Boolean?
  exclusionPassed            Boolean?
  failedReason               String?

  // Assessment Score (dynamic — field names from scoreConfig keys)
  cognitiveSeverityScore     Int?
  vascularRiskScore          Int?
  behavioralSymptomsScore    Int?
  functionalImpairmentScore  Int?
  familyHistoryScore         Int?
  totalScore                 Int?
  strata                     String?   // 'Moderate Risk' or 'High/Very High Risk'

  // Randomization Result
  allocationResult           String?   // 'Drug Arm (Levetiracetam)' or 'Placebo Arm'

  // Relations
  hospital                   Hospital  @relation(fields: [hospitalId], references: [id])
  user                       User      @relation(fields: [userId], references: [id])
}
```

---

## 🔌 BACKEND API ENDPOINTS

### Base URL: `http://localhost:10000/api`

### Session Routes (`/api/sessions`)

#### 1. `POST /start` — Start or resume a session
```json
Request:  { "hospitalPrefix": "KCMH", "hospitalName": "...", "uniqueId": "HN12345" }
Response: { "message": "...", "session": {...}, "isExisting": true/false }
```
- Finds/creates Hospital → Finds/creates Patient → Checks for existing session
- If existing: returns `isExisting: true` so frontend can show appropriate popup
- If new: generates sequential Trial System ID (e.g., `KCMH-001`) with collision retry

#### 2. `POST /:id/inclusion` — Submit inclusion result
```json
Request:  { "passed": true, "failedReason": null }
Response: { "message": "...", "session": {...} }
```

#### 3. `POST /:id/exclusion` — Submit exclusion result
```json
Request:  { "conditions": { "exc1": false, "exc2": false, ... } }
Response: { "message": "...", "session": {...} }
```

#### 4. `POST /:id/pause` — Mark session as paused ⬅️ NEW
```json
Request:  {}
Response: { "message": "Session paused", "session": {...} }
```
- Sets `currentStatus` to `PAUSED`
- Records `pauseTimestamp`

#### 5. `POST /:id/resume` — Mark session as resumed ⬅️ NEW  
```json
Request:  {}
Response: { "message": "Session resumed", "session": {...} }
```
- Records `resumeTimestamp`

#### 6. `POST /:id/score` — Submit assessment score & randomize
```json
Request: {
  "cognitiveSeverityScore": 2,
  "vascularRiskScore": 1,
  "behavioralSymptomsScore": 0,
  "functionalImpairmentScore": 1,
  "familyHistoryScore": 1
}
Response: { "message": "...", "session": {...} }
```
- Auto-calculates `totalScore` (sum of all score fields)
- Determines strata based on score thresholds
- If eligible (score ≥ minimum): performs block randomization from CSV file
- If ineligible: marks as `DISQUALIFIED`

### Admin Routes (`/api/admin`)

#### 7. `GET /dashboard` — Get all statistics + audit trail
```json
Response: {
  "stats": {
    "totalRand": 13,
    "drugArm": 7,
    "placeboArm": 6,
    "failInc": 2,
    "failExc": 1,
    "paused": 3,
    "hospStats": { "KCMH": { "rand": 5, "fail": 1 }, ... },
    "scoreFreq": { "4": 2, "5": 3, ... },
    "compStats": { "cognitiveSeverity": 10, ... }
  },
  "data": [
    {
      "id": "KCMH-001",
      "hn": "12345",
      "hospital": "KCMH",
      "status": "Randomized",
      "timestamps": { "start": "...", "inc": "...", "exc": "...", "pause": "...", "resume": "...", "rand": "..." },
      "score": 6,
      "arm": "Drug Arm (Levetiracetam)"
    }
  ]
}
```

---

## 🖥️ ADMIN DASHBOARD (Simplified)

### Admin Login Page
- Username/password fields with simple client-side auth
- Preconfigured accounts: `superadmin/superadmin123` and `admin/admin123`

### Admin Menu Page
- Two cards: "Operations Dashboard" and "System Settings" (placeholder)

### Dashboard Page
- **KPI Stats Row:** Total Randomized, Drug Arm count, Placebo Arm count, Failed counts, Paused count
- **Score Distribution:** Bar chart showing frequency of scores 4-9
- **Audit Trail Table:** All sessions with columns:
  - System ID | HN | Hospital | Status | Timestamps (Start, Inc, Exc, Pause, Resume, Rand) | Score | Arm
- **Print/Export:** Button to trigger `window.print()` for PDF export

---

## 🔧 STATE MANAGEMENT

### PatientContext (React Context)
```javascript
const [patientData, setPatientData] = useState({
  dbSessionId: null,     // UUID from backend
  systemId: null,        // e.g., "KCMH-001"
  hospital: '',
  hn: '',
  inclusionPass: false,
  exclusionPass: false,
  paused: false,         // ⬅️ NEW
  totalScore: null,
  assignedArm: null,
  // Individual score components (dynamic from config)
  cognitiveSeverityScore: null,
  vascularRiskScore: null,
  behavioralSymptomsScore: null,
  functionalImpairmentScore: null,
  familyHistoryScore: null,
});
```

### Progress Bar Steps (7 total)
```
Step 1: Registration
Step 2: Inclusion
Step 3: Exclusion
Step 4: Pause
Step 5: Score Assessment
Step 6: Result
```

(Note: Step numbering in ProgressBar component — adjust the circular indicators to 6 visible steps within the Layout)

### Local Storage Persistence
- Save checkbox/answer states per System ID to `localStorage`
- Keys: `inclusion_${systemId}`, `exclusion_${systemId}`, `score_${systemId}`
- This allows users to refresh the page without losing in-progress form data

---

## 🚀 DEPLOYMENT NOTES

### Frontend (Vercel)
```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Backend (Render)
- Keep-alive endpoint: `GET /api/keep-alive` — pings DB to prevent cold start
- CORS enabled for all origins
- Port from `process.env.PORT` or `10000`

### API Base URL
```javascript
// sessionApi.js — toggle between local and production
const API_BASE_URL = 'https://your-app.onrender.com/api';
// const API_BASE_URL = 'http://localhost:10000/api';
```

---

## ✅ CHECKLIST FOR THE BUILDER

- [ ] Initialize project with `npx create-vite@latest` (React template)
- [ ] Set up Tailwind CSS 4 with `@tailwindcss/vite`
- [ ] Create config files first (studyConfig, inclusionConfig, exclusionConfig, scoreConfig)
- [ ] Build UI components (Button, Card, Badge, Input, LoadingOverlay, ProgressBar)
- [ ] Implement Layout with fixed header + ProgressBar (7 steps)
- [ ] Build all pages reading from config files
- [ ] Implement PatientContext with all state fields
- [ ] Build sessionApi.js with all API calls
- [ ] Set up Express backend with Prisma
- [ ] Create Prisma schema and migrate
- [ ] Implement all controller logic (especially the two-visit pause/resume flow)
- [ ] Add block randomization from CSV files
- [ ] Build simplified Admin Dashboard
- [ ] Add localStorage persistence for form states
- [ ] Test the full two-visit workflow end-to-end
- [ ] Deploy frontend to Vercel, backend to Render

---

## 📝 NOTES FOR EDITING LATER

When you need to change the study criteria for the actual trial:

1. **Change study title/subtitle:** Edit `src/config/studyConfig.js` → `title` and `subtitle`
2. **Change hospitals:** Edit `src/config/studyConfig.js` → `hospitals` array
3. **Change inclusion criteria:** Edit `src/config/inclusionConfig.js` → add/remove/edit items
4. **Change exclusion criteria:** Edit `src/config/exclusionConfig.js` → add/remove/edit items  
5. **Change scoring system:** Edit `src/config/scoreConfig.js` → modify parameters, thresholds, labels
6. **Change randomization arms:** Edit `src/config/studyConfig.js` → `arms` object
7. **Change backend score fields:** Update `prisma/schema.prisma` and `controllers/sessionController.js`
