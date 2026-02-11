import { industries } from "@/data/industries";
import React from "react";
import OnboardingForm from "./_components/onboarding-form";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

const OnboardingPage = async () => {
  // Check if the user is already onboarded
  let isOnboarded = false;

  try {
    const result = await getUserOnboardingStatus();
    isOnboarded = result.isOnboarded;
  } catch (error) {
    // Handle auth errors - redirect to sign-in
    if (error.message.includes("Unauthorized")) {
      redirect("/sign-in");
    }
    // For other errors, let them proceed with onboarding
  }

  if (isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
};

export default OnboardingPage;
