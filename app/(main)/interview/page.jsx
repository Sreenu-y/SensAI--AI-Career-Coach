import { getAssessments } from "@/actions/interview";
import React from "react";
import StatCards from "./_components/stat-cards";
import PerformanceChart from "./_components/performance-chart";
import QuizList from "./_components/quiz-list";

const InterviewPage = async () => {
  const assessments = await getAssessments();

  return (
    <div className="min-h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>

      {/* Stat cards */}
      <div className="space-y-6">
        <StatCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
};

export default InterviewPage;
