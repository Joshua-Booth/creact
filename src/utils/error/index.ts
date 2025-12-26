export { isEmpty as isObjectEmpty } from 'es-toolkit/compat';

interface ErrorAction {
  type: string;
  payload?: unknown;
}

export const resetErrorState = (dispatch: (action: ErrorAction) => void) => {
  dispatch({ type: "REMOVE_ERROR" });
};

export const showAllErrors = () => {
  const errorElements = document.querySelectorAll<HTMLElement>(".alert-error");
  errorElements.forEach((el) => (el.style.display = "block"));
};

export const hideAllErrors = () => {
  const errorElements = document.querySelectorAll<HTMLElement>(".alert-error");
  errorElements.forEach((el) => (el.style.display = "none"));
};
