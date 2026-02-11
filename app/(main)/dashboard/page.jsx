import React from "react";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

const IndustryInsightsPage = async () => {
  let isOnboarded = false;

  try {
    const result = await getUserOnboardingStatus();
    isOnboarded = result.isOnboarded;
  } catch (error) {
    // Handle auth errors
    if (error.message.includes("Unauthorized")) {
      redirect("/sign-in");
    }
    // For other errors like user not found, redirect to onboarding
    redirect("/onboarding");
  }

  if (!isOnboarded) {
    redirect("/onboarding");
  }
  return <div>dashboard</div>;
};

export default IndustryInsightsPage;
