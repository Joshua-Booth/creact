interface ErrorAction {
  type: string;
  payload?: unknown;
}

/**
 * Dispatch action to clear error state.
 * @param dispatch - Dispatch function from error context
 */
export const resetErrorState = (dispatch: (action: ErrorAction) => void) => {
  dispatch({ type: "REMOVE_ERROR" });
};
