/** @public */
export const isMobile = (): boolean => {
  return window.innerWidth < 768;
};

/** @public */
export const isTablet = (): boolean => {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

/** @public */
export const isDesktop = (): boolean => {
  return window.innerWidth >= 1024;
};
