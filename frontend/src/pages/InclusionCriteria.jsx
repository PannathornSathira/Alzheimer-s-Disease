import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import { submitInclusion } from '../api/sessionApi';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { INCLUSION_CRITERIA } from '../config/inclusionConfig';

export function InclusionCriteria() {
  const navigate = useNavigate();
  const { patientData, setPatientData } = usePatient();
  
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState(() => {
    if (patientData?.inclusionPass) {
      const initial = {};
      INCLUSION_CRITERIA.forEach(item => { initial[item.id] = true; });
      return initial;
    }
    const saved = localStorage.getItem(`inclusion_${patientData?.systemId}`);
    if (saved) return JSON.parse(saved);
    return {};
  });

  useEffect(() => {
    if (patientData?.systemId) {
      localStorage.setItem(`inclusion_${patientData.systemId}`, JSON.stringify(checkedItems));
    }
  }, [checkedItems, patientData?.systemId]);

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecked = INCLUSION_CRITERIA.every(item => checkedItems[item.id]);

  const handleNext = async () => {
    setIsLoading(true);
    try {
      if (patientData.dbSessionId) {
        await submitInclusion(patientData.dbSessionId, { passed: true });
      }
      setPatientData(prev => ({ ...prev, inclusionPass: true }));
      navigate('/exclusion');
    } catch (error) {
      console.error('Failed to submit inclusion criteria:', error);
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
      <LoadingOverlay isLoading={isLoading} message="Submitting Inclusion Criteria..." />
      
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#0f172a] mb-2 font-sans tracking-tight">
          Inclusion Criteria Assessment
        </h1>
        <p className="text-[16px] text-[#64748B]">
          Step 2: Please confirm the patient meets ALL of the following inclusion criteria.
        </p>
      </div>

      {/* Main Single Checkbox List Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-4">
        {INCLUSION_CRITERIA.map(item => (
          <div 
            key={item.id} 
            className={`flex items-start p-5 border rounded-xl cursor-pointer transition-all duration-200 select-none ${
              checkedItems[item.id] ? 'bg-[#ECFDF5] border-[#10B981] ring-1 ring-[#10B981] shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => toggleCheck(item.id)}
          >
            <div className="flex-shrink-0 mt-0.5 mr-4">
              <div className={`w-6 h-6 rounded-[6px] border-[2px] flex items-center justify-center transition-colors ${
                checkedItems[item.id] ? 'bg-[#10B981] border-[#10B981] text-white' : 'bg-white border-slate-300'
              }`}>
                {checkedItems[item.id] && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex-1">
              <span className={`text-[16px] font-semibold leading-snug ${checkedItems[item.id] ? 'text-slate-900' : 'text-slate-700'}`}>
                {item.text}
              </span>
            </div>
          </div>
        ))}

        {!allChecked && (
          <div className="mt-6 pt-4 text-center">
            <p className="inline-block p-4 bg-[#fef2f2] text-[#e11d48] border border-[#fecaca] rounded-lg text-[15px] font-medium shadow-sm">
              All inclusion criteria must be verified and checked to proceed.
            </p>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between">
        <button 
          onClick={() => navigate('/registration')}
          className="text-[#64748B] hover:text-slate-900 font-bold text-[16px] px-2 py-2 transition-colors flex items-center"
        >
          <span className="mr-2 opacity-80 mt-[2px]">←</span> Back
        </button>
        <button 
          onClick={handleNext} 
          disabled={!allChecked}
          className={`px-10 py-4 rounded-xl font-bold text-[16px] flex items-center transition-all ${
            allChecked 
              ? 'bg-[#E91E63] hover:bg-[#D81B60] text-white shadow-md active:scale-95' 
              : 'bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed opacity-70'
          }`}
        >
          Continue to Exclusion
        </button>
      </div>

    </div>
  );
}