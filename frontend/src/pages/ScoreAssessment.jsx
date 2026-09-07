import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { usePatient } from '../context/PatientContext';
import { randomizeSession } from '../api/sessionApi';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { EEG_GROUP_OPTIONS } from '../config/scoreConfig';

export function ScoreAssessment() {
  const navigate = useNavigate();
  const { patientData, setPatientData } = usePatient();
  const [eegGroup, setEegGroup] = useState(patientData.eegGroup || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRandomize = async () => {
    if (!eegGroup || !patientData.dbSessionId) return;
    setIsLoading(true);
    try {
      const response = await randomizeSession(patientData.dbSessionId, eegGroup);
      setPatientData((current) => ({ ...current, eegGroup: response.session.eegGroup, allocationCode: response.session.allocationCode }));
      navigate('/result');
    } catch (error) {
      alert(`Failed to randomize: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!patientData.systemId) return <Card className="mt-8 text-center p-8"><p className="text-danger mb-4">No active System ID found.</p><Button onClick={() => navigate('/registration')}>Go to Registration</Button></Card>;

  return (
    <div className="max-w-[800px] mx-auto mt-6 mb-16 px-4">
      <LoadingOverlay isLoading={isLoading} message="Assigning randomization code..." />
      <Card className="shadow-lg border-slate-200 mt-2">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-800">EEG Group</CardTitle>
          <p className="text-slate-500 text-sm mt-2">Select the patient's EEG finding. The system will use the next code from that group's approved allocation list.</p>
        </CardHeader>
        <CardContent className="py-12 flex flex-col items-center">
          <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-lg px-4">
            {EEG_GROUP_OPTIONS.map((option) => (
              <button key={option.id} onClick={() => setEegGroup(option.id)} className={`flex-1 py-8 px-6 border-2 rounded-xl text-3xl font-bold transition-all min-h-[120px] ${eegGroup === option.id ? 'bg-[#E91E63] border-[#E91E63] text-white shadow-xl ring-4 ring-[#E91E63]/25' : 'bg-white text-slate-700 border-slate-300 hover:border-pink-300 hover:bg-slate-50'}`}>
                {option.label}
              </button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <button onClick={() => navigate('/exclusion')} className="text-[#64748B] hover:text-slate-900 font-bold px-2 py-2">← Back</button>
          <button onClick={handleRandomize} disabled={!eegGroup} className={`px-10 py-4 rounded-xl font-bold text-[16px] ${eegGroup ? 'bg-[#E91E63] hover:bg-[#D81B60] text-white shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Randomize</button>
        </CardFooter>
      </Card>
    </div>
  );
}
