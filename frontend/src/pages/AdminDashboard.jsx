import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { fetchDashboardStats } from "../api/sessionApi";
import { ArmAllocationChart } from "../components/ArmAllocationChart";
import { STUDY_CONFIG } from "../config/studyConfig";

// Badge component for styling status labels
const Badge = ({ variant, className = "", children }) => {
  let vClass = "bg-slate-100 text-slate-800 border-slate-200";
  if (variant === "success")
    vClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (variant === "danger")
    vClass = "bg-rose-100 text-rose-800 border-rose-200";
  if (variant === "warning")
    vClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (variant === "info") vClass = "bg-blue-100 text-blue-800 border-blue-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${vClass} ${className}`}
    >
      {children}
    </span>
  );
};

const formatArm = (armName) => {
  if (!armName) return "N/A";
  if (armName.includes("Drug") || armName.includes("Levetiracetam")) return "A";
  if (armName.includes("Placebo")) return "B";
  return armName;
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const adminRole = sessionStorage.getItem("adminRole") || "superadmin";
  const [searchTerm, setSearchTerm] = useState("");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printSections, setPrintSections] = useState({
    "pdf-metrics": true,
    "pdf-chart": true,
    "pdf-select": true,
    "pdf-hospitals": true,
    "pdf-audit": true,
  });

  const SECTION_LABELS = {
    "pdf-metrics": "Summary Metrics (KPIs)",
    "pdf-chart": "Arm Allocation Chart",
    "pdf-select": "Risk Score Analytics",
    "pdf-hospitals": "Hospital Reference",
    "pdf-audit": "Audit Trail & Timestamps",
  };

  const handleExportCSV = () => {
    const randomized = liveData.filter((d) => d.status === "Randomized");
    randomized.sort((a, b) => (a.arm || "").localeCompare(b.arm || ""));

    const isBlinded = adminRole === "blindedadmin";
    const headers = [
      "System ID",
      "Hospital",
      "Patient HN",
      isBlinded ? "Status" : "Assigned Arm",
      "Risk Score",
      "Time",
    ];
    const rows = randomized.map((r) => [
      r.id,
      r.hospital,
      r.hn,
      isBlinded ? "Randomized" : formatArm(r.arm),
      r.score || "N/A",
      r.timestamps.rand,
    ]);

    const csvContent =
      "\uFEFF" +
      [
        headers.join(","),
        ...rows.map((e) => e.map((val) => `"${val}"`).join(",")),
      ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Alzheimer_Trial_Arms_Export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    setShowPrintModal(false);
    // Temporarily hide unchecked sections
    Object.keys(printSections).forEach((id) => {
      if (!printSections[id])
        document.getElementById(id)?.classList.add("no-print");
    });
    setTimeout(() => {
      window.print();
      // Restore after print dialog closes
      setTimeout(() => {
        Object.keys(printSections).forEach((id) => {
          document.getElementById(id)?.classList.remove("no-print");
        });
      }, 500);
    }, 80);
  };

  const [liveData, setLiveData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const result = await fetchDashboardStats();
        setLiveData(result.data);
        setStats(result.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // Auto-refresh every 10 seconds
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status) => {
    if (status === "Randomized")
      return <Badge variant="success">Randomized ✅</Badge>;
    if (status === "Failed Inclusion")
      return <Badge variant="danger">❌ Failed Inclusion</Badge>;
    if (status === "Failed Exclusion")
      return <Badge variant="danger">❌ Failed Exclusion</Badge>;
    if (status === "Passed Inclusion")
      return <Badge variant="info">⏳ Pending Exc.</Badge>;
    if (status === "Passed Exclusion")
      return <Badge variant="info">⏳ Pending Score</Badge>;
    if (status === "Paused (Awaiting Return)")
      return <Badge variant="warning">⏸️ Paused (Awaiting Score)</Badge>;
    return <Badge variant="warning">⏳ Pending Inc.</Badge>;
  };

  const filteredData = liveData.filter(
    (row) =>
      row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.hn && row.hn.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-semibold text-lg">
          Loading Live Analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 pb-20 font-sans">
      <div className="max-w-[1400px] mx-auto">
        {/* PDF Export Section Selector Modal */}
        {showPrintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm no-print">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="text-left">
                  <h2 className="text-base font-bold text-slate-800">
                    Export PDF
                  </h2>
                  <p className="text-xs text-slate-500">
                    Choose sections to include
                  </p>
                </div>
              </div>
              <div className="px-6 py-5 space-y-3">
                {Object.keys(printSections).map((id) => (
                  <label
                    key={id}
                    className="flex items-center gap-3 cursor-pointer group select-none"
                  >
                    <div
                      onClick={() =>
                        setPrintSections((prev) => ({
                          ...prev,
                          [id]: !prev[id],
                        }))
                      }
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        printSections[id]
                          ? "bg-[#E91E63] border-[#E91E63]"
                          : "bg-white border-slate-300 group-hover:border-slate-400"
                      }`}
                    >
                      {printSections[id] && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      onClick={() =>
                        setPrintSections((prev) => ({
                          ...prev,
                          [id]: !prev[id],
                        }))
                      }
                      className={`text-sm font-semibold transition-colors ${
                        printSections[id] ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {SECTION_LABELS[id]}
                    </span>
                  </label>
                ))}
              </div>
              <div className="px-6 pb-6 flex gap-2">
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={!Object.values(printSections).some(Boolean)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white bg-[#E91E63] hover:bg-[#D81B60] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        )}

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print">
          <div className="text-left">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-800">
                Trial Operations Dashboard
              </h1>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${adminRole === "superadmin" ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}
              >
                {adminRole === "superadmin" ? "Super Admin" : "Blinded Admin"}
              </span>
            </div>
            <p className="text-slate-500 mt-1 flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#10b981] mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              Live Monitoring & Analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-300 bg-white text-emerald-700 text-sm font-semibold hover:bg-emerald-50 hover:border-emerald-400 shadow-sm transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Excel
            </button>
            <button
              onClick={() => setShowPrintModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 shadow-sm transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export PDF
            </button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="bg-white border-slate-300"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Exit to Portal
            </Button>
          </div>
        </header>

        {/* Summary Metrics (KPIs) */}
        <div
          id="pdf-metrics"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-2"
        >
          {[
            {
              label: "Total Randomized",
              value: stats.totalRand,
              c: "text-[#E91E63]",
              bg: "bg-[#fce4ec]",
            },
            {
              label: "Arm A",
              value: stats.drugArm,
              c: "text-[#0f172a]",
              bg: "bg-slate-100",
            },
            {
              label: "Arm B",
              value: stats.placeboArm,
              c: "text-[#0f172a]",
              bg: "bg-slate-100",
            },
            {
              label: "Paused Cases",
              value: stats.paused,
              c: "text-amber-600",
              bg: "bg-amber-50",
            },
          ].map((metric, i) => (
            <Card key={i} className="border-slate-200 shadow-sm text-left">
              <CardContent className="p-6">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 truncate" title={metric.label}>
                  {metric.label}
                </p>
                <div className="flex items-center">
                  <p className={`text-4xl font-black ${metric.c}`}>
                    {metric.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div id="pdf-chart">
          <ArmAllocationChart
            liveData={liveData}
            intArmTotal={stats.drugArm}
            placArmTotal={stats.placeboArm}
          />
        </div>

        <div id="pdf-select" className="grid grid-cols-1 gap-6 mb-8 text-left">
          {/* Risk Score Analytics */}
          <Card className="border-slate-200 shadow-sm flex flex-col">
            <CardHeader className="bg-white border-b border-slate-100 py-4">
              <CardTitle className="text-lg">Risk Score Analytics</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-grow grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Frequency Chart */}
              <div>
                <h4 className="text-xs font-bold text-[#64748B] mb-4 uppercase tracking-wider">
                  Breakdown of Scores (4-9)
                </h4>
                <div className="space-y-3">
                  {[4, 5, 6, 7, 8, 9].map((score) => {
                    const count = stats.scoreFreq[score] || 0;
                    const pct = stats.totalRand
                      ? (count / stats.totalRand) * 100
                      : 0;
                    return (
                      <div key={score} className="flex items-center text-sm">
                        <div className="w-14 font-bold text-slate-600">
                          Score {score}
                        </div>
                        <div className="flex-grow mx-3 h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${score > 5 ? "bg-amber-400" : "bg-[#E91E63]"}`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <div className="w-8 text-right font-medium text-slate-500">
                          {count}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Component breakdown */}
              <div>
                <h4 className="text-xs font-bold text-[#64748B] mb-4 uppercase tracking-wider">
                  Component Prevalence (%)
                </h4>
                <div className="space-y-4">
                  {[
                    { key: "cognitiveSeverity", label: "Cognitive Severity (MMSE)" },
                    { key: "vascularRisk", label: "Vascular Risk Factors" },
                    { key: "behavioralSymptoms", label: "Behavioral/Psychiatric Symptoms" },
                    { key: "functionalImpairment", label: "Functional Impairment (ADL)" },
                    { key: "familyHistory", label: "Family History of Dementia" },
                  ].map((comp) => {
                    const count = stats.compStats[comp.key] || 0;
                    const pct = stats.totalRand
                      ? Math.round((count / stats.totalRand) * 100)
                      : 0;
                    return (
                      <div key={comp.key} className="flex items-center text-sm">
                        <div
                          className="w-[180px] font-medium text-slate-600 truncate pr-2"
                          title={comp.label}
                        >
                          {comp.label}
                        </div>
                        <div className="flex-grow mx-2 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-400"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <div className="w-10 text-right font-bold text-slate-700">
                          {pct}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hospital Reference */}
        <div id="pdf-hospitals" className="mb-8 text-left">
          <Card className="border-slate-200 shadow-sm flex flex-col">
            <CardHeader className="bg-white border-b border-slate-100 py-4">
              <CardTitle className="text-lg">
                Hospital Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {STUDY_CONFIG.hospitals.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-bold text-[#E91E63] bg-[#fce4ec] px-2 py-1 rounded text-xs tracking-wider shrink-0">
                      {h.prefix}
                    </span>
                    <span className="text-sm font-medium text-slate-700 leading-tight">
                      {h.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Trail Table */}
        <div id="pdf-audit" className="text-left">
          <Card className="border-slate-200 shadow-sm overflow-hidden text-sm">
            <CardHeader className="bg-white border-b border-slate-200 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-lg flex flex-col">
                Audit Trail & Timestamp Tracking
                <span className="text-sm font-normal text-slate-500 mt-1">
                  Chronological record of all active and historic sessions
                </span>
              </CardTitle>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search System ID or Site..."
                  className="pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-[#E91E63] focus:border-[#E91E63] w-full sm:w-72 outline-none transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1300px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                    <th className="py-2.5 px-5 whitespace-nowrap">
                      System ID & Site
                    </th>
                    <th className="py-2.5 px-5 whitespace-nowrap">
                      Patient HN
                    </th>
                    <th className="py-2.5 px-5 whitespace-nowrap">
                      Status / Score
                    </th>
                    <th className="py-2.5 px-5 whitespace-nowrap text-[#64748B]">
                      Time: Started
                    </th>
                    <th className="py-2.5 px-5 whitespace-nowrap text-[#64748B]">
                      Time: Inc Pass
                    </th>
                    <th className="py-2.5 px-5 whitespace-nowrap text-[#64748B]">
                      Time: Exc Pass
                    </th>
                    <th className="py-2.5 px-5 whitespace-nowrap text-[#64748B]">
                      Time: Paused
                    </th>
                    <th className="py-2.5 px-5 whitespace-nowrap text-[#64748B]">
                      Time: Resumed
                    </th>
                    <th className="py-2.5 px-5 whitespace-nowrap text-[#64748B]">
                      Time: Randomized
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {filteredData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-2.5 px-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-xs bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                            {row.id}
                          </span>
                          <span className="text-slate-500 text-[11px] font-semibold mt-0.5 truncate max-w-[140px]" title={row.hospital}>
                            {row.hospital}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-5">
                        <span className="font-semibold text-slate-700 text-sm">
                          {row.hn}
                        </span>
                      </td>
                      <td className="py-2.5 px-5">
                        <div className="flex flex-col items-start gap-0.5">
                          {getStatusBadge(row.status)}
                          {row.arm && (
                            <div className="text-[11px] font-semibold text-slate-700 bg-slate-100 py-0.5 px-2 rounded whitespace-nowrap inline-flex items-center gap-1">
                              {adminRole !== "blindedadmin" && (
                                <>
                                  <span>Arm {formatArm(row.arm)}</span>
                                  <span className="opacity-30">|</span>
                                </>
                              )}
                              <span>
                                Score:{" "}
                                <span className="text-[#E91E63] font-black">
                                  {row.score}
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-5 whitespace-nowrap font-mono text-[12px]">
                        {row.timestamps.start}
                      </td>
                      <td className="py-2.5 px-5 whitespace-nowrap font-mono text-[12px] text-slate-400">
                        {row.timestamps.inc}
                      </td>
                      <td className="py-2.5 px-5 whitespace-nowrap font-mono text-[12px] text-slate-400">
                        {row.timestamps.exc}
                      </td>
                      <td className="py-2.5 px-5 whitespace-nowrap font-mono text-[12px] text-slate-400">
                        {row.timestamps.pause}
                      </td>
                      <td className="py-2.5 px-5 whitespace-nowrap font-mono text-[12px] text-slate-400">
                        {row.timestamps.resume}
                      </td>
                      <td className="py-2.5 px-5 whitespace-nowrap font-mono text-[12px] font-semibold text-slate-600">
                        {row.timestamps.rand}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredData.length === 0 && (
                <div className="text-center py-12 text-slate-500 bg-slate-50 font-medium">
                  No matching records found in audit trail.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
