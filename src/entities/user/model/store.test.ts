import { beforeEach, describe, expect, it, vi } from "vitest";

const localStorageMock = (() => {
  let store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store = new Map();
    }),
    get length() {
      return store.size;
    },
    key: vi.fn((_index: number) => null),
  };
})();

vi.stubGlobal("localStorage", localStorageMock);

// Suppress zustand persist middleware warning about unavailable storage in test environment
vi.spyOn(console, "warn").mockImplementation(vi.fn());

// Must import after stubbing localStorage so the module initializes with the mock
const { useAuthStore, syncAuthFromStorage } = await import("./store");

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    useAuthStore.setState({ token: null });
  });

  it("should have correct initial state", () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
  });

  it("should set token on login", () => {
    useAuthStore.getState().login("test-token");

    const state = useAuthStore.getState();
    expect(state.token).toBe("test-token");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "token",
      "test-token"
    );
  });

  it("should clear token on logout", () => {
    useAuthStore.getState().login("test-token");
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
  });
});

describe("syncAuthFromStorage", () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null });
  });

  it("ignores storage events for unrelated keys", () => {
    useAuthStore.setState({ token: "keep" });
    syncAuthFromStorage({ key: "unrelated", newValue: null });
    expect(useAuthStore.getState().token).toBe("keep");
  });

  it("clears the token when another tab removes it", () => {
    useAuthStore.setState({ token: "old" });
    syncAuthFromStorage({ key: "token", newValue: null });
    expect(useAuthStore.getState().token).toBeNull();
  });

  it("adopts a new token set by another tab", () => {
    useAuthStore.setState({ token: "old" });
    syncAuthFromStorage({ key: "token", newValue: "new" });
    expect(useAuthStore.getState().token).toBe("new");
  });

  it("does not touch state when cleared but already null", () => {
    const listener = vi.fn();
    const unsubscribe = useAuthStore.subscribe(listener);
    syncAuthFromStorage({ key: "token", newValue: null });
    unsubscribe();
    expect(useAuthStore.getState().token).toBeNull();
    expect(listener).not.toHaveBeenCalled();
  });

  it("does not re-set state when the new value equals the current token", () => {
    useAuthStore.setState({ token: "same" });
    const listener = vi.fn();
    const unsubscribe = useAuthStore.subscribe(listener);
    syncAuthFromStorage({ key: "token", newValue: "same" });
    unsubscribe();
    expect(useAuthStore.getState().token).toBe("same");
    expect(listener).not.toHaveBeenCalled();
  });
});
