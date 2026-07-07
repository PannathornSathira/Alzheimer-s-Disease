// ============================================================
// SCORING/ASSESSMENT PARAMETERS
// This replaces the SeLECT Score from the epilepsy project.
// Edit the scoring categories and options to match your study.
// The system auto-sums the selected points.
// ============================================================

export const SCORE_CONFIG = {
  title: "EEG finding",
  description:
    "Determine the patient's subclinical epileptiform activity for trial stratification.",

  // Minimum score required for randomization eligibility
  minimumScoreForRandomization: 4,

  // Risk stratification thresholds
  stratification: [
    {
      minScore: 0,
      maxScore: 3,
      label: "Ineligible",
      eligible: false,
    },
    { minScore: 4, maxScore: 5, label: "No SEA Stratum", eligible: true },
    { minScore: 6, maxScore: 9, label: "SEA Stratum", eligible: true },
  ],

  // Scoring parameters — each has a key, label, optional description, and point options
  parameters: [
    {
      key: "cognitiveSeverity",
      label: "EEG finding",
      description: "Determine the patient's subclinical epileptiform activity for trial stratification.",
      options: [
        { id: "sea", label: "SEA", points: 6 },
        { id: "nosea", label: "No SEA", points: 4 },
      ],
    },
  ],
};
