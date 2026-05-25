// Mock Client-Side Database Client for Alzheimer-LEV Trial
// This file replaces the backend HTTP calls with client-side localStorage simulation.

const DB_KEY = 'trial_sessions';

const STATUS_PRIORITY = {
  'REGISTERED': 0,
  'INCLUSION_PASSED': 1,
  'EXCLUSION_PASSED': 2,
  'PAUSED': 3,
  'SCORED': 4,
  'RANDOMIZED': 5,
  'DISQUALIFIED': 6
};

// Stratification schedules embedded directly from CSV files
const DrugArmBased = [
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm", "Placebo Arm",
  "Placebo Arm", "Placebo Arm", "Placebo Arm", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Placebo Arm", "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Placebo Arm", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Placebo Arm", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Placebo Arm", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm"
];

const PlaceboArmBased = [
  "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Placebo Arm", "Placebo Arm", "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm", "Placebo Arm", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Placebo Arm", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm", "Placebo Arm", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Drug Arm (Levetiracetam)", "Placebo Arm", "Drug Arm (Levetiracetam)", "Placebo Arm",
  "Placebo Arm", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)", "Drug Arm (Levetiracetam)",
  "Placebo Arm", "Placebo Arm"
];

function generateUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getNextStatus(current, target) {
  if ((STATUS_PRIORITY[target] || 0) > (STATUS_PRIORITY[current] || 0)) {
    return target;
  }
  return current;
}

