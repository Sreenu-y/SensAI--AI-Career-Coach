import z from "zod";

export const onboardingSchema = z.object({
  industry: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: "string",
        received: "undefined",
        message: "Please select an industry",
      });
    }
  }),
  subIndustry: z.string().superRefine((val, ctx) => {
    if (!val || val.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: "string",
        received: "undefined",
        message: "Please select a specialization",
      });
    }
  }),
  bio: z.string().max(500).optional(),
  experience: z
    .union([z.string().transform((val) => parseInt(val, 10)), z.number()])
    .pipe(
      z
        .number()
        .min(0, "Experience must be at least 0 years")
        .max(50, "Experience cannot exceed 50 years"),
    ),
  skills: z.union([
    z.string().transform((val) =>
      val
        ? val
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [],
    ),
    z.array(z.string()),
  ]),
});
