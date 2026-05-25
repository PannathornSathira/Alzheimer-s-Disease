import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { usePatient } from "../context/PatientContext";
import { pauseSession } from "../api/sessionApi";
import { LoadingOverlay } from "../components/ui/LoadingOverlay";

export function PausePage() {
  const navigate = useNavigate();
  const { patientData, setPatientData } = usePatient();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const triggerPause = async () => {
      if (patientData.dbSessionId) {
        setIsLoading(true);
        try {
          await pauseSession(patientData.dbSessionId);
          setPatientData((prev) => ({ ...prev, paused: true }));
        } catch (error) {
          console.error("Failed to pause session on backend:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    triggerPause();
  }, [patientData.dbSessionId, setPatientData]);

  const handleReturnHome = () => {
    // Clear patient data context and return to home
    setPatientData({
      dbSessionId: null,
      systemId: null,
      hospital: "",
      hn: "",
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
    });
    navigate("/");
  };

  if (!patientData.systemId) {
    return (
      <Card className="mt-8 text-center p-8">
        <p className="text-danger mb-4">Error: No active System ID found.</p>
        <Button onClick={() => navigate("/")}>Home</Button>
      </Card>
    );
  }

  return (
    <div className="max-w-[700px] mx-auto mt-8 mb-16 px-4">
      <LoadingOverlay isLoading={isLoading} message="Saving trial session..." />

      <Card className="shadow-2xl border-slate-200 mt-2">
        <CardContent className="p-8 md:p-12 flex flex-col items-center text-center">
          {/* Green Checkmark Icon Circle */}
          <div className="w-20 h-20 bg-success-bg text-success rounded-full flex items-center justify-center mb-6 ring-4 ring-success/20">
            <svg
              className="w-10 h-10"
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
          </div>

          <h2 className="text-[26px] font-bold text-slate-800 mb-2 leading-tight">
            Screening Complete — Session Saved
          </h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
            The inclusion and exclusion screening for this patient has been
            completed and saved.
          </p>

          {/* Info Box */}
          <div className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl p-6 text-left space-y-4 mb-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-slate-500">
                System ID
              </span>
              <span className="text-[16px] font-bold text-slate-900">
                {patientData.systemId}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-slate-500">Hospital</span>
              <span className="text-[16px] font-bold text-slate-900 leading-snug max-w-[280px] text-right">
                {patientData.hospital}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-slate-500">
                Inclusion Screening
              </span>
              <span className="text-sm font-bold text-success flex items-center">
                <span className="mr-1.5">✅</span> Passed
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500">
                Exclusion Screening
              </span>
              <span className="text-sm font-bold text-success flex items-center">
                <span className="mr-1.5">✅</span> Passed
              </span>
            </div>
          </div>

          {/* Instructions text */}
          <p className="text-slate-500 text-sm leading-relaxed mb-10 px-4">
            You may close this browser. When ready to continue, return to the
            home page and enter the same Hospital Number to resume the
            assessment.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 w-full justify-center max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                variant="secondary"
                className="w-full sm:w-1/2 font-bold py-3.5 border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 active:scale-[0.98] transition-transform select-none text-sm"
                onClick={handleReturnHome}
              >
                Return to Home
              </Button>
              <Button
                variant="secondary"
                className="w-full sm:w-1/2 font-bold py-3.5 border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 active:scale-[0.98] transition-transform select-none text-sm"
                onClick={() => navigate("/inclusion")}
              >
                ✏️ Edit Screening Criteria
              </Button>
            </div>

            <Button
              className="w-full font-bold py-4 rounded-xl bg-[#E91E63] hover:bg-[#D81B60] text-white shadow-md active:scale-[0.98] transition-transform select-none text-base"
              onClick={() => navigate("/score")}
            >
              Continue to Assessment Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
