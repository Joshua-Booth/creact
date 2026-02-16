import { Toaster } from "./toast";

interface ToastProviderProps {
  children: React.ReactNode;
}

/* istanbul ignore start -- Thin provider wrapper, mounted once at root */
/** Provider that enables toast notifications app-wide. Mount once at the root of your application inside `ThemeProvider`. */
function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
/* istanbul ignore end */

export { ToastProvider };
