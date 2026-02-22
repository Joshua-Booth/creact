import * as z from "zod";

import { emailSchema } from "@/shared/lib/validation";

export function forgotPasswordSchema() {
  return z.object({
    email: emailSchema(),
  });
}

export type ForgotPasswordFormData = z.infer<
  ReturnType<typeof forgotPasswordSchema>
>;
