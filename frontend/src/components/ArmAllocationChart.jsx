import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

const PADDING = { top: 30, right: 40, bottom: 56, left: 48 };
const CHART_H = 260;

function buildPath(points) {
  if (points.length === 0) return '';
  if (points.length === 1) {
    const { x, y } = points[0];
    return `M ${x} ${y}`;
  }
  // Smooth cubic bezier
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export function ArmAllocationChart({ liveData, intArmTotal, placArmTotal }) {
  const [visibleLines, setVisibleLines] = useState({ ArmA: true, ArmB: true });
  const [hoveredSite, setHoveredSite] = useState(null);
  const [selectedArm, setSelectedArm] = useState('Drug');

  const randomized = liveData.filter(r => r.status === 'Randomized');
  const hospitals = [...new Set(randomized.map(r => r.hospital))].sort();

  const intCounts  = hospitals.map(h => randomized.filter(r => r.hospital === h && (r.arm?.includes('Drug') || r.arm?.includes('Levetiracetam'))).length);
  const placCounts = hospitals.map(h => randomized.filter(r => r.hospital === h && r.arm?.includes('Placebo')).length);

  const maxVal = Math.max(...intCounts, ...placCounts, 1);
  const yTicks = Array.from({ length: maxVal + 1 }, (_, i) => i);

  const innerW = 800 - PADDING.left - PADDING.right;
  const innerH = CHART_H - PADDING.top - PADDING.bottom;

  const xPos = (i) => PADDING.left + (hospitals.length === 1 ? innerW / 2 : (i / (hospitals.length - 1)) * innerW);
  const yPos = (v) => PADDING.top + innerH - (v / maxVal) * innerH;

  const intPoints  = hospitals.map((_, i) => ({ x: xPos(i), y: yPos(intCounts[i])  }));
  const placPoints = hospitals.map((_, i) => ({ x: xPos(i), y: yPos(placCounts[i]) }));

  const intPath  = buildPath(intPoints);
  const placPath = buildPath(placPoints);

  const hovered = hoveredSite !== null ? hoveredSite : null;

  // Patient pills for clicked/hovered site
  const activeSiteIdx = hovered;
  const activeSite    = activeSiteIdx !== null ? hospitals[activeSiteIdx] : null;
  
  const isSelectedArmIntervention = selectedArm === 'Drug';
  const activePts = activeSite
    ? randomized.filter(r => r.hospital === activeSite && (isSelectedArmIntervention ? (r.arm?.includes('Drug') || r.arm?.includes('Levetiracetam')) : r.arm?.includes('Placebo')))
    : randomized.filter(r => (isSelectedArmIntervention ? (r.arm?.includes('Drug') || r.arm?.includes('Levetiracetam')) : r.arm?.includes('Placebo')));

  const toggleLine = (arm) => {
    setVisibleLines(prev => ({ ...prev, [arm]: !prev[arm] }));
  };

  return (
    <Card className="border-slate-200 shadow-sm mb-8 overflow-hidden text-left">
      <CardHeader className="bg-white border-b border-slate-100 py-4 px-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Arm Allocation — Site Trends & Distribution</CardTitle>
            <p className="text-sm text-slate-500 mt-0.5 font-normal">
              Left: patients per site (line) · Right: hospital breakdown per arm (stacked bar)
            </p>
          </div>

          {/* Legend / toggles */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => { toggleLine('ArmA'); setSelectedArm('Drug'); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                visibleLines.ArmA
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-white border-slate-300 text-slate-400'
              }`}
            >
              <span className="w-3 h-0.5 bg-current inline-block rounded-full"></span>
              Arm A ({intArmTotal})
            </button>
            <button
              onClick={() => { toggleLine('ArmB'); setSelectedArm('Placebo'); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                visibleLines.ArmB
                  ? 'bg-violet-500 border-violet-500 text-white'
                  : 'bg-white border-slate-300 text-slate-400'
              }`}
            >
              <span className="w-3 h-0.5 bg-current inline-block rounded-full"></span>
              Arm B ({placArmTotal})
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {randomized.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-12">No randomized patients yet.</p>
        ) : (
          <>
            {/* Charts side by side */}
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">

            {/* SVG Line Chart */}
            <div className="flex-[1.6] min-w-[340px] overflow-hidden px-2 pt-2 bg-white">
              <svg
                viewBox="0 0 800 260"
                width="100%"
                height="100%"
                className="block"
                onMouseLeave={() => setHoveredSite(null)}
              >
                {/* Y-axis grid lines & labels */}
                {yTicks.map(v => (
                  <g key={v}>
                    <line
                      x1={PADDING.left} y1={yPos(v)}
                      x2={800 - PADDING.right} y2={yPos(v)}
                      stroke={v === 0 ? '#cbd5e1' : '#f1f5f9'}
                      strokeWidth={v === 0 ? 1.5 : 1}
                    />
                    <text
                      x={PADDING.left - 8} y={yPos(v) + 4}
                      textAnchor="end"
                      fontSize={10}
                      fill="#94a3b8"
                      fontWeight="600"
                    >{v}</text>
                  </g>
                ))}

                {/* Placebo line */}
                {visibleLines.ArmB && (
                  <>
                    <path
                      d={placPath}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.85}
                    />
                    {/* Area fill */}
                    <path
                      d={placPath + ` L ${placPoints[placPoints.length-1].x} ${yPos(0)} L ${placPoints[0].x} ${yPos(0)} Z`}
                      fill="url(#placGrad)"
                      opacity={0.12}
                    />
                  </>
                )}

                {/* Intervention line */}
                {visibleLines.ArmA && (
                  <>
                    <path
                      d={intPath}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.9}
                    />
                    {/* Area fill */}
                    <path
                      d={intPath + ` L ${intPoints[intPoints.length-1].x} ${yPos(0)} L ${intPoints[0].x} ${yPos(0)} Z`}
                      fill="url(#intGrad)"
                      opacity={0.12}
                    />
                  </>
                )}

                {/* Gradient defs */}
                <defs>
                  <linearGradient id="intGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="1"/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="placGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="1"/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
                  </linearGradient>
                </defs>

                {/* Data points + hover zones */}
                {hospitals.map((hosp, i) => {
                  const isHov = hovered === i;
                  return (
                    <g
                      key={hosp}
                      onMouseEnter={() => setHoveredSite(i)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Hover vertical line */}
                      {isHov && (
                        <line
                          x1={xPos(i)} y1={PADDING.top}
                          x2={xPos(i)} y2={yPos(0)}
                          stroke="#e2e8f0" strokeWidth={1.5} strokeDasharray="4 3"
                        />
                      )}

                      {/* Intervention dot */}
                      {visibleLines.ArmA && (
                        <>
                          <circle cx={xPos(i)} cy={yPos(intCounts[i])} r={isHov ? 6 : 4}
                            fill="#fff" stroke="#3b82f6" strokeWidth={isHov ? 3 : 2}
                            style={{ transition: 'r 150ms' }}
                          />
                          {isHov && (
                            <text x={xPos(i)} y={yPos(intCounts[i]) - 10} textAnchor="middle"
                              fontSize={11} fontWeight="700" fill="#3b82f6">
                              {intCounts[i]}
                            </text>
                          )}
                        </>
                      )}

                      {/* Placebo dot */}
                      {visibleLines.ArmB && (
                        <>
                          <circle cx={xPos(i)} cy={yPos(placCounts[i])} r={isHov ? 6 : 4}
                            fill="#fff" stroke="#8b5cf6" strokeWidth={isHov ? 3 : 2}
                            style={{ transition: 'r 150ms' }}
                          />
                          {isHov && (
                            <text x={xPos(i)} y={yPos(placCounts[i]) - 10} textAnchor="middle"
                              fontSize={11} fontWeight="700" fill="#8b5cf6">
                              {placCounts[i]}
                            </text>
                          )}
                        </>
                      )}

                      {/* X-axis label */}
                      <text
                        x={xPos(i)} y={CHART_H - PADDING.bottom + 18}
                        textAnchor="middle" fontSize={11}
                        fontWeight={isHov ? '800' : '600'}
                        fill={isHov ? '#1e293b' : '#64748b'}
                      >
                        {hosp}
                      </text>

                      {/* Invisible hit area */}
                      <rect
                        x={xPos(i) - 30} y={PADDING.top}
                        width={60} height={innerH + 20}
                        fill="transparent"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Stacked Bar Chart — Hospital Distribution per Arm */}
            {(() => {
              const COLORS = ['#3b82f6','#ec4899','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4','#f97316'];
              const BAR_W = 80;
              const SB_W = 300;
              const SB_H = 260;
              const PAD = { top: 30, bottom: 56, left: 32, right: 32 };
              const innerH = SB_H - PAD.top - PAD.bottom;
              const intTotal = intCounts.reduce((a, b) => a + b, 0);
              const placTotal = placCounts.reduce((a, b) => a + b, 0);
              const maxTotal = Math.max(intTotal, placTotal, 1);
              const hospColors = Object.fromEntries(hospitals.map((h, i) => [h, COLORS[i % COLORS.length]]));

              const buildSegs = (counts) => {
                let cum = 0;
                return hospitals.map((h, i) => {
                  const count = counts[i];
                  const segH = (count / maxTotal) * innerH;
                  const seg = { h, count, cum, segH, color: hospColors[h] };
                  cum += segH;
                  return seg;
                });
              };

              const intSegs  = buildSegs(intCounts);
              const placSegs = buildSegs(placCounts);

              const gap = (SB_W - PAD.left - PAD.right - BAR_W * 2) / 3;
              const intBarX  = PAD.left + gap;
              const placBarX = PAD.left + gap * 2 + BAR_W;

              const yTks = maxTotal <= 2
                ? [0, maxTotal]
                : [0, Math.round(maxTotal / 2), maxTotal];
              const byPos = (cum) => PAD.top + innerH - cum;

              const renderBar = (segs, total, barX, label, labelColor) => (
                <g key={label}>
                  {/* Background track */}
                  <rect x={barX} y={PAD.top} width={BAR_W} height={innerH}
                    fill="#f8fafc" rx={6} stroke="#e2e8f0" strokeWidth={1}/>

                  {/* Hospital segments */}
                  {segs.map((seg, si) => seg.count > 0 && (
                    <g key={si}>
                      <rect
                        x={barX} y={byPos(seg.cum + seg.segH)}
                        width={BAR_W} height={seg.segH}
                        fill={seg.color} opacity={0.9}
                        rx={si === 0 ? 5 : 0}
                      />
                      {seg.segH >= 22 && (
                        <>
                          <text x={barX + BAR_W / 2}
                            y={byPos(seg.cum + seg.segH) + seg.segH / 2 - 4}
                            textAnchor="middle" fontSize={9} fontWeight="700" fill="white">{seg.h}</text>
                          <text x={barX + BAR_W / 2}
                            y={byPos(seg.cum + seg.segH) + seg.segH / 2 + 7}
                            textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.8)">{seg.count}</text>
                        </>
                      )}
                    </g>
                  ))}

                  {/* Total above bar */}
                  <text x={barX + BAR_W / 2} y={segs.length > 0 ? byPos(segs.reduce((a, b) => a + b.segH, 0)) - 10 : byPos(0) - 10}
                    textAnchor="middle" fontSize={15} fontWeight="900" fill={labelColor}>{total}</text>

                  {/* Arm label below */}
                  <text x={barX + BAR_W / 2} y={SB_H - PAD.bottom + 18}
                    textAnchor="middle" fontSize={10} fontWeight="700" fill="#334155">{label}</text>
                </g>
              );

              return (
                <div className="flex-1 flex-shrink-0 min-w-[280px] bg-slate-50 border-l border-slate-100 flex flex-col">
                  <div className="px-4 pt-4 pb-1">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Distribution per Arm</h4>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-2">
                    <svg viewBox={`0 0 ${SB_W} ${SB_H}`} width="100%" height="auto" className="block">
                      {/* Y grid lines */}
                      {yTks.map(v => {
                        const y = byPos((v / maxTotal) * innerH);
                        return (
                          <g key={v}>
                            <line x1={PAD.left - 4} y1={y} x2={SB_W - PAD.right} y2={y}
                              stroke={v === 0 ? '#cbd5e1' : '#e2e8f0'} strokeWidth={1}/>
                            <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize={8} fill="#94a3b8" fontWeight="600">{v}</text>
                          </g>
                        );
                      })}
                      {renderBar(intSegs,  intTotal,  intBarX,  'Arm A', '#3b82f6')}
                      {renderBar(placSegs, placTotal, placBarX, 'Arm B',      '#8b5cf6')}
                    </svg>
                  </div>
                  {/* Legend */}
                  {hospitals.length > 0 && (
                    <div className="px-4 pb-4 flex flex-wrap gap-x-3 gap-y-1">
                      {hospitals.map((h, i) => (
                        <span key={h} className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                          <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}/>
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            </div>{/* end flex row */}

            {/* Patient pills section */}
            <div className="px-6 pb-6 pt-2 border-t border-slate-100 mt-2 text-left">
              <div className="flex items-center gap-2 mb-3">
                {/* Arm toggle for pills */}
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
                  <button
                    onClick={() => setSelectedArm('Drug')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      selectedArm === 'Drug'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >Arm A</button>
                  <button
                    onClick={() => setSelectedArm('Placebo')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      selectedArm === 'Placebo'
                        ? 'bg-violet-500 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >Arm B</button>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {activeSite ? `Site: ${activeSite}` : 'All sites'} —{' '}
                  <span className={`font-bold ${selectedArm === 'Drug' ? 'text-blue-600' : 'text-violet-600'}`}>
                    {activePts.length} patient{activePts.length !== 1 ? 's' : ''}
                  </span>
                </span>
                {activeSite && (
                  <button onClick={() => setHoveredSite(null)}
                    className="ml-auto text-[11px] text-slate-400 hover:text-slate-600 underline">
                    Show all
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {activePts.length === 0
                  ? <span className="text-slate-400 text-xs italic">No patients</span>
                  : activePts.map(p => (
                      <span key={p.id}
                        className={`inline-flex items-center gap-1 border text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          selectedArm === 'Drug'
                            ? 'bg-blue-50 border-blue-200 text-blue-800'
                            : 'bg-violet-50 border-violet-200 text-violet-800'
                        }`}>
                        {p.id}
                        {p.score != null && (
                          <span className={selectedArm === 'Drug' ? 'text-blue-400' : 'text-violet-400'}>
                            · {p.score} pt{p.score !== 1 ? 's' : ''}
                          </span>
                        )}
                      </span>
                    ))
                }
              </div>
              <p className="text-[10px] text-slate-400 mt-3">Pill: System ID · Risk Score — hover chart to filter by site</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