const getInitialMockData = () => {
  return [
    {
      id: "a310bb2b-ec1d-44eb-b630-9b4c053c89b1",
      trialSystemId: "KCMH-001",
      hn: "78901",
      hospitalPrefix: "KCMH",
      hospitalName: "King Chulalongkorn Memorial Hospital",
      userId: 1,
      currentStatus: "RANDOMIZED",
      registrationTimestamp: new Date("2026-05-18T09:00:00+07:00").toISOString(),
      inclusionPageTimestamp: new Date("2026-05-18T09:05:00+07:00").toISOString(),
      exclusionPageTimestamp: new Date("2026-05-18T09:10:00+07:00").toISOString(),
      pauseTimestamp: null,
      resumeTimestamp: null,
      scoreTimestamp: new Date("2026-05-18T09:15:00+07:00").toISOString(),
      randomizationTimestamp: new Date("2026-05-18T09:15:00+07:00").toISOString(),
      inclusionPassed: true,
      exclusionPassed: true,
      failedReason: null,
      cognitiveSeverityScore: 2,
      vascularRiskScore: 1,
      behavioralSymptomsScore: 1,
      functionalImpairmentScore: 1,
      familyHistoryScore: 1,
      totalScore: 6,
      strata: "High/Very High Risk",
      allocationResult: "Placebo Arm"
    },
    {
      id: "b310bb2b-ec1d-44eb-b630-9b4c053c89b2",
      trialSystemId: "KCMH-002",
      hn: "45612",
      hospitalPrefix: "KCMH",
      hospitalName: "King Chulalongkorn Memorial Hospital",
      userId: 1,
      currentStatus: "RANDOMIZED",
      registrationTimestamp: new Date("2026-05-19T10:00:00+07:00").toISOString(),
      inclusionPageTimestamp: new Date("2026-05-19T10:04:00+07:00").toISOString(),
      exclusionPageTimestamp: new Date("2026-05-19T10:08:00+07:00").toISOString(),
      pauseTimestamp: null,
      resumeTimestamp: null,
      scoreTimestamp: new Date("2026-05-19T10:12:00+07:00").toISOString(),
      randomizationTimestamp: new Date("2026-05-19T10:12:00+07:00").toISOString(),
      inclusionPassed: true,
      exclusionPassed: true,
      failedReason: null,
      cognitiveSeverityScore: 3,
      vascularRiskScore: 2,
      behavioralSymptomsScore: 1,
      functionalImpairmentScore: 1,
      familyHistoryScore: 1,
      totalScore: 8,
      strata: "High/Very High Risk",
      allocationResult: "Drug Arm (Levetiracetam)"
    },
    {
      id: "c310bb2b-ec1d-44eb-b630-9b4c053c89b3",
      trialSystemId: "BCH-001",
      hn: "12389",
      hospitalPrefix: "BCH",
      hospitalName: "Buddhachinaraj Hospital",
      userId: 1,
      currentStatus: "RANDOMIZED",
      registrationTimestamp: new Date("2026-05-20T11:00:00+07:00").toISOString(),
      inclusionPageTimestamp: new Date("2026-05-20T11:05:00+07:00").toISOString(),
      exclusionPageTimestamp: new Date("2026-05-20T11:09:00+07:00").toISOString(),
      pauseTimestamp: null,
      resumeTimestamp: null,
      scoreTimestamp: new Date("2026-05-20T11:15:00+07:00").toISOString(),
      randomizationTimestamp: new Date("2026-05-20T11:15:00+07:00").toISOString(),
      inclusionPassed: true,
      exclusionPassed: true,
      failedReason: null,
      cognitiveSeverityScore: 1,
      vascularRiskScore: 1,
      behavioralSymptomsScore: 1,
      functionalImpairmentScore: 1,
      familyHistoryScore: 1,
      totalScore: 5,
      strata: "Moderate Risk",
      allocationResult: "Drug Arm (Levetiracetam)"
    },
    {
      id: "d310bb2b-ec1d-44eb-b630-9b4c053c89b4",
      trialSystemId: "BCH-002",
      hn: "56782",
      hospitalPrefix: "BCH",
      hospitalName: "Buddhachinaraj Hospital",
      userId: 1,
      currentStatus: "DISQUALIFIED",
      registrationTimestamp: new Date("2026-05-20T14:20:00+07:00").toISOString(),
      inclusionPageTimestamp: new Date("2026-05-20T14:24:00+07:00").toISOString(),
      exclusionPageTimestamp: null,
      pauseTimestamp: null,
      resumeTimestamp: null,
      scoreTimestamp: null,
      randomizationTimestamp: null,
      inclusionPassed: false,
      exclusionPassed: null,
      failedReason: "Inclusion Failed",
      cognitiveSeverityScore: null,
      vascularRiskScore: null,
      behavioralSymptomsScore: null,
      functionalImpairmentScore: null,
      familyHistoryScore: null,
      totalScore: null,
      strata: null,
      allocationResult: null
    },
    {
      id: "e310bb2b-ec1d-44eb-b630-9b4c053c89b5",
      trialSystemId: "SWU-001",
      hn: "34561",
      hospitalPrefix: "SWU",
      hospitalName: "Faculty of Medicine, Srinakharinwirot University",
      userId: 1,
      currentStatus: "DISQUALIFIED",
      registrationTimestamp: new Date("2026-05-21T09:30:00+07:00").toISOString(),
      inclusionPageTimestamp: new Date("2026-05-21T09:34:00+07:00").toISOString(),
      exclusionPageTimestamp: new Date("2026-05-21T09:40:00+07:00").toISOString(),
      pauseTimestamp: null,
      resumeTimestamp: null,
      scoreTimestamp: null,
      randomizationTimestamp: null,
      inclusionPassed: true,
      exclusionPassed: false,
      failedReason: "Exclusion Failed",
      cognitiveSeverityScore: null,
      vascularRiskScore: null,
      behavioralSymptomsScore: null,
      functionalImpairmentScore: null,
      familyHistoryScore: null,
      totalScore: null,
      strata: null,
      allocationResult: null
    },
    {
      id: "f310bb2b-ec1d-44eb-b630-9b4c053c89b6",
      trialSystemId: "SWU-002",
      hn: "78923",
      hospitalPrefix: "SWU",
      hospitalName: "Faculty of Medicine, Srinakharinwirot University",
      userId: 1,
      currentStatus: "PAUSED",
      registrationTimestamp: new Date("2026-05-22T15:00:00+07:00").toISOString(),
      inclusionPageTimestamp: new Date("2026-05-22T15:05:00+07:00").toISOString(),
      exclusionPageTimestamp: new Date("2026-05-22T15:10:00+07:00").toISOString(),
      pauseTimestamp: new Date("2026-05-22T15:12:00+07:00").toISOString(),
      resumeTimestamp: null,
      scoreTimestamp: null,
      randomizationTimestamp: null,
      inclusionPassed: true,
      exclusionPassed: true,
      failedReason: null,
      cognitiveSeverityScore: null,
      vascularRiskScore: null,
      behavioralSymptomsScore: null,
      functionalImpairmentScore: null,
      familyHistoryScore: null,
      totalScore: null,
      strata: null,
      allocationResult: null
    },
    {
      id: "g310bb2b-ec1d-44eb-b630-9b4c053c89b7",
      trialSystemId: "MNR-001",
      hn: "90123",
      hospitalPrefix: "MNR",
      hospitalName: "Maharat Nakhon Ratchasima Hospital",
      userId: 1,
      currentStatus: "RANDOMIZED",
      registrationTimestamp: new Date("2026-05-23T10:30:00+07:00").toISOString(),
      inclusionPageTimestamp: new Date("2026-05-23T10:34:00+07:00").toISOString(),
      exclusionPageTimestamp: new Date("2026-05-23T10:38:00+07:00").toISOString(),
      pauseTimestamp: null,
      resumeTimestamp: null,
      scoreTimestamp: new Date("2026-05-23T10:45:00+07:00").toISOString(),
      randomizationTimestamp: new Date("2026-05-23T10:45:00+07:00").toISOString(),
      inclusionPassed: true,
      exclusionPassed: true,
      failedReason: null,
      cognitiveSeverityScore: 3,
      vascularRiskScore: 1,
      behavioralSymptomsScore: 1,
      functionalImpairmentScore: 1,
      familyHistoryScore: 1,
      totalScore: 7,
      strata: "High/Very High Risk",
      allocationResult: "Placebo Arm"
    },
    {
      id: "h310bb2b-ec1d-44eb-b630-9b4c053c89b8",
      trialSystemId: "CPA-001",
      hn: "23456",
      hospitalPrefix: "CPA",
      hospitalName: "Chao Phraya Abhaibhubejhr Hospital",
      userId: 1,
      currentStatus: "RANDOMIZED",
      registrationTimestamp: new Date("2026-05-23T14:00:00+07:00").toISOString(),
      inclusionPageTimestamp: new Date("2026-05-23T14:05:00+07:00").toISOString(),
      exclusionPageTimestamp: new Date("2026-05-23T14:10:00+07:00").toISOString(),
      pauseTimestamp: null,
      resumeTimestamp: null,
      scoreTimestamp: new Date("2026-05-23T14:20:00+07:00").toISOString(),
      randomizationTimestamp: new Date("2026-05-23T14:20:00+07:00").toISOString(),
      inclusionPassed: true,
      exclusionPassed: true,
      failedReason: null,
      cognitiveSeverityScore: 3,
      vascularRiskScore: 2,
      behavioralSymptomsScore: 2,
      functionalImpairmentScore: 1,
      familyHistoryScore: 1,
      totalScore: 9,
      strata: "High/Very High Risk",
      allocationResult: "Placebo Arm"
    },
    {
      id: "i310bb2b-ec1d-44eb-b630-9b4c053c89b9",
      trialSystemId: "SRN-001",
      hn: "67890",
      hospitalPrefix: "SRN",
      hospitalName: "Surin Hospital",
      userId: 1,
      currentStatus: "RANDOMIZED",
      registrationTimestamp: new Date("2026-05-24T08:30:00+07:00").toISOString(),
      inclusionPageTimestamp: new Date("2026-05-24T08:34:00+07:00").toISOString(),
      exclusionPageTimestamp: new Date("2026-05-24T08:38:00+07:00").toISOString(),
      pauseTimestamp: null,
      resumeTimestamp: null,
      scoreTimestamp: new Date("2026-05-24T08:44:00+07:00").toISOString(),
      randomizationTimestamp: new Date("2026-05-24T08:44:00+07:00").toISOString(),
      inclusionPassed: true,
      exclusionPassed: true,
      failedReason: null,
      cognitiveSeverityScore: 1,
      vascularRiskScore: 1,
      behavioralSymptomsScore: 1,
      functionalImpairmentScore: 0,
      familyHistoryScore: 1,
      totalScore: 4,
      strata: "Moderate Risk",
      allocationResult: "Drug Arm (Levetiracetam)"
    },
    {
      id: "j310bb2b-ec1d-44eb-b630-9b4c053c89b0",
      trialSystemId: "QSV-001",
      hn: "12345",
      hospitalPrefix: "QSV",
      hospitalName: "Somdej Na Si Racha Hospital",
      userId: 1,
      currentStatus: "DISQUALIFIED",
      registrationTimestamp: new Date("2026-05-24T11:00:00+07:00").toISOString(),
      inclusionPageTimestamp: new Date("2026-05-24T11:04:00+07:00").toISOString(),
      exclusionPageTimestamp: new Date("2026-05-24T11:08:00+07:00").toISOString(),
      pauseTimestamp: null,
      resumeTimestamp: null,
      scoreTimestamp: null,
      randomizationTimestamp: null,
      inclusionPassed: true,
      exclusionPassed: false,
      failedReason: "Exclusion Failed",
      cognitiveSeverityScore: null,
      vascularRiskScore: null,
      behavioralSymptomsScore: null,
      functionalImpairmentScore: null,
      familyHistoryScore: null,
      totalScore: null,
      strata: null,
      allocationResult: null
    },
    {
      id: "k310bb2b-ec1d-44eb-b630-9b4c053c89ba",
      trialSystemId: "CBH-001",
      hn: "34567",
      hospitalPrefix: "CBH",
      hospitalName: "Chulabhorn Hospital",
      userId: 1,
      currentStatus: "RANDOMIZED",
      registrationTimestamp: new Date("2026-05-24T15:30:00+07:00").toISOString(),
      inclusionPageTimestamp: new Date("2026-05-24T15:35:00+07:00").toISOString(),
      exclusionPageTimestamp: new Date("2026-05-24T15:40:00+07:00").toISOString(),
      pauseTimestamp: null,
      resumeTimestamp: null,
      scoreTimestamp: new Date("2026-05-24T15:45:00+07:00").toISOString(),
      randomizationTimestamp: new Date("2026-05-24T15:45:00+07:00").toISOString(),
      inclusionPassed: true,
      exclusionPassed: true,
      failedReason: null,
      cognitiveSeverityScore: 1,
      vascularRiskScore: 1,
      behavioralSymptomsScore: 1,
      functionalImpairmentScore: 1,
      familyHistoryScore: 1,
      totalScore: 5,
      strata: "Moderate Risk",
      allocationResult: "Drug Arm (Levetiracetam)"
    },
    {
      id: "l310bb2b-ec1d-44eb-b630-9b4c053c89bb",
      trialSystemId: "CBH-002",
      hn: "89012",
      hospitalPrefix: "CBH",
      hospitalName: "Chulabhorn Hospital",
      userId: 1,
      currentStatus: "RANDOMIZED",
      registrationTimestamp: new Date("2026-05-25T08:30:00+07:00").toISOString(),
      inclusionPageTimestamp: new Date("2026-05-25T08:34:00+07:00").toISOString(),
      exclusionPageTimestamp: new Date("2026-05-25T08:38:00+07:00").toISOString(),
      pauseTimestamp: null,
      resumeTimestamp: null,
      scoreTimestamp: new Date("2026-05-25T08:44:00+07:00").toISOString(),
      randomizationTimestamp: new Date("2026-05-25T08:44:00+07:00").toISOString(),
      inclusionPassed: true,
      exclusionPassed: true,
      failedReason: null,
      cognitiveSeverityScore: 3,
      vascularRiskScore: 2,
      behavioralSymptomsScore: 1,
      functionalImpairmentScore: 1,
      familyHistoryScore: 1,
      totalScore: 8,
      strata: "High/Very High Risk",
      allocationResult: "Placebo Arm"
    }
  ];
};

