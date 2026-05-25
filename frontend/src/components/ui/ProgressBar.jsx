import React from 'react';

const STEP_LABELS = ['Registration', 'Inclusion', 'Exclusion', 'Pause', 'Score Assessment', 'Randomization'];

export function ProgressBar({ currentStep, totalSteps = 6 }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-start justify-between relative">
        {/* Background Track */}
        <div className="absolute left-[8%] top-5 w-[84%] h-[2px] bg-slate-200 z-0"></div>
        
        {/* Active Track */}
        <div 
          className="absolute left-[8%] top-5 h-[2px] bg-[#E91E63] z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${Math.max(0, ((currentStep - 1) / (totalSteps - 1)) * 84)}%` }}
        ></div>

        {steps.map((step, index) => {
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center w-28">
              <div 
                className={`w-11 h-11 rounded-full flex items-center justify-center text-[16px] font-bold transition-all duration-300 mb-3 select-none
                  ${isActive ? 'bg-white border-[2.5px] border-[#E91E63] text-[#E91E63] shadow-md ring-2 ring-[#E91E63]/10' 
                  : isCompleted ? 'bg-[#E91E63] border-[2.5px] border-[#E91E63] text-white shadow-sm' 
                  : 'bg-white border-[2.5px] border-slate-200 text-slate-400'}`}
              >
                {isCompleted ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span className={`text-[13px] text-center font-bold tracking-wide ${isActive || isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                {STEP_LABELS[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
