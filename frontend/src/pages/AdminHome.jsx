import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// -----------------------------------------------------
// Configure Admin Accounts Here
// -----------------------------------------------------
const SUPER_ADMIN_USER = 'superadmin';
const SUPER_ADMIN_PASS = 'superadmin123';

const BLINDED_ADMIN_USER = 'admin';
const BLINDED_ADMIN_PASS = 'admin123';
// -----------------------------------------------------

export function AdminHome() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = () => {
    // Simple authentication using configured constants.
    // You can hook this up to an API endpoint later if needed!
    if (username.toLowerCase() === SUPER_ADMIN_USER.toLowerCase() && password === SUPER_ADMIN_PASS) {
      sessionStorage.setItem('adminRole', 'superadmin');
      setError(null);
      navigate('/admin-dashboard');
    } else if (username.toLowerCase() === BLINDED_ADMIN_USER.toLowerCase() && password === BLINDED_ADMIN_PASS) {
      sessionStorage.setItem('adminRole', 'blindedadmin');
      setError(null);
      navigate('/admin-dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Super Admin Portal</h1>
          <p className="text-slate-500">Please enter your credentials to access the PI Dashboard.</p>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-8">
            <div className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg text-center">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                <input 
                  type="text" 
                  autoFocus
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all text-slate-800"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all text-slate-800"
                  placeholder="••••••••"
                />
              </div>
              
              <Button 
                className="w-full h-12 text-[16px] font-bold rounded-lg bg-slate-800 hover:bg-slate-900 text-white shadow-md transition-transform" 
                onClick={handleLogin}
              >
                Access Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-8">
          <button 
            onClick={() => navigate('/')}
            className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
          >
            ← Back to Patient Portal
          </button>
        </div>
      </div>
    </div>
  );
}
