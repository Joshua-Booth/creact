import { useEffect, useSyncExternalStore } from "react";
import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useTranslation } from "react-i18next";

import { SWRProvider } from "@/app/providers/SWRProvider";

import "@/app/styles/main.css";

import { Header } from "@/widgets/header";
import { ErrorBoundary } from "@/shared/ui/error-boundary";

import type { Route } from "./+types/root";
import {
  getLocale,
  i18nextMiddleware,
  localeCookie,
} from "./middleware/i18next";

export const middleware = [i18nextMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  // Context is a RouterContextProvider when middleware is enabled
  // Type assertion needed due to generated types not reflecting middleware
  const locale = getLocale(context as Parameters<typeof getLocale>[0]);
  return data(
    { locale },
    { headers: { "Set-Cookie": await localeCookie.serialize(locale) } }
  );
}

const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  return (
    <html lang={i18n.language} dir={i18n.dir(i18n.language)}>
      <head>
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
      <body>
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

export default function Root({ loaderData: { locale } }: Route.ComponentProps) {
  const hydrated = useHydrated();
  const { i18n } = useTranslation();

  // Sync client-side i18n with server-detected locale
  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return (
    <SWRProvider>
      <ErrorBoundary>
        <div id="app" data-hydrated={hydrated || undefined}>
          <Header />
          <Outlet />
        </div>
      </ErrorBoundary>
    </SWRProvider>
  );
}
