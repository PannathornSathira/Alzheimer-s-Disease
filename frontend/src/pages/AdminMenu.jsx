import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function AdminMenu() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center p-6">
      
      {/* Header */}
      <div className="w-full max-w-[1000px] mt-10 mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage clinical trial operations and system configurations</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin')} 
          className="bg-white text-slate-600 border-slate-300 shadow-sm"
        >
          Logout
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-[1000px] justify-center items-stretch animate-fade-in-up">
        
        {/* Menu 1: Analytics Dashboard */}
        <Card 
          selectable 
          onClick={() => navigate('/admin-dashboard')}
          className="flex-1 border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col group relative"
        >
          {/* Top colored bar indicator */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
          
          <CardContent className="flex flex-col items-center text-center px-8 py-10 flex-grow">
            <div className="w-20 h-20 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors flex items-center justify-center text-blue-600 mb-6 shadow-sm">
              <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            
            <h3 className="text-[22px] font-bold text-slate-800 mb-3 tracking-tight">Operations Dashboard</h3>
            <p className="text-[#64748B] text-[15px] leading-relaxed mb-8 font-medium">
              Monitor live patient matching, analyze inclusion/exclusion drop-offs, and track randomization statistics across all sites.
            </p>
            
            <Button 
              className="w-full mt-auto h-12 text-[15px] font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-[0.98] transition-all" 
              onClick={(e) => { e.stopPropagation(); navigate('/admin-dashboard'); }}
            >
              Enter Dashboard
            </Button>
          </CardContent>
        </Card>

        {/* Menu 2: User & System Settings */}
        <Card 
          selectable 
          onClick={() => alert("System Settings module is currently in development.")}
          className="flex-1 border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col group relative"
        >
          {/* Top colored bar indicator */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-700"></div>
          
          <CardContent className="flex flex-col items-center text-center px-8 py-10 flex-grow">
            <div className="w-20 h-20 rounded-full bg-slate-50 group-hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-700 mb-6 shadow-sm">
              <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <h3 className="text-[22px] font-bold text-slate-800 mb-3 tracking-tight">System Settings</h3>
            <p className="text-[#64748B] text-[15px] leading-relaxed mb-8 font-medium">
              Manage hospital site prefixes, configure clinical user access roles, and export complete trial data logs.
            </p>
            
            <Button 
              className="w-full mt-auto h-12 text-[15px] font-bold rounded-lg bg-slate-800 hover:bg-slate-900 text-white shadow-md active:scale-[0.98] transition-all" 
              onClick={(e) => { e.stopPropagation(); alert("System Settings module is currently in development."); }}
            >
              Config Settings
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
