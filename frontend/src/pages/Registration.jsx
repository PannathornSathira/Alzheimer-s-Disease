import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "../context/PatientContext";
import { startSession } from "../api/sessionApi";
import { LoadingOverlay } from "../components/ui/LoadingOverlay";
import { STUDY_CONFIG } from "../config/studyConfig";

export function Registration() {
  const navigate = useNavigate();
  const { setPatientData } = usePatient();
  const [hn, setHn] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const [showResumePopup, setShowResumePopup] = useState(false);
  const [duplicateHN, setDuplicateHN] = useState("");
  const [resumeSessionData, setResumeSessionData] = useState(null);

  const handleGenerate = async () => {
    if (!hn.trim() || !selectedHospital) return;

    // Convert patient HN by removing slashes, dashes, spaces, and leading zeros
    const cleanHn = hn
      .trim()
      .replace(/[\/\-\s]/g, "")
      .replace(/^0+/, "");
    const hospitalObj = STUDY_CONFIG.hospitals.find(
      (h) => h.prefix === selectedHospital,
    );

    setIsLoading(true);
    try {
      const response = await startSession({
        hospitalPrefix: hospitalObj.prefix,
        hospitalName: hospitalObj.name,
        uniqueId: cleanHn,
      });

      if (response.isExisting) {
        const s = response.session;
        const mappedData = {
          dbSessionId: s.id,
          systemId: s.trialSystemId,
          hn: cleanHn,
          hospital: hospitalObj.name,
          inclusionPass: s.inclusionPassed,
          exclusionPass: s.exclusionPassed,
          totalScore: s.totalScore,
          assignedArm: s.allocationResult,
          cognitiveSeverityScore: s.cognitiveSeverityScore,
          vascularRiskScore: s.vascularRiskScore,
          behavioralSymptomsScore: s.behavioralSymptomsScore,
          functionalImpairmentScore: s.functionalImpairmentScore,
          familyHistoryScore: s.familyHistoryScore,
        };

        const isComplete =
          s.currentStatus === "RANDOMIZED" ||
          s.currentStatus === "DISQUALIFIED";
        if (isComplete) {
          setDuplicateHN(cleanHn.toUpperCase());
          setResumeSessionData(mappedData);
          setShowDuplicatePopup(true);
        } else {
          setDuplicateHN(cleanHn.toUpperCase());
          setResumeSessionData({
            ...mappedData,
            currentStatus: s.currentStatus,
          });
          setShowResumePopup(true);
        }
        return;
      }

      setPatientData((prev) => ({
        ...prev,
        dbSessionId: response.session.id,
        systemId: response.session.trialSystemId,
        hn: cleanHn,
        hospital: hospitalObj.name,
        inclusionPass: false,
        exclusionPass: false,
        paused: false,
        totalScore: null,
        assignedArm: null,
        cognitiveSeverityScore: null,
        vascularRiskScore: null,
        behavioralSymptomsScore: null,
        functionalImpairmentScore: null,
        familyHistoryScore: null,
      }));

      navigate("/inclusion");
    } catch (error) {
      console.error("Failed to start session:", error);
      alert("Failed to connect to backend: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedDuplicate = () => {
    setPatientData((prev) => ({ ...prev, ...resumeSessionData }));
    navigate("/result");
  };

  const handleResume = () => {
    setPatientData((prev) => ({ ...prev, ...resumeSessionData }));
    const status = resumeSessionData.currentStatus;
    if (status === "REGISTERED") navigate("/inclusion");
    else if (status === "INCLUSION_PASSED") navigate("/exclusion");
    else if (status === "EXCLUSION_PASSED" || status === "PAUSED")
      navigate("/pause");
    else navigate("/");
  };

  const handleEditCriteria = () => {
    setPatientData((prev) => ({ ...prev, ...resumeSessionData }));
    navigate("/inclusion");
  };

  const isFormValid = hn.trim() && selectedHospital;

  return (
    <div className="max-w-[700px] mx-auto mt-8 mb-16 px-4">
      <LoadingOverlay isLoading={isLoading} message="Generating System ID..." />

      {/* Duplicate Alert Popup Modal */}
      {showDuplicatePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100">
            <div className="bg-amber-50 p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-100/80 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <svg
                  className="w-8 h-8 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3.L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-amber-800 mb-2 tracking-tight">
                Patient Already Registered
              </h3>
              <p className="text-[15px] text-amber-900/80 leading-relaxed font-medium">
                The Hospital Number{" "}
                <span className="font-bold text-amber-950 px-1">
                  {duplicateHN}
                </span>{" "}
                has already been evaluated in this trial.
              </p>
            </div>

            <div className="p-6 bg-white">
              <p className="text-slate-500 font-medium mb-8 text-center text-sm">
                A new System ID cannot be generated. You will be redirected to
                view the existing trial record for this patient.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDuplicatePopup(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors w-1/2 select-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedDuplicate}
                  className="px-6 py-3 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md hover:shadow-lg transition-all active:scale-[0.98] w-1/2 select-none"
                >
                  View Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Incomplete Session Popup */}
      {showResumePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-100">
            <div className="bg-blue-50 p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100/80 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-2 tracking-tight">
                Incomplete Registration Found
              </h3>
              <p className="text-[15px] text-blue-900/80 leading-relaxed font-medium">
                Patient{" "}
                <span className="font-bold text-blue-950 px-1">
                  {duplicateHN}
                </span>{" "}
                has an active session.
              </p>
            </div>

            <div className="p-6 bg-white">
              <p className="text-slate-500 font-medium mb-8 text-center text-sm">
                Would you like to resume this registration where you left off?
              </p>

              {/* Conditional buttons for PAUSED or EXCLUSION_PASSED status */}
              {resumeSessionData?.currentStatus === "PAUSED" ||
              resumeSessionData?.currentStatus === "EXCLUSION_PASSED" ? (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setShowResumePopup(false)}
                      className="px-4 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors w-1/3 select-none text-sm"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleResume}
                      className="px-4 py-3 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg transition-all active:scale-[0.98] w-1/3 select-none text-sm"
                    >
                      Resume
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setShowResumePopup(false)}
                    className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors w-1/2 select-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResume}
                    className="px-6 py-3 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg transition-all active:scale-[0.98] w-1/2 select-none"
                  >
                    Resume
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header outside the Card */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#0f172a] tracking-tight mb-2">
          Patient Registration
        </h1>
        <p className="text-[16px] text-[#64748B]">
          Enter patient information to generate a unique System ID for this
          study
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 sm:p-10 mb-6">
        {/* Patient ID Section */}
        <div className="mb-10">
          <label className="flex items-center text-[15px] font-bold text-slate-800 mb-3">
            <span className="text-[#E91E63] font-black mr-2 text-[16px]">
              #
            </span>
            Patient Unique ID
          </label>
          <input
            className="w-full px-5 py-3.5 bg-[#f8fafc] border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E91E63]/30 transition-all text-slate-800 placeholder-slate-400 text-[15px]"
            value={hn}
            onChange={(e) => setHn(e.target.value)}
            placeholder="e.g. HN12345"
          />
          <p className="mt-2 text-[13px] text-slate-500 font-medium">
            Enter the hospital number assigned to this patient.
          </p>
        </div>

        {/* Hospital Selection Section */}
        <div>
          <label className="flex items-center text-[15px] font-bold text-slate-800 mb-4">
            <svg
              className="w-[18px] h-[18px] text-[#E91E63] mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Hospital Selection
          </label>

          <div className="flex flex-col space-y-3 max-h-[340px] overflow-y-auto pr-2">
            {STUDY_CONFIG.hospitals.map((hospital) => {
              const isSelected = selectedHospital === hospital.prefix;
              return (
                <div
                  key={hospital.prefix}
                  onClick={() => setSelectedHospital(hospital.prefix)}
                  className={`flex items-center px-5 py-4 rounded-xl border-[1.5px] cursor-pointer transition-all duration-200 select-none
                    ${
                      isSelected
                        ? "border-[#E91E63] shadow-sm bg-white"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                >
                  <div className="flex-shrink-0 mr-4 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center bg-[#f8fafc]">
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0f172a]" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3
                      className={`font-semibold text-[15px] leading-snug text-[#0f172a]`}
                    >
                      {hospital.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="flex items-center justify-between mt-2">
        <button
          onClick={() => navigate("/")}
          className="text-[#64748B] hover:text-slate-900 font-bold text-[16px] px-2 py-2 transition-colors flex items-center"
        >
          <span className="mr-2 opacity-80 mt-[2px]">←</span> Back to Home
        </button>
        <button
          onClick={handleGenerate}
          disabled={!isFormValid}
          className={`px-8 py-3.5 text-[15px] font-bold rounded-lg transition-all ${
            isFormValid
              ? "bg-[#E91E63] text-white shadow-md active:scale-[0.98]"
              : "bg-[#fbcfe8] text-white opacity-80 cursor-not-allowed"
          }`}
        >
          Generate System ID Or Continue
        </button>
      </div>
    </div>
  );
}
