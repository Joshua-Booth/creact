export const debounce = <T extends unknown>(
  func: (...args: T[]) => T,
  wait: number,
) => {
  let timeout: NodeJS.Timeout;
  return (...passedArgs: T[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...passedArgs);
    }, wait);
  };
};

export const throttle = <T extends unknown>(
  func: (...args: T[]) => T,
  limit: number,
) => {
  let inThrottle: boolean;
  return (...passedArgs: T[]) => {
    if (inThrottle) return;
    inThrottle = true;
    func(...passedArgs);
    setTimeout(() => {
      inThrottle = false;
    }, limit);
  };
};
