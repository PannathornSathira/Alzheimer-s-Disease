import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { STUDY_CONFIG } from '../config/studyConfig';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      
      {/* Title */}
      <div className="max-w-4xl w-full text-center mb-10 animate-fade-in-up px-4 flex flex-col items-center">
        
        {/* Study Header Badge & Identity Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fce4ec] border border-[#fbcfe8] text-[#E91E63] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#E91E63] animate-pulse"></span>
          {STUDY_CONFIG.shortName || "Alzheimer-LEV Trial"}
        </div>

        <h1 className="text-[28px] md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight leading-[1.3]">
          {STUDY_CONFIG.title}
        </h1>
        <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          {STUDY_CONFIG.subtitle}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-stretch">
        
        {/* Register Patient Card */}
        <Card 
          selectable 
          onClick={() => navigate('/registration')}
          className="w-full max-w-[400px] border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col"
        >
          <CardContent className="flex flex-col items-center text-center px-8 py-10 flex-grow">
            
            <div className="w-20 h-20 rounded-full bg-[#fce4ec] flex items-center justify-center text-[#E91E63] mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            
            <h3 className="text-[24px] font-bold text-slate-900 mb-3 tracking-tight">Register Patient / Continue Filling Patient</h3>
            
            <p className="text-[#64748B] text-[15px] leading-relaxed mb-6 px-2 font-normal flex-grow">
              Initiate or Continue a patient registration, perform criteria checks, and calculate score for arm assignment.
            </p>
            
            <Button 
              className="w-full h-12 text-[16px] font-bold rounded-lg bg-[#E91E63] hover:bg-[#D81B60] text-white shadow-md active:scale-[0.98] transition-transform mt-auto" 
              onClick={(e) => { e.stopPropagation(); navigate('/registration'); }}
            >
              Continue
            </Button>
            
          </CardContent>
        </Card>

      </div>
    </div>
  );
}