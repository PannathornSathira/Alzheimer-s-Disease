import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ProgressBar } from './ui/ProgressBar';
import { usePatient } from '../context/PatientContext';

export function Layout() {
  const { patientData } = usePatient();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getStep = () => {
    const path = location.pathname;
    if (path === '/registration') return 1;
    if (path === '/inclusion') return 2;
    if (path === '/exclusion') return 3;
    if (path === '/pause') return 4;
    if (path === '/score') return 5;
    if (path === '/result') return 6;
    return 0;
  };

  const currentStep = getStep();
  const showHeader = currentStep > 1 && currentStep <= 6 && patientData.systemId;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
        
        {showHeader && (
          <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] z-50 animate-fade-in">
            <div className="max-w-[1200px] mx-auto px-6 h-[75px] flex items-center justify-between">
              
              <div className="flex items-center">
                <div className="w-[42px] h-[42px] rounded-xl bg-[#fce4ec] flex items-center justify-center text-[#E91E63] flex-shrink-0 mr-4">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-slate-400 font-bold tracking-wider uppercase mb-0.5">Active Patient Record</p>
                  <p className="text-[18px] font-bold text-slate-800 leading-none">
                    System ID: <span className="text-slate-900 ml-1.5">{patientData.systemId}</span>
                  </p>
                </div>
                
                <div className="h-[32px] border-l-[1.5px] border-slate-200 mx-6"></div>
                
                <div className="text-[15px] font-medium text-slate-500">
                  {patientData.hospital}
                </div>
              </div>
              
            </div>
          </header>
        )}

        {/* Spacer for fixed header */}
        {showHeader && <div className="h-[75px] w-full shrink-0"></div>}

        {/* Progress Bar (scrolls normally) */}
        {currentStep > 0 && currentStep <= 6 && (
          <div className="w-full bg-white border-b border-slate-100 mb-6 shrink-0">
             <ProgressBar currentStep={currentStep} totalSteps={6} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex-grow">
          <div className={`${currentStep > 0 && currentStep <= 5 ? 'max-w-[800px] mx-auto' : ''}`}>
            <Outlet />
          </div>
        </main>

      </div>
  );
}
