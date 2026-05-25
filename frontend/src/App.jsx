import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PatientContext } from './context/PatientContext';
import { Home } from './pages/Home';
import { Registration } from './pages/Registration';
import { InclusionCriteria } from './pages/InclusionCriteria';
import { ExclusionCriteria } from './pages/ExclusionCriteria';
import { PausePage } from './pages/PausePage';
import { ScoreAssessment } from './pages/ScoreAssessment';
import { RandomizationResult } from './pages/RandomizationResult';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminHome } from './pages/AdminHome';
import { AdminMenu } from './pages/AdminMenu';

export default function App() {
  const [patientData, setPatientData] = useState({
    dbSessionId: null,      // UUID from backend
    systemId: null,         // e.g., "KCMH-001"
    hospital: '',
    hn: '',
    inclusionPass: false,
    exclusionPass: false,
    paused: false,
    totalScore: null,
    assignedArm: null,
    
    // Scoring parameters (dynamic fields matching scoreConfig keys)
    cognitiveSeverityScore: null,
    vascularRiskScore: null,
    behavioralSymptomsScore: null,
    functionalImpairmentScore: null,
    familyHistoryScore: null,
  });

  return (
    <PatientContext.Provider value={{ patientData, setPatientData }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin-menu" element={<AdminMenu />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          
          <Route element={<Layout />}>
            <Route path="/registration" element={<Registration />} />
            <Route path="/inclusion" element={<InclusionCriteria />} />
            <Route path="/exclusion" element={<ExclusionCriteria />} />
            <Route path="/pause" element={<PausePage />} />
            <Route path="/score" element={<ScoreAssessment />} />
            <Route path="/result" element={<RandomizationResult />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PatientContext.Provider>
  );
}
