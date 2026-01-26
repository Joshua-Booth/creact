import * as z from "zod";

import { emailSchema, simplePasswordSchema } from "@/shared/lib/validation";

export const loginSchema = z.object({
  email: emailSchema,
  password: simplePasswordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
