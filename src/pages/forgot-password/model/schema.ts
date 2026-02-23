import * as z from "zod";

import { emailSchema } from "@/shared/lib/validation";

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
