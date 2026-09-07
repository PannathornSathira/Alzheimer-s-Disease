import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { usePatient } from '../context/PatientContext';

const emptyPatient = { dbSessionId: null, systemId: null, hospital: '', hn: '', inclusionPass: false, exclusionPass: false, paused: false, eegGroup: null, allocationCode: null };

export function RandomizationResult() {
  const navigate = useNavigate();
  const { patientData, setPatientData } = usePatient();
  if (!patientData.systemId || !patientData.allocationCode) return <Card className="mt-8 text-center p-8"><p className="text-danger mb-4">No randomization result found.</p><Button onClick={() => navigate('/')}>Home</Button></Card>;

  return (
    <Card className="shadow-2xl border-primary ring-1 ring-primary/20 mt-8 animate-fade-in-up">
      <CardContent className="p-8 md:p-12 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-success-bg text-success rounded-full flex items-center justify-center mb-6 ring-4 ring-success/20">✓</div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Randomization Successful</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">The patient's EEG group has been saved and a randomization code has been assigned.</p>
        <div className="w-full max-w-lg mb-4 bg-slate-50 p-4 rounded-lg border border-slate-100"><p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">System ID</p><p className="text-lg font-bold text-slate-800">{patientData.systemId}</p></div>
        <div className="w-full max-w-lg mb-8 bg-slate-50 p-4 rounded-lg border border-slate-100"><p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">EEG Group</p><p className="text-lg font-bold text-slate-800">{patientData.eegGroup === 'NO_SEA' ? 'No SEA' : 'SEA'}</p></div>
        <div className="w-full max-w-lg p-6 rounded-xl border-2 mb-10 bg-[#E91E63] text-white border-[#E91E63] shadow-lg"><p className="text-sm font-semibold uppercase tracking-widest mb-2">Assigned Code</p><p className="text-6xl md:text-7xl font-black tracking-tight">{patientData.allocationCode}</p></div>
        <Button size="lg" className="w-full max-w-sm font-semibold" onClick={() => { setPatientData(emptyPatient); navigate('/'); }}>Return to Home Portal</Button>
      </CardContent>
    </Card>
  );
}