const loadDb = () => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    const initialData = getInitialMockData();
    localStorage.setItem(DB_KEY, JSON.stringify(initialData));
    return initialData;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    const initialData = getInitialMockData();
    localStorage.setItem(DB_KEY, JSON.stringify(initialData));
    return initialData;
  }
};

const saveDb = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// Setup helper in window console to clear database easily
if (typeof window !== 'undefined') {
  window.resetMockDb = () => {
    localStorage.removeItem(DB_KEY);
    console.log("Mock database cleared. Refreshing page...");
    window.location.reload();
  };
}

// Simulate latency for a realistic loading effect in the UI
const sleep = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// --- API IMPLEMENTATION ---

// Start or retrieve a trial session
export const startSession = async (payload) => {
  await sleep(500);
  const { hospitalPrefix, hospitalName, uniqueId } = payload;
  
  if (!hospitalPrefix) throw new Error('hospitalPrefix is required');
  if (!uniqueId) throw new Error('uniqueId is required');

  // Standardize HN by stripping /, -, spaces, and leading zeros
  const cleanHN = uniqueId.trim().replace(/[\/\-\s]/g, '').replace(/^0+/, '');

  const db = loadDb();

  // Find existing session for this patient under the same hospital
  const existingSession = db.find(s => s.hospitalPrefix === hospitalPrefix && s.hn === cleanHN);
  if (existingSession) {
    return {
      message: 'Existing session found',
      session: existingSession,
      isExisting: true
    };
  }

  // Count existing sessions at this hospital to generate the sequential ID
  const hospitalSessionsCount = db.filter(s => s.hospitalPrefix === hospitalPrefix).length;
  
  // Generate unique trial system ID
  const sequentialNumber = hospitalSessionsCount + 1;
  const paddedNumber = String(sequentialNumber).padStart(3, '0');
  const trialSystemId = `${hospitalPrefix}-${paddedNumber}`;

  const newSession = {
    id: generateUuid(),
    trialSystemId,
    hn: cleanHN,
    hospitalPrefix,
    hospitalName,
    userId: 1,
    currentStatus: 'REGISTERED',
    registrationTimestamp: new Date().toISOString(),
    inclusionPageTimestamp: null,
    exclusionPageTimestamp: null,
    pauseTimestamp: null,
    resumeTimestamp: null,
    scoreTimestamp: null,
    randomizationTimestamp: null,
    inclusionPassed: null,
    exclusionPassed: null,
    failedReason: null,
    cognitiveSeverityScore: null,
    vascularRiskScore: null,
    behavioralSymptomsScore: null,
    functionalImpairmentScore: null,
    familyHistoryScore: null,
    totalScore: null,
    strata: null,
    allocationResult: null
  };

  db.push(newSession);
  saveDb(db);

  return {
    message: 'Session started successfully',
    session: newSession
  };
};

