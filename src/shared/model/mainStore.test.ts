import { describe, it, expect, beforeEach } from "vitest";
import { useMainStore } from "./mainStore";

describe("useMainStore", () => {
  beforeEach(() => {
    useMainStore.setState({ error: null });
  });

  it("should have initial error state as null", () => {
    const state = useMainStore.getState();
    expect(state.error).toBeNull();
  });

  it("should set error state", () => {
    const testError = {
      status: 404,
      response: { message: "Not found" },
    };

    useMainStore.getState().setError(testError);

    const state = useMainStore.getState();
    expect(state.error).toEqual(testError);
  });

  it("should clear error state", () => {
    const testError = {
      status: 500,
      response: { message: "Internal server error" },
    };

    useMainStore.getState().setError(testError);
    expect(useMainStore.getState().error).toEqual(testError);

    useMainStore.getState().clearError();
    expect(useMainStore.getState().error).toBeNull();
  });

  it("should handle multiple error updates", () => {
    const error1 = {
      status: 400,
      response: { message: "Bad request" },
    };
    const error2 = {
      status: 401,
      response: { message: "Unauthorized" },
    };

    useMainStore.getState().setError(error1);
    expect(useMainStore.getState().error).toEqual(error1);

    useMainStore.getState().setError(error2);
    expect(useMainStore.getState().error).toEqual(error2);
  });

  it("should handle error with different response types", () => {
    const errorWithString = {
      status: 500,
      response: "String error message",
    };

    useMainStore.getState().setError(errorWithString);
    expect(useMainStore.getState().error).toEqual(errorWithString);

    const errorWithArray = {
      status: 422,
      response: ["Error 1", "Error 2"],
    };

    useMainStore.getState().setError(errorWithArray);
    expect(useMainStore.getState().error).toEqual(errorWithArray);
  });

  it("should allow setting error to null explicitly", () => {
    const testError = {
      status: 404,
      response: { message: "Not found" },
    };

    useMainStore.getState().setError(testError);
    expect(useMainStore.getState().error).toEqual(testError);

    useMainStore.getState().setError(null);
    expect(useMainStore.getState().error).toBeNull();
  });
});
