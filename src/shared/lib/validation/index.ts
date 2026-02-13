import * as z from "zod";

/**
 * Reusable validation schemas for use with react-hook-form and zodResolver.
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { zodResolver, emailSchema } from "@/shared/lib/validation";
 *
 * const schema = z.object({ email: emailSchema });
 * const form = useForm({ resolver: zodResolver(schema) });
 * ```
 */

/** Email address validated as a proper email format. */
export const emailSchema = z.email("Please enter a valid email");

/** Password requiring 8+ chars, one uppercase, one lowercase, one digit. */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number");

/** Simple password with no strength requirements, just non-empty. */
export const simplePasswordSchema = z.string().min(1, "Password is required");

/** Contact form schema requiring name, valid email, and a 10+ char message. */
export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: emailSchema,
  message: z.string().min(10, "Message must be at least 10 characters"),
});

/**
 * Inferred type for the contact form schema fields.
 * @public
 */
export type ContactFormData = z.infer<typeof contactSchema>;

/** Re-export of `@hookform/resolvers/zod` for convenient form validation wiring. */
export { zodResolver } from "@hookform/resolvers/zod";
