import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

export function ArmAllocationChart({ liveData, armACount, armBCount }) {
  const randomized = liveData.filter((session) => session.status === 'Randomized');
  const sites = [...new Set(randomized.map((session) => session.hospital))];

  return (
    <Card className="border-slate-200 shadow-sm mb-8">
      <CardHeader><CardTitle className="text-lg">Allocation by Hospital</CardTitle></CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-4"><p className="text-xs font-bold text-blue-600 uppercase">Code A</p><p className="text-3xl font-black text-blue-800">{armACount}</p></div>
          <div className="rounded-lg bg-violet-50 border border-violet-100 p-4"><p className="text-xs font-bold text-violet-600 uppercase">Code B</p><p className="text-3xl font-black text-violet-800">{armBCount}</p></div>
        </div>
        {sites.length > 0 && <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-slate-500 border-b"><th className="pb-2">Hospital</th><th className="pb-2">A</th><th className="pb-2">B</th></tr></thead><tbody>{sites.map((site) => <tr key={site} className="border-b border-slate-100"><td className="py-2 font-semibold text-slate-700">{site}</td><td className="py-2">{randomized.filter((session) => session.hospital === site && session.allocationCode === 'A').length}</td><td className="py-2">{randomized.filter((session) => session.hospital === site && session.allocationCode === 'B').length}</td></tr>)}</tbody></table></div>}
      </CardContent>
    </Card>
  );
}
