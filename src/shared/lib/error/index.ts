interface ErrorAction {
  type: string;
  payload?: unknown;
}

export const resetErrorState = (dispatch: (action: ErrorAction) => void) => {
  dispatch({ type: "REMOVE_ERROR" });
};
