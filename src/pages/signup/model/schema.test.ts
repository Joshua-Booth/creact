import { describe, expect, it } from "vitest";

import { registerSchema } from "./schema";

describe("registerSchema", () => {
  it("should accept valid registration data", () => {
    const result = registerSchema().safeParse({
      email: "test@example.com",
      password: "Password1",
      confirmPassword: "Password1",
    });
    expect(result.success).toBe(true);
  });

  it("should reject mismatched passwords", () => {
    const result = registerSchema().safeParse({
      email: "test@example.com",
      password: "Password1",
      confirmPassword: "Password2",
    });
    expect(result.success).toBe(false);
  });

  it("should reject weak passwords", () => {
    const result = registerSchema().safeParse({
      email: "test@example.com",
      password: "weak",
      confirmPassword: "weak",
    });
    expect(result.success).toBe(false);
  });
});