// Submit Inclusion Criteria
export const submitInclusion = async (sessionId, payload) => {
  await sleep(400);
  const { passed, failedReason } = payload;

  const db = loadDb();
  const sessionIdx = db.findIndex(s => s.id === sessionId);
  if (sessionIdx === -1) throw new Error('Session not found');

  const currentSession = db[sessionIdx];
  const targetStatus = passed ? 'INCLUSION_PASSED' : 'DISQUALIFIED';

  currentSession.inclusionPassed = passed;
  currentSession.failedReason = passed ? null : failedReason;
  currentSession.inclusionPageTimestamp = new Date().toISOString();
  currentSession.currentStatus = getNextStatus(currentSession.currentStatus, targetStatus);

  db[sessionIdx] = currentSession;
  saveDb(db);

  return {
    message: 'Inclusion criteria updated',
    session: currentSession
  };
};

// Submit Exclusion Criteria
export const submitExclusion = async (sessionId, payload) => {
  await sleep(400);
  const { conditions } = payload;

  // If any exclusion condition is checked (true), the patient fails
  const anyFailed = Object.values(conditions).some(val => val === true);

  const db = loadDb();
  const sessionIdx = db.findIndex(s => s.id === sessionId);
  if (sessionIdx === -1) throw new Error('Session not found');

  const currentSession = db[sessionIdx];
  const targetStatus = anyFailed ? 'DISQUALIFIED' : 'EXCLUSION_PASSED';

  currentSession.exclusionPassed = !anyFailed;
  currentSession.failedReason = anyFailed ? 'Exclusion Failed' : null;
  currentSession.exclusionPageTimestamp = new Date().toISOString();
  currentSession.currentStatus = getNextStatus(currentSession.currentStatus, targetStatus);

  db[sessionIdx] = currentSession;
  saveDb(db);

  return {
    message: 'Exclusion criteria updated',
    session: currentSession
  };
};

