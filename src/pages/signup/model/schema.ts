import * as z from "zod";

import {
  emailSchema,
  passwordSchema,
  validationT,
} from "@/shared/lib/validation";

export function registerSchema() {
  return z
    .object({
      email: emailSchema(),
      password: passwordSchema(),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      error: validationT("passwordMismatch"),
      path: ["confirmPassword"],
    });
}

export type RegisterFormData = z.infer<ReturnType<typeof registerSchema>>;
