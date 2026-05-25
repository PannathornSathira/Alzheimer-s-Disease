import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { usePatient } from "../context/PatientContext";
import { submitScore } from "../api/sessionApi";
import { LoadingOverlay } from "../components/ui/LoadingOverlay";
import { SCORE_CONFIG } from "../config/scoreConfig";

export function ScoreAssessment() {
  const navigate = useNavigate();
  const { patientData, setPatientData } = usePatient();
  const [isLoading, setIsLoading] = useState(false);

  const [selections, setSelections] = useState(() => {
    // Initialize active parameter keys from SCORE_CONFIG
    const initialSelections = {};
    SCORE_CONFIG.parameters.forEach((param) => {
      initialSelections[param.key] = null;
    });

    // If patient already has a score populated in context, load it
    if (patientData) {
      let hasData = false;
      const loaded = {};
      SCORE_CONFIG.parameters.forEach((param) => {
        const scoreKey = `${param.key}Score`;
        if (
          patientData[scoreKey] !== undefined &&
          patientData[scoreKey] !== null
        ) {
          loaded[param.key] = patientData[scoreKey];
          hasData = true;
        }
      });
      if (hasData) {
        return { ...initialSelections, ...loaded };
      }
    }

    // Fallback to local storage persistence
    const saved = localStorage.getItem(`score_${patientData?.systemId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const cleaned = {};
        SCORE_CONFIG.parameters.forEach((param) => {
          cleaned[param.key] =
            parsed[param.key] !== undefined ? parsed[param.key] : null;
        });
        return cleaned;
      } catch (e) {
        console.error(e);
      }
    }

    return initialSelections;
  });

  useEffect(() => {
    if (patientData?.systemId) {
      localStorage.setItem(
        `score_${patientData.systemId}`,
        JSON.stringify(selections),
      );
    }
  }, [selections, patientData?.systemId]);

  const totalScore = SCORE_CONFIG.parameters.reduce((sum, param) => {
    const val = selections[param.key];
    return sum + (val !== null && val !== undefined ? val : 0);
  }, 0);
  const allAnswered = SCORE_CONFIG.parameters.every(
    (param) =>
      selections[param.key] !== null && selections[param.key] !== undefined,
  );

  // Determine current stratification based on totalScore
  const getStratificationLabel = () => {
    if (!allAnswered) return "";
    const group = SCORE_CONFIG.stratification.find(
      (s) => totalScore >= s.minScore && totalScore <= s.maxScore,
    );
    return group ? group.label : "";
  };

  const handleRandomize = async () => {
    setIsLoading(true);
    try {
      let finalAssignedArm = null;

      if (patientData.dbSessionId) {
        const response = await submitScore(patientData.dbSessionId, {
          cognitiveSeverityScore:
            selections.cognitiveSeverity !== undefined
              ? selections.cognitiveSeverity
              : null,
          vascularRiskScore:
            selections.vascularRisk !== undefined
              ? selections.vascularRisk
              : null,
          behavioralSymptomsScore:
            selections.behavioralSymptoms !== undefined
              ? selections.behavioralSymptoms
              : null,
          functionalImpairmentScore:
            selections.functionalImpairment !== undefined
              ? selections.functionalImpairment
              : null,
          familyHistoryScore:
            selections.familyHistory !== undefined
              ? selections.familyHistory
              : null,
        });
        finalAssignedArm = response.session.allocationResult;
      }

      if (!finalAssignedArm) {
        // Fallback for UI testing if no DB connection
        finalAssignedArm =
          totalScore >= SCORE_CONFIG.minimumScoreForRandomization
            ? "Drug Arm (Levetiracetam)"
            : null;
      }

      setPatientData((prev) => ({
        ...prev,
        totalScore,
        assignedArm: finalAssignedArm,
        cognitiveSeverityScore:
          selections.cognitiveSeverity !== undefined
            ? selections.cognitiveSeverity
            : null,
        vascularRiskScore:
          selections.vascularRisk !== undefined
            ? selections.vascularRisk
            : null,
        behavioralSymptomsScore:
          selections.behavioralSymptoms !== undefined
            ? selections.behavioralSymptoms
            : null,
        functionalImpairmentScore:
          selections.functionalImpairment !== undefined
            ? selections.functionalImpairment
            : null,
        familyHistoryScore:
          selections.familyHistory !== undefined
            ? selections.familyHistory
            : null,
      }));

      navigate("/result");
    } catch (error) {
      console.error("Failed to submit score:", error);
      alert("Failed to connect to backend: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!patientData.systemId) {
    return (
      <Card className="mt-8 text-center p-8">
        <p className="text-danger mb-4">
          Error: No active System ID found. Please start from Registration.
        </p>
        <Button onClick={() => navigate("/registration")}>
          Go to Registration
        </Button>
      </Card>
    );
  }

  const isEligible = totalScore >= SCORE_CONFIG.minimumScoreForRandomization;

  return (
    <div className="max-w-[800px] mx-auto mt-6 mb-16 px-4">
      <LoadingOverlay
        isLoading={isLoading}
        message="Calculating & Randomizing..."
      />

      <Card className="shadow-lg border-slate-200 mt-2">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-800">
            {SCORE_CONFIG.title}
          </CardTitle>
          <p className="text-slate-500 text-sm mt-2">
            {SCORE_CONFIG.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {SCORE_CONFIG.parameters.map((param) => (
            <div
              key={param.key}
              className="p-4 bg-white border border-slate-200 rounded-lg hover:border-pink-200 transition-colors"
            >
              <div className="mb-3 text-left">
                <label className="block text-[15px] font-semibold text-slate-800">
                  {param.label}
                </label>
                {param.description && (
                  <p className="text-[13px] text-slate-500 mt-0.5">
                    {param.description}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {param.options.map((opt) => {
                  const isSelected = selections[param.key] === opt.points;
                  return (
                    <button
                      key={opt.id}
                      onClick={() =>
                        setSelections((prev) => ({
                          ...prev,
                          [param.key]: opt.points,
                        }))
                      }
                      className={`flex-1 min-w-[120px] px-4 py-2 border rounded-md text-sm font-medium transition-all select-none
                        ${
                          isSelected
                            ? "bg-[#E91E63] border-[#E91E63] text-white shadow-md ring-2 ring-[#E91E63]/20"
                            : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                        }`}
                    >
                      {opt.label}
                      {isSelected && (
                        <span className="block text-xs mt-0.5 opacity-80">
                          (+{opt.points})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex-col items-stretch space-y-2">
          {!allAnswered && (
            <div className="mb-2 text-center">
              <p className="px-4 py-3 bg-[#fef2f2] text-[#e11d48] border border-[#fecaca] rounded-lg text-[15px] font-medium shadow-sm">
                Please complete all selections to calculate the risk score.
              </p>
            </div>
          )}

          {allAnswered && !isEligible && (
            <div className="mb-2 text-center animate-fade-in-up">
              <p className="px-4 py-3 bg-[#fff1f2] text-[#be123c] border border-[#fda4af] rounded-lg text-[15px] font-bold shadow-sm">
                ⚠️ Patient is ineligible for randomization (Requires score ≥{" "}
                {SCORE_CONFIG.minimumScoreForRandomization}).
              </p>
            </div>
          )}

          <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg p-6 w-full mb-4">
            <span className="text-lg font-bold text-slate-700 tracking-wider">
              Total Risk Score
            </span>
            <div className="flex flex-col items-end">
              <span
                className={`text-[40px] leading-none font-black ${totalScore > 0 ? "text-[#E91E63]" : "text-slate-300"}`}
              >
                {totalScore}
              </span>
              {allAnswered && (
                <span
                  className={`text-sm font-bold mt-1 ${isEligible ? "text-[#E91E63]" : "text-slate-400"}`}
                >
                  {getStratificationLabel()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => {
                // If it was resumed, we can navigate back to Registration, else to Exclusion
                navigate("/exclusion");
              }}
              className="text-[#64748B] hover:text-slate-900 font-bold text-[16px] px-2 py-2 transition-colors flex items-center"
            >
              <span className="mr-2 opacity-80 mt-[2px]">←</span> Back
            </button>
            <button
              onClick={handleRandomize}
              disabled={!allAnswered || !isEligible}
              className={`px-10 py-4 rounded-xl font-bold text-[16px] flex items-center transition-all ${
                allAnswered && isEligible
                  ? "bg-[#E91E63] hover:bg-[#D81B60] text-white shadow-md active:scale-95"
                  : "bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed opacity-70"
              }`}
            >
              Calculate & Randomize
              <svg
                className="ml-2 w-5 h-5 opacity-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
