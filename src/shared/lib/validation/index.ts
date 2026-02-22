import i18next from "i18next";
import * as z from "zod";

/** Email address validated as a proper email format. */
export const emailSchema = z.email({
  error: () => i18next.t("email", { ns: "validation" }),
});

/** Password requiring 8+ chars, one uppercase, one lowercase, one digit. */
export const passwordSchema = z
  .string()
  .min(8, {
    error: () => i18next.t("password.minLength", { ns: "validation", min: 8 }),
  })
  .regex(/[A-Z]/, {
    error: () => i18next.t("password.uppercase", { ns: "validation" }),
  })
  .regex(/[a-z]/, {
    error: () => i18next.t("password.lowercase", { ns: "validation" }),
  })
  .regex(/\d/, {
    error: () => i18next.t("password.number", { ns: "validation" }),
  });

/** Simple password with no strength requirements, just non-empty. */
export const simplePasswordSchema = z.string().min(1, {
  error: () => i18next.t("password.required", { ns: "validation" }),
});

/** Re-export of `@hookform/resolvers/zod` for convenient form validation wiring. */
export { zodResolver } from "@hookform/resolvers/zod";
