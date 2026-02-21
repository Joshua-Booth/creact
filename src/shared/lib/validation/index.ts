import i18next from "i18next";
import * as z from "zod";

/**
 * Reusable validation schema factories for use with react-hook-form and zodResolver.
 * Each factory returns a Zod schema with i18n-translated error messages.
 * Call inside hooks/components so translations are resolved at validation time.
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { zodResolver, emailSchema } from "@/shared/lib/validation";
 *
 * const schema = z.object({ email: emailSchema() });
 * const form = useForm({ resolver: zodResolver(schema) });
 * ```
 */

const t = (key: string, options?: Record<string, unknown>): string =>
  i18next.t(key, {
    ns: "validation",
    ...options,
  } as never) as unknown as string;

/**
 * Email address validated as a proper email format.
 * @returns Zod email schema with translated error message.
 */
export function emailSchema() {
  return z.email(t("email"));
}

/**
 * Password requiring 8+ chars, one uppercase, one lowercase, one digit.
 * @returns Zod string schema with translated strength requirement messages.
 */
export function passwordSchema() {
  return z
    .string()
    .min(8, t("password.minLength", { min: 8 }))
    .regex(/[A-Z]/, t("password.uppercase"))
    .regex(/[a-z]/, t("password.lowercase"))
    .regex(/\d/, t("password.number"));
}

/**
 * Simple password with no strength requirements, just non-empty.
 * @returns Zod string schema requiring at least one character.
 */
export function simplePasswordSchema() {
  return z.string().min(1, t("password.required"));
}

/**
 * Contact form schema requiring name, valid email, and a 10+ char message.
 * @returns Zod object schema for the contact form.
 */
export function contactSchema() {
  return z.object({
    name: z.string().min(1, t("required")),
    email: emailSchema(),
    message: z.string().min(10, t("minLength", { min: 10 })),
  });
}

/**
 * Inferred type for the contact form schema fields.
 * @public
 */
export type ContactFormData = z.infer<ReturnType<typeof contactSchema>>;

/** Re-export of `@hookform/resolvers/zod` for convenient form validation wiring. */
export { zodResolver } from "@hookform/resolvers/zod";
