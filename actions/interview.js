"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found!");

  try {
    const prompt = `
      Generate 10 technical interview questions for a ${
        user.industry
      } professional${
        user.skills?.length
          ? ` with expertise in ${user.skills.join(", ")}`
          : ""
      }.
              
        Each question should be multiple choice with 4 options.
        
        Return the response in this JSON format only, no additional text:
        {
        "questions": [
            {
                "question": "string",
                "options": ["string", "string", "string", "string"],
                "correctAnswer": "string",
                "explanation": "string"
            }
        ]
    }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error("Empty Gemini response");
    }
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz: ", error);
    throw new Error("Error generating quiz");
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not found");

  const questionResult = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  const wrongAnswers = questionResult.filter((q) => !q.isCorrect);
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongAnswersText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`,
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:
      
      ${wrongAnswersText}
      
      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
      `;

    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: improvementPrompt,
      });

      const text = result.text.trim();
      if (!text) throw new Error("Empty Gemini response");
      improvementTip = text;
    } catch (error) {
      console.error("Error Saving Quiz Result", error);
      throw new Error("Error Saving Quiz Result");
    }
  }
  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResult,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error Saving Assessment in DB", error);
    throw new Error("Error Saving Assessment in DB");
  }
}
