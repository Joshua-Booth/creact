import i18next from "i18next";
import * as z from "zod";

/**
 * Reusable validation schema factories for use with react-hook-form and zodResolver.
 *
 * **Why factories, not constants?**
 * Each factory returns a Zod schema with i18n-translated error messages.
 * Because `i18next.t()` must run _after_ i18next is initialized, schemas are
 * functions (not top-level constants) so translations resolve at call time.
 *
 * **`validationT` helper**
 * A thin wrapper around `i18next.t()` that locks `ns: "validation"`. Uses a
 * single object-level cast to bypass `CustomTypeOptions` strict key inference
 * (which rejects loose `string` keys). We use `i18next.t()` rather than
 * `getFixedT()` because `getFixedT` crashes in uninitialized environments
 * (Storybook) due to a missing `overloadTranslationOptionHandler` guard.
 *
 * **Language support**
 * Currently English-only (`SUPPORTED_LANGUAGES: ["en"]`). If multi-language
 * support is added, schema factories should be called inside `useMemo` keyed
 * on `i18n.language` so error messages update on language switch.
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { zodResolver, emailSchema } from "@/shared/lib/validation";
 *
 * const schema = z.object({ email: emailSchema() });
 * const form = useForm({ resolver: zodResolver(schema) });
 * ```
 */

interface SimpleTranslator {
  t(key: string, options: { ns: "validation"; [k: string]: unknown }): string;
}

/**
 * Translate a validation-namespace key via i18next.
 *
 * Casts `i18next` to a simple `{ t(key, opts) => string }` interface to
 * bypass `CustomTypeOptions` strict key inference while keeping the call
 * type-safe at the boundary.
 * @param key - Translation key within the validation namespace.
 * @param options - Interpolation values forwarded to i18next.
 * @returns The translated string.
 */
export const validationT = (
  key: string,
  options?: Record<string, unknown>
): string =>
  (i18next as unknown as SimpleTranslator).t(key, {
    ns: "validation",
    ...options,
  });

/**
 * Email address validated as a proper email format.
 * @returns Zod email schema with translated error message.
 */
export function emailSchema() {
  return z.email(validationT("email"));
}

/**
 * Password requiring 8+ chars, one uppercase, one lowercase, one digit.
 * @returns Zod string schema with translated strength requirement messages.
 */
export function passwordSchema() {
  return z
    .string()
    .min(8, validationT("password.minLength", { min: 8 }))
    .regex(/[A-Z]/, validationT("password.uppercase"))
    .regex(/[a-z]/, validationT("password.lowercase"))
    .regex(/\d/, validationT("password.number"));
}

/**
 * Simple password with no strength requirements, just non-empty.
 * @returns Zod string schema requiring at least one character.
 */
export function simplePasswordSchema() {
  return z.string().min(1, validationT("password.required"));
}

/** Re-export of `@hookform/resolvers/zod` for convenient form validation wiring. */
export { zodResolver } from "@hookform/resolvers/zod";
