import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import { submitExclusion } from '../api/sessionApi';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { EXCLUSION_CRITERIA } from '../config/exclusionConfig';

export function ExclusionCriteria() {
  const navigate = useNavigate();
  const { patientData, setPatientData } = usePatient();
  
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState(() => {
    if (patientData?.exclusionPass) {
      const initial = {};
      EXCLUSION_CRITERIA.forEach(item => { initial[item.id] = 'No'; });
      return initial;
    }
    const saved = localStorage.getItem(`exclusion_${patientData?.systemId}`);
    if (saved) return JSON.parse(saved);
    return {};
  });

  useEffect(() => {
    if (patientData?.systemId) {
      localStorage.setItem(`exclusion_${patientData.systemId}`, JSON.stringify(answers));
    }
  }, [answers, patientData?.systemId]);

  const setAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const allAnswered = EXCLUSION_CRITERIA.every(item => answers[item.id] !== undefined);
  const anyYes = Object.values(answers).some(val => val === 'Yes');
  const allNo = allAnswered && !anyYes;

  const handleNext = async () => {
    const conditions = {};
    Object.keys(answers).forEach((key) => {
      conditions[key] = answers[key] === 'Yes';
    });

    setIsLoading(true);
    try {
      if (patientData.dbSessionId) {
        await submitExclusion(patientData.dbSessionId, { conditions });
      }
      setPatientData(prev => ({ ...prev, exclusionPass: true }));
      navigate('/pause');
    } catch (error) {
      console.error('Failed to submit exclusion criteria:', error);
      alert('Failed to connect to backend: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!patientData.systemId) {
    return (
      <div className="max-w-[800px] mx-auto mt-8 text-center p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
        <p className="text-red-500 mb-4 font-bold text-lg">Error: No active System ID found. Please start from Registration.</p>
        <button 
          onClick={() => navigate('/registration')}
          className="px-6 py-3 rounded-lg font-bold text-white bg-[#E91E63] hover:bg-[#D81B60] transition-colors"
        >
          Go to Registration
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto mt-6 mb-16 px-4">
      <LoadingOverlay isLoading={isLoading} message="Submitting Exclusion Criteria..." />
      
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#0f172a] mb-2 font-sans tracking-tight">
          Exclusion Criteria Assessment
        </h1>
        <p className="text-[16px] text-[#64748B]">
          Answer Yes or No for each exclusion criterion to verify the ABSENCE of disqualifying conditions.
        </p>
      </div>

      {/* Orange Warning Notice */}
      <div className="bg-[#fffbeb] border border-[#fde68a] border-l-4 border-l-[#d97706] rounded-r-lg p-5 mb-8 flex items-start shadow-sm">
        <svg className="w-6 h-6 text-[#d97706] mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h4 className="text-[16px] font-bold text-[#b45309] mb-1">Important Notice</h4>
          <p className="text-[15px] font-medium text-[#92400e]">
            Any "Yes" answer will immediately disqualify the patient from trial enrollment.
          </p>
        </div>
      </div>

      {/* Main Yes/No List Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-5">
        {EXCLUSION_CRITERIA.map((item) => (
          <div key={item.id} className="pb-5 border-b border-slate-100 last:border-0 last:pb-0">
            <span className="block text-[16px] font-semibold text-slate-800 mb-3 leading-snug">
              {item.label}
            </span>
            <div className="flex gap-4">
              <button
                onClick={() => setAnswer(item.id, 'No')}
                className={`flex-1 py-3 border rounded-lg font-bold text-[15px] transition-all select-none ${
                  answers[item.id] === 'No' 
                    ? 'bg-[#ecfdf5] border-[#10b981] text-[#047857] shadow-sm ring-1 ring-[#10b981]' 
                    : 'bg-white border-slate-300 text-slate-600 hover:bg-[#f8fafc]'
                }`}
              >
                No
              </button>
              <button
                onClick={() => setAnswer(item.id, 'Yes')}
                className={`flex-1 py-3 border rounded-lg font-bold text-[15px] transition-all select-none ${
                  answers[item.id] === 'Yes' 
                    ? 'bg-[#fff1f2] border-[#f43f5e] text-[#be123c] shadow-sm ring-1 ring-[#f43f5e]' 
                    : 'bg-white border-slate-300 text-slate-600 hover:bg-[#f8fafc]'
                }`}
              >
                Yes
              </button>
            </div>
          </div>
        ))}
        
        {!allAnswered && !anyYes && (
          <div className="mt-8 pt-2 text-center">
            <p className="inline-block p-4 bg-[#fef2f2] text-[#e11d48] border border-[#fecaca] rounded-lg text-[15px] font-medium shadow-sm">
              Please answer all questions above to proceed.
            </p>
          </div>
        )}

        {anyYes && (
          <div className="mt-8 pt-2 text-center animate-fade-in-up">
            <p className="inline-block px-6 py-4 bg-[#fef2f2] text-[#e11d48] border border-[#fecaca] rounded-lg text-[16px] font-bold shadow-sm">
              ⚠️ Patient is DISQUALIFIED due to presence of exclusion criteria.
            </p>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between">
        <button 
          onClick={() => navigate('/inclusion')}
          className="text-[#64748B] hover:text-slate-900 font-bold text-[16px] px-2 py-2 transition-colors flex items-center"
        >
          <span className="mr-2 opacity-80 mt-[2px]">←</span> Back
        </button>
        <button 
          onClick={handleNext} 
          disabled={!allNo}
          className={`px-10 py-4 rounded-xl font-bold text-[16px] flex items-center transition-all ${
            allNo 
              ? 'bg-[#E91E63] hover:bg-[#D81B60] text-white shadow-md active:scale-95' 
              : 'bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed opacity-70'
          }`}
        >
          Continue
        </button>
      </div>

    </div>
  );
}