// Pause a Session (Visit 1 complete)
export const pauseSession = async (sessionId) => {
  await sleep(300);
  const db = loadDb();
  const sessionIdx = db.findIndex(s => s.id === sessionId);
  if (sessionIdx === -1) throw new Error('Session not found');

  const currentSession = db[sessionIdx];
  currentSession.pauseTimestamp = new Date().toISOString();
  currentSession.currentStatus = getNextStatus(currentSession.currentStatus, 'PAUSED');

  db[sessionIdx] = currentSession;
  saveDb(db);

  return {
    message: 'Session paused',
    session: currentSession
  };
};

// Resume a Session (Visit 2 start)
export const resumeSession = async (sessionId) => {
  await sleep(300);
  const db = loadDb();
  const sessionIdx = db.findIndex(s => s.id === sessionId);
  if (sessionIdx === -1) throw new Error('Session not found');

  const currentSession = db[sessionIdx];
  currentSession.resumeTimestamp = new Date().toISOString();
  
  db[sessionIdx] = currentSession;
  saveDb(db);

  return {
    message: 'Session resumed',
    session: currentSession
  };
};

// Submit Assessment Score and Randomize
export const submitScore = async (sessionId, payload) => {
  await sleep(600);
  const {
    cognitiveSeverityScore,
    vascularRiskScore,
    behavioralSymptomsScore,
    functionalImpairmentScore,
    familyHistoryScore
  } = payload;

  const db = loadDb();
  const sessionIdx = db.findIndex(s => s.id === sessionId);
  if (sessionIdx === -1) throw new Error('Session not found');

  const currentSession = db[sessionIdx];

  const totalScore = (cognitiveSeverityScore || 0) + 
                     (vascularRiskScore || 0) + 
                     (behavioralSymptomsScore || 0) + 
                     (functionalImpairmentScore || 0) + 
                     (familyHistoryScore || 0);

  // Strata selection based on config thresholds:
  // Score < 4 -> Low Risk (Ineligible)
  // Score 4-5 -> Moderate Risk
  // Score 6-9 -> High/Very High Risk
  let strata = 'Low Risk (Ineligible)';
  let eligible = false;

  if (totalScore >= 6) {
    strata = 'High/Very High Risk';
    eligible = true;
  } else if (totalScore >= 4) {
    strata = 'Moderate Risk';
    eligible = true;
  }

  const targetStatus = eligible ? 'RANDOMIZED' : 'DISQUALIFIED';
  let finalAssignedArm = null;

  if (targetStatus === 'RANDOMIZED') {
    if (currentSession.allocationResult && currentSession.strata === strata) {
      finalAssignedArm = currentSession.allocationResult;
    } else {
      // Count how many prior sessions were randomized into this stratum
      const existingCount = db.filter(s => s.strata === strata && s.allocationResult !== null).length;

      if (strata === 'Moderate Risk') {
        const idx = existingCount % DrugArmBased.length;
        finalAssignedArm = DrugArmBased[idx];
      } else if (strata === 'High/Very High Risk') {
        const idx = existingCount % PlaceboArmBased.length;
        finalAssignedArm = PlaceboArmBased[idx];
      }
    }
  }

  currentSession.cognitiveSeverityScore = cognitiveSeverityScore;
  currentSession.vascularRiskScore = vascularRiskScore;
  currentSession.behavioralSymptomsScore = behavioralSymptomsScore;
  currentSession.functionalImpairmentScore = functionalImpairmentScore;
  currentSession.familyHistoryScore = familyHistoryScore;
  currentSession.totalScore = totalScore;
  currentSession.strata = strata;
  currentSession.failedReason = eligible ? null : 'Score Too Low';
  currentSession.allocationResult = finalAssignedArm;
  currentSession.scoreTimestamp = new Date().toISOString();

  if (targetStatus === 'RANDOMIZED' && !currentSession.randomizationTimestamp) {
    currentSession.randomizationTimestamp = new Date().toISOString();
  }
  currentSession.currentStatus = getNextStatus(currentSession.currentStatus, targetStatus);

  db[sessionIdx] = currentSession;
  saveDb(db);

  return {
    message: 'Score saved and randomized',
    session: currentSession
  };
};

