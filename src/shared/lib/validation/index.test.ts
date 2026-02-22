import i18next from "i18next";
import { beforeAll, describe, expect, it } from "vitest";

import validation from "@/shared/i18n/locales/en/validation";

import { emailSchema, passwordSchema, simplePasswordSchema } from "./index";

function firstIssueMessage(result: {
  success: boolean;
  error?: { issues: { message: string }[] };
}): string {
  expect(result.success).toBe(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return -- narrowed above via expect
  return (result as any).error.issues[0].message;
}

describe("validation schemas", () => {
  beforeAll(async () => {
    await i18next.init({
      lng: "en",
      resources: { en: { validation } },
      interpolation: { escapeValue: false },
    });
  });

  describe("emailSchema", () => {
    it("should accept valid email addresses", () => {
      expect(emailSchema().safeParse("test@example.com").success).toBe(true);
      expect(emailSchema().safeParse("user.name@domain.org").success).toBe(
        true
      );
    });

    it("should reject invalid email addresses", () => {
      expect(emailSchema().safeParse("invalid").success).toBe(false);
      expect(emailSchema().safeParse("@example.com").success).toBe(false);
      expect(emailSchema().safeParse("test@").success).toBe(false);
    });

    it("should return translated email error message", () => {
      const result = emailSchema().safeParse("invalid");
      expect(firstIssueMessage(result)).toBe(
        "Please enter a valid email address"
      );
    });
  });

  describe("passwordSchema", () => {
    it("should accept valid passwords", () => {
      expect(passwordSchema().safeParse("Password1").success).toBe(true);
      expect(passwordSchema().safeParse("MySecure123").success).toBe(true);
    });

    it("should reject passwords shorter than 8 characters", () => {
      const result = passwordSchema().safeParse("Pass1");
      expect(result.success).toBe(false);
    });

    it("should reject passwords without uppercase letters", () => {
      const result = passwordSchema().safeParse("password1");
      expect(result.success).toBe(false);
    });

    it("should reject passwords without lowercase letters", () => {
      const result = passwordSchema().safeParse("PASSWORD1");
      expect(result.success).toBe(false);
    });

    it("should reject passwords without numbers", () => {
      const result = passwordSchema().safeParse("Password");
      expect(result.success).toBe(false);
    });

    it("should return translated minLength error message", () => {
      const result = passwordSchema().safeParse("Pass1");
      expect(firstIssueMessage(result)).toBe(
        "Password must be at least 8 characters"
      );
    });

    it("should return translated uppercase error message", () => {
      const result = passwordSchema().safeParse("password1");
      expect(firstIssueMessage(result)).toBe(
        "Password must contain at least one uppercase letter"
      );
    });

    it("should return translated lowercase error message", () => {
      const result = passwordSchema().safeParse("PASSWORD1");
      expect(firstIssueMessage(result)).toBe(
        "Password must contain at least one lowercase letter"
      );
    });

    it("should return translated number error message", () => {
      const result = passwordSchema().safeParse("Password");
      expect(firstIssueMessage(result)).toBe(
        "Password must contain at least one number"
      );
    });
  });

  describe("simplePasswordSchema", () => {
    it("should accept any non-empty password", () => {
      expect(simplePasswordSchema().safeParse("a").success).toBe(true);
      expect(simplePasswordSchema().safeParse("password").success).toBe(true);
    });

    it("should reject empty passwords", () => {
      expect(simplePasswordSchema().safeParse("").success).toBe(false);
    });

    it("should return translated required error message", () => {
      const result = simplePasswordSchema().safeParse("");
      expect(firstIssueMessage(result)).toBe("Password is required");
    });
  });
});
