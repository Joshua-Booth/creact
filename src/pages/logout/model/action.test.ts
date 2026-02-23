import { describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/entities/user";
import { api, mutate } from "@/shared/api";

import { logoutAction } from "./action";

vi.mock("@/shared/api", () => ({
  api: { post: vi.fn() },
  mutate: vi.fn(),
}));

vi.mock("@/entities/user", () => ({
  useAuthStore: {
    getState: vi.fn(() => ({ logout: vi.fn() })),
  },
}));

describe("logoutAction", () => {
  it("should invalidate server token, clear auth state, and purge SWR cache", async () => {
    const logoutFn = vi.fn();
    vi.mocked(useAuthStore.getState).mockReturnValue({
      logout: logoutFn,
    } as unknown as ReturnType<typeof useAuthStore.getState>);
    vi.mocked(api.post).mockResolvedValue(undefined as never);
    vi.mocked(mutate).mockResolvedValue(undefined as never);

    const result = await logoutAction();

    expect(api.post).toHaveBeenCalledWith("auth/logout/");
    expect(logoutFn).toHaveBeenCalled();
    expect(mutate).toHaveBeenCalledWith(expect.any(Function), undefined, {
      revalidate: false,
    });
    expect(result).toBeNull();
  });

  it("should still clear local state when API call fails (best-effort)", async () => {
    const logoutFn = vi.fn();
    vi.mocked(useAuthStore.getState).mockReturnValue({
      logout: logoutFn,
    } as unknown as ReturnType<typeof useAuthStore.getState>);
    vi.mocked(api.post).mockRejectedValue(new Error("Server unavailable"));
    vi.mocked(mutate).mockResolvedValue(undefined as never);

    const result = await logoutAction();

    expect(api.post).toHaveBeenCalledWith("auth/logout/");
    expect(logoutFn).toHaveBeenCalled();
    expect(mutate).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
