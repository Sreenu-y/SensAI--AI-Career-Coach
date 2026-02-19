import React from "react";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_components/dashboard-view";

const IndustryInsightsPage = async () => {
  let isOnboarded = false;

  try {
    const result = await getUserOnboardingStatus();
    isOnboarded = result.isOnboarded;
  } catch (error) {
    if (error.message.includes("Unauthorized")) {
      redirect("/sign-in");
    }
    redirect("/onboarding");
  }

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const insights = await getIndustryInsights();

  return (
    <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  );
};

export default IndustryInsightsPage;