// --- ADMIN API ---
export const fetchDashboardStats = async () => {
  await sleep(400);
  const db = loadDb();

  // Sort sessions chronologically (descending registration timestamp)
  const sortedSessions = [...db].sort((a, b) => 
    new Date(b.registrationTimestamp).getTime() - new Date(a.registrationTimestamp).getTime()
  );

  let totalRand = 0;
  let drugArm = 0;
  let placeboArm = 0;
  let failInc = 0;
  let failExc = 0;
  let paused = 0;

  const hospStats = {};
  const scoreFreq = { 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const compStats = { 
    cognitiveSeverity: 0, 
    vascularRisk: 0, 
    behavioralSymptoms: 0, 
    functionalImpairment: 0, 
    familyHistory: 0 
  };

  const formatTime = (ts) => {
    if (!ts) return '-';
    return new Date(ts).toLocaleTimeString('en-US', { 
      timeZone: 'Asia/Bangkok', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (ts) => {
    if (!ts) return '-';
    return new Date(ts).toLocaleString('en-US', { 
      timeZone: 'Asia/Bangkok', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formattedData = sortedSessions.map(d => {
    const hPrefix = d.hospitalPrefix;
    if (!hospStats[hPrefix]) hospStats[hPrefix] = { rand: 0, fail: 0 };

    let displayStatus = 'Registered';

    if (d.currentStatus === 'RANDOMIZED') {
      displayStatus = 'Randomized';
      totalRand++;
      if (d.allocationResult && d.allocationResult.includes('Drug Arm (Levetiracetam)')) {
        drugArm++;
      } else if (d.allocationResult && d.allocationResult.includes('Placebo Arm')) {
        placeboArm++;
      }
      
      hospStats[hPrefix].rand++;
      if (d.totalScore >= 4 && d.totalScore <= 9) {
        scoreFreq[d.totalScore]++;
      }

      if (d.cognitiveSeverityScore > 0) compStats.cognitiveSeverity++;
      if (d.vascularRiskScore > 0) compStats.vascularRisk++;
      if (d.behavioralSymptomsScore > 0) compStats.behavioralSymptoms++;
      if (d.functionalImpairmentScore > 0) compStats.functionalImpairment++;
      if (d.familyHistoryScore > 0) compStats.familyHistory++;

    } else if (d.currentStatus === 'DISQUALIFIED') {
      if (d.failedReason === 'Inclusion Failed') {
        displayStatus = 'Failed Inclusion';
        failInc++;
      } else if (d.failedReason === 'Exclusion Failed') {
        displayStatus = 'Failed Exclusion';
        failExc++;
      } else if (d.failedReason === 'Score Too Low') {
        displayStatus = 'Failed Exclusion';
        failExc++;
      }
      hospStats[hPrefix].fail++;
    } else if (d.currentStatus === 'INCLUSION_PASSED') {
      displayStatus = 'Passed Inclusion';
    } else if (d.currentStatus === 'EXCLUSION_PASSED') {
      displayStatus = 'Passed Exclusion';
    } else if (d.currentStatus === 'PAUSED') {
      displayStatus = 'Paused (Awaiting Return)';
      paused++;
    }

    return {
      id: d.trialSystemId,
      hn: d.hn || 'N/A',
      hospital: d.hospitalPrefix,
      status: displayStatus,
      anomaly: 'Normal',
      timestamps: {
        start: formatDate(d.registrationTimestamp),
        inc: formatTime(d.inclusionPageTimestamp),
        exc: formatTime(d.exclusionPageTimestamp),
        pause: formatTime(d.pauseTimestamp),
        resume: formatTime(d.resumeTimestamp),
        rand: formatTime(d.randomizationTimestamp)
      },
      score: d.totalScore,
      arm: d.allocationResult
    };
  });

  return {
    stats: {
      totalRand,
      drugArm,
      placeboArm,
      failInc,
      failExc,
      paused,
      hospStats,
      scoreFreq,
      compStats
    },
    data: formattedData
  };
};
