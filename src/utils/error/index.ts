export const isObjectEmpty = (obj: unknown): boolean => {
  if (obj === null || obj === undefined) return true;
  return Object.keys(obj as object).length === 0;
};

interface ErrorAction {
  type: string;
  payload?: unknown;
}

export const resetErrorState = (dispatch: (action: ErrorAction) => void) => {
  dispatch({ type: "REMOVE_ERROR" });
};

export const showAllErrors = () => {
  const errorElements = document.querySelectorAll(".alert-error");
  errorElements.forEach((el) => (el.style.display = "block"));
};

export const hideAllErrors = () => {
  const errorElements = document.querySelectorAll(".alert-error");
  errorElements.forEach((el) => (el.style.display = "none"));
};
