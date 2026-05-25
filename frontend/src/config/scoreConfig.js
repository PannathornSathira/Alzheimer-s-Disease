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
