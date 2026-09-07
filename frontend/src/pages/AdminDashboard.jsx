import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { fetchDashboardStats } from '../api/sessionApi';
import { ArmAllocationChart } from '../components/ArmAllocationChart';

const statusStyle = {
  Randomized: 'bg-emerald-100 text-emerald-800',
  'Failed Inclusion': 'bg-rose-100 text-rose-800',
  'Failed Exclusion': 'bg-rose-100 text-rose-800',
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const [liveData, setLiveData] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchDashboardStats();
        setLiveData(result.data);
        setStats(result.stats);
      } catch (error) {
        console.error(error);
      }
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const exportCsv = () => {
    const rows = liveData.filter((session) => session.status === 'Randomized');
    const csv = [['System ID', 'Hospital', 'Patient HN', 'EEG Group', 'Assigned Code', 'Time'], ...rows.map((session) => [session.id, session.hospital, session.hn, session.eegGroup === 'NO_SEA' ? 'No SEA' : 'SEA', session.allocationCode, session.timestamps.rand])]
      .map((row) => row.map((value) => `"${value ?? ''}"`).join(','))
      .join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' }));
    link.download = 'Alzheimer_Trial_Randomization_Export.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const filtered = liveData.filter((session) => [session.id, session.hospital, session.hn].some((value) => value?.toLowerCase().includes(searchTerm.toLowerCase())));
  if (!stats) return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-600 font-semibold">Loading trial dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 pb-20">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div><h1 className="text-3xl font-bold text-slate-800">Trial Operations Dashboard</h1><p className="text-slate-500 mt-1">Live EEG-group randomization monitoring</p></div>
          <div className="flex gap-2"><Button variant="outline" onClick={exportCsv}>Export CSV</Button><Button variant="outline" onClick={() => navigate('/')}>Exit to Portal</Button></div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[['Total Randomized', stats.totalRand], ['Code A', stats.armACount], ['Code B', stats.armBCount], ['SEA', stats.seaCount], ['No SEA', stats.noSeaCount]].map(([label, value]) => <Card key={label} className="border-slate-200 shadow-sm"><CardContent className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="text-3xl font-black text-slate-800 mt-2">{value}</p></CardContent></Card>)}
        </div>
        <ArmAllocationChart liveData={liveData} armACount={stats.armACount} armBCount={stats.armBCount} />
        <Card className="border-slate-200 shadow-sm mb-8">
          <CardHeader><CardTitle className="text-lg">EEG Group Distribution</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 p-6"><div className="rounded-lg bg-slate-50 p-4"><p className="text-slate-500 text-sm">SEA</p><p className="text-3xl font-bold">{stats.seaCount}</p></div><div className="rounded-lg bg-slate-50 p-4"><p className="text-slate-500 text-sm">No SEA</p><p className="text-3xl font-bold">{stats.noSeaCount}</p></div></CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-3"><CardTitle className="text-lg">Session Records</CardTitle><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search ID, hospital, or HN" className="border border-slate-300 rounded-lg px-3 py-2 text-sm" /></CardHeader>
          <CardContent className="p-0 overflow-x-auto"><table className="w-full min-w-[850px] text-sm text-left"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">System ID</th><th className="p-4">Hospital</th><th className="p-4">HN</th><th className="p-4">Status</th><th className="p-4">EEG Group</th><th className="p-4">Code</th><th className="p-4">Randomized</th></tr></thead><tbody>{filtered.map((session) => <tr key={session.id} className="border-t border-slate-100"><td className="p-4 font-semibold">{session.id}</td><td className="p-4">{session.hospital}</td><td className="p-4">{session.hn}</td><td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyle[session.status] || 'bg-slate-100 text-slate-700'}`}>{session.status}</span></td><td className="p-4">{session.eegGroup === 'NO_SEA' ? 'No SEA' : session.eegGroup || '-'}</td><td className="p-4 font-bold">{session.allocationCode || '-'}</td><td className="p-4">{session.timestamps.rand}</td></tr>)}</tbody></table></CardContent>
        </Card>
      </div>
    </div>
  );
}
