export const __DEV__ = import.meta.env.DEV || false
export const __REACT_DEVTOOLS_GLOBAL_HOOK__ = () => {
  if (__DEV__) {
    // React DevTools is running
  }
}
