import { z } from "zod";

/**
 * Common validation schemas for use with react-hook-form and zodResolver.
 *
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { zodResolver } from "@hookform/resolvers/zod";
 * import { loginSchema, type LoginFormData } from "@/shared/lib/validation";
 *
 * const form = useForm<LoginFormData>({
 *   resolver: zodResolver(loginSchema),
 * });
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

// Simple password (no strength requirements, just minimum length)
export const simplePasswordSchema = z.string().min(1, "Password is required");

// Common login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: simplePasswordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Registration form schema with password confirmation
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

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
