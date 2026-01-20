import { useEffect } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { PostHogProvider } from "@/app/providers/PostHogProvider";
import { SWRProvider } from "@/app/providers/SWRProvider";
import "@/app/styles/main.css";
import { ErrorBoundary } from "@/shared/ui";
import { Header } from "@/widgets/header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="description" content="React Frontend" />
        <title>creact - A React Frontend</title>

        {/* PWA Configuration */}
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="React Frontend" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-title" content="React Frontend" />
        <meta name="application-name" content="React Frontend" />
        <meta name="msapplication-starturl" content="/" />

        {/* Site Icons */}
        <link rel="icon" type="image/x-icon" href="/icons/favicon.ico" />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="/icons/favicon.ico"
        />
        <link rel="apple-touch-icon" href="/icons/apple-icon-180x180.png" />
        <link rel="manifest" href="/manifest.json" />

        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div
          className="inline-block size-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="absolute! -m-px! h-px! w-px! overflow-hidden! border-0! p-0! whitespace-nowrap! [clip:rect(0,0,0,0)]!">
            Loading...
          </span>
        </div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function Root() {
  useEffect(() => {
    document.getElementById("app")?.setAttribute("data-hydrated", "true");
  }, []);

  return (
    <PostHogProvider>
      <SWRProvider>
        <ErrorBoundary>
          <div id="app">
            <Header />
            <Outlet />
          </div>
        </ErrorBoundary>
      </SWRProvider>
    </PostHogProvider>
  );
}
