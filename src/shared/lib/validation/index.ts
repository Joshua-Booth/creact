import { z } from "zod";

/**
 * Reusable validation schemas for use with react-hook-form and zodResolver.
 *
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { zodResolver, emailSchema } from "@/shared/lib/validation";
 *
 * const schema = z.object({ email: emailSchema });
 * const form = useForm({ resolver: zodResolver(schema) });
 * ```
 */

// Email validation
export const emailSchema = z.string().email("Please enter a valid email");

// Password validation with strength requirements
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Simple password (no strength requirements, just non-empty)
export const simplePasswordSchema = z.string().min(1, "Password is required");

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: emailSchema,
  message: z.string().min(10, "Message must be at least 10 characters"),
});

/** @public */
export type ContactFormData = z.infer<typeof contactSchema>;

// Re-export zod and zodResolver for convenience
export { z } from "zod";
export { zodResolver } from "@hookform/resolvers/zod";
