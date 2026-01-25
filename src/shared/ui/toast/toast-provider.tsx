import { Toaster } from "./toast";

interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that enables toast notifications throughout the app.
 * Mount once at the root of your application inside ThemeProvider.
 *
 * @example
 * ```tsx
 * import { ToastProvider } from "@/shared/ui/toast";
 *
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}

export { ToastProvider };
