import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { usePatient } from '../context/PatientContext';
import { STUDY_CONFIG } from '../config/studyConfig';

export function RandomizationResult() {
  const navigate = useNavigate();
  const { patientData, setPatientData } = usePatient();

  const handleFinish = () => {
    // Clear state returning to home to start fresh
    setPatientData({
      dbSessionId: null,
      systemId: null,
      hospital: '',
      hn: '',
      inclusionPass: false,
      exclusionPass: false,
      paused: false,
      totalScore: null,
      assignedArm: null,
      cognitiveSeverityScore: null,
      vascularRiskScore: null,
      behavioralSymptomsScore: null,
      functionalImpairmentScore: null,
      familyHistoryScore: null,
    });
    navigate('/');
  };

  if (!patientData.systemId) {
    return (
      <Card className="mt-8 text-center p-8">
        <p className="text-danger mb-4">Error: No active System ID found.</p>
        <Button onClick={() => navigate('/')}>Home</Button>
      </Card>
    );
  }

  const isIntervention = patientData.assignedArm?.includes('Drug') || patientData.assignedArm?.includes('Levetiracetam');
  const displayArm = isIntervention 
    ? (STUDY_CONFIG.displayArms?.intervention || 'A')
    : (STUDY_CONFIG.displayArms?.placebo || 'B');

  return (
    <Card className="shadow-2xl border-primary ring-1 ring-primary/20 mt-8 animate-fade-in-up">
      <CardContent className="p-8 md:p-12 flex flex-col items-center text-center">
        
        <div className="w-20 h-20 bg-success-bg text-success rounded-full flex items-center justify-center mb-6 ring-4 ring-success/20">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Randomization Successful</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
          The patient has been successfully stratified and assigned to a clinical trial arm via the central randomization system.
        </p>

        {/* Info Grid */}
        <div className="w-full max-w-lg mb-8">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">System ID</p>
            <p className="text-lg font-bold text-slate-800">{patientData.systemId}</p>
          </div>
        </div>

        {/* Huge Assigned Arm Highlight */}
        <div className={`w-full max-w-lg p-6 rounded-xl border-2 mb-10 ${
            isIntervention 
              ? 'bg-primary text-white border-primary shadow-[0_0_30px_rgba(233,30,99,0.3)]' 
              : 'bg-white text-info border-info shadow-[0_0_30px_rgba(59,130,246,0.3)]'
          }`}
        >
          <p className={`text-sm font-semibold uppercase tracking-widest mb-2 ${isIntervention ? 'text-primary-light' : 'text-blue-400'}`}>Assigned Arm</p>
          <p className="text-6xl md:text-7xl font-black tracking-tight">{displayArm}</p>
        </div>

        <Button size="lg" variant={isIntervention ? "primary" : "secondary"} className="w-full max-w-sm font-semibold" onClick={handleFinish}>
          Return to Home Portal
        </Button>
        <p className="mt-4 text-sm text-slate-400">A confirmation email has been sent to the PI.</p>

      </CardContent>
    </Card>
  );
}