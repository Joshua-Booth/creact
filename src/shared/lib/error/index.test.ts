import { describe, it, expect, beforeEach, vi } from "vitest";
import { resetErrorState, showAllErrors, hideAllErrors } from "./index";

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

  describe("showAllErrors", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
    });

    it("should show all error elements by setting display to block", () => {
      document.body.innerHTML = `
        <div class="alert-error" style="display: none;">Error 1</div>
        <div class="alert-error" style="display: none;">Error 2</div>
        <div class="alert-error" style="display: none;">Error 3</div>
      `;

      showAllErrors();

      const errorElements = document.querySelectorAll<HTMLElement>(".alert-error");
      errorElements.forEach((el) => {
        expect(el.style.display).toBe("block");
      });
    });

    it("should work with no error elements present", () => {
      document.body.innerHTML = "<div>No errors here</div>";
      expect(() => showAllErrors()).not.toThrow();
    });

    it("should work with single error element", () => {
      document.body.innerHTML = `<div class="alert-error" style="display: none;">Error</div>`;
      showAllErrors();
      const errorElement = document.querySelector<HTMLElement>(".alert-error");
      expect(errorElement?.style.display).toBe("block");
    });
  });

  describe("hideAllErrors", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
    });

    it("should hide all error elements by setting display to none", () => {
      document.body.innerHTML = `
        <div class="alert-error" style="display: block;">Error 1</div>
        <div class="alert-error" style="display: block;">Error 2</div>
        <div class="alert-error" style="display: block;">Error 3</div>
      `;

      hideAllErrors();

      const errorElements = document.querySelectorAll<HTMLElement>(".alert-error");
      errorElements.forEach((el) => {
        expect(el.style.display).toBe("none");
      });
    });

    it("should work with no error elements present", () => {
      document.body.innerHTML = "<div>No errors here</div>";
      expect(() => hideAllErrors()).not.toThrow();
    });

    it("should work with single error element", () => {
      document.body.innerHTML = `<div class="alert-error" style="display: block;">Error</div>`;
      hideAllErrors();
      const errorElement = document.querySelector<HTMLElement>(".alert-error");
      expect(errorElement?.style.display).toBe("none");
    });

    it("should handle mixed display states", () => {
      document.body.innerHTML = `
        <div class="alert-error" style="display: block;">Error 1</div>
        <div class="alert-error" style="display: none;">Error 2</div>
        <div class="alert-error">Error 3</div>
      `;

      hideAllErrors();

      const errorElements = document.querySelectorAll<HTMLElement>(".alert-error");
      errorElements.forEach((el) => {
        expect(el.style.display).toBe("none");
      });
    });
  });
});
