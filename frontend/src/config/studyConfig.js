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
