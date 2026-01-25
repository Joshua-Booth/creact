import { describe, expect, it } from "vitest";

import {
  contactSchema,
  emailSchema,
  passwordSchema,
  simplePasswordSchema,
} from "./index";

describe("emailSchema", () => {
  it("should accept valid email addresses", () => {
    expect(emailSchema.safeParse("test@example.com").success).toBe(true);
    expect(emailSchema.safeParse("user.name@domain.org").success).toBe(true);
  });

  it("should reject invalid email addresses", () => {
    expect(emailSchema.safeParse("invalid").success).toBe(false);
    expect(emailSchema.safeParse("@example.com").success).toBe(false);
    expect(emailSchema.safeParse("test@").success).toBe(false);
  });
});

describe("passwordSchema", () => {
  it("should accept valid passwords", () => {
    expect(passwordSchema.safeParse("Password1").success).toBe(true);
    expect(passwordSchema.safeParse("MySecure123").success).toBe(true);
  });

  it("should reject passwords shorter than 8 characters", () => {
    const result = passwordSchema.safeParse("Pass1");
    expect(result.success).toBe(false);
  });

  it("should reject passwords without uppercase letters", () => {
    const result = passwordSchema.safeParse("password1");
    expect(result.success).toBe(false);
  });

  it("should reject passwords without lowercase letters", () => {
    const result = passwordSchema.safeParse("PASSWORD1");
    expect(result.success).toBe(false);
  });

  it("should reject passwords without numbers", () => {
    const result = passwordSchema.safeParse("Password");
    expect(result.success).toBe(false);
  });
});

describe("simplePasswordSchema", () => {
  it("should accept any non-empty password", () => {
    expect(simplePasswordSchema.safeParse("a").success).toBe(true);
    expect(simplePasswordSchema.safeParse("password").success).toBe(true);
  });

  it("should reject empty passwords", () => {
    expect(simplePasswordSchema.safeParse("").success).toBe(false);
  });
});

describe("contactSchema", () => {
  it("should accept valid contact data", () => {
    const result = contactSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      message: "This is a test message.",
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty name", () => {
    const result = contactSchema.safeParse({
      name: "",
      email: "john@example.com",
      message: "This is a test message.",
    });
    expect(result.success).toBe(false);
  });

  it("should reject short messages", () => {
    const result = contactSchema.safeParse({
      name: "John",
      email: "john@example.com",
      message: "Hi",
    });
    expect(result.success).toBe(false);
  });
});
