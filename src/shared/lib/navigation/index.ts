/** @public */
export const navigate = (path: string) => {
  window.location.href = path;
};

/** @public */
export const goBack = () => {
  window.history.back();
};
