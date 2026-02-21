import * as z from "zod";

import { emailSchema, simplePasswordSchema } from "@/shared/lib/validation";

export function loginSchema() {
  return z.object({
    email: emailSchema(),
    password: simplePasswordSchema(),
  });
}

export type LoginFormData = z.infer<ReturnType<typeof loginSchema>>;
