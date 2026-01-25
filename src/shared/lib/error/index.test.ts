import { describe, expect, it, vi } from "vitest";

import { resetErrorState } from "./index";

describe("Error utilities", () => {
  describe("resetErrorState", () => {
    it("should dispatch REMOVE_ERROR action", () => {
      const mockDispatch = vi.fn();
      resetErrorState(mockDispatch);
      expect(mockDispatch).toHaveBeenCalledWith({ type: "REMOVE_ERROR" });
    });

    it("should dispatch action exactly once", () => {
      const mockDispatch = vi.fn();
      resetErrorState(mockDispatch);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });
});
