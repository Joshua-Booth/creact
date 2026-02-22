import i18next from "i18next";
import * as z from "zod";

import { emailSchema, passwordSchema } from "@/shared/lib/validation";

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: () => i18next.t("passwordMismatch", { ns: "validation" }),
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
