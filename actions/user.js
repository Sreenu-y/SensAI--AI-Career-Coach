"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { onboardingSchema } from "@/app/lib/schema";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  // Validate incoming data against schema
  const validationResult = onboardingSchema.safeParse(data);
  if (!validationResult.success) {
    throw new Error("Invalid form data: " + validationResult.error.message);
  }
  const validatedData = validationResult.data;

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    let industryInsight = await db.industryInsight.findUnique({
      where: { industry: validatedData.industry },
    });

    let insights = null;

    if (!industryInsight) {
      insights = await generateAIInsights(validatedData.industry);
    }

    const result = await db.$transaction(
      async (tx) => {
        const industryInsight = await tx.industryInsight.upsert({
          where: { industry: validatedData.industry },
          update: {}, // do nothing if exists
          create: {
            industry: validatedData.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });

        // update the user
        const updateUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: validatedData.industry,
            experience: validatedData.experience,
            bio: validatedData.bio,
            skills: validatedData.skills,
          },
        });

        return { updatedUser: updateUser, industryInsight };
      },
      {
        timeout: 10000, // default: 5000 (since we are using AI-Logic we are keeping it as 10000)
      },
    );

    return { success: true, ...result };
  } catch (error) {
    console.error("Error updating user and industry: ", error);
    throw new Error("Failed to update profile", { cause: error });
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    if (!user) throw new Error("User not found");

    return { isOnboarded: !!user.industry };
  } catch (error) {
    console.error("Error checking onboarding status", error.message);
    throw error;
  }
}
