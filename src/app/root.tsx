import { useEffect, useSyncExternalStore } from "react";
import {
  data,
  href,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteLoaderData,
} from "react-router";
import { useTranslation } from "react-i18next";

import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";

import { SWRProvider } from "@/app/providers/swr-provider";
import { Header } from "@/widgets/header";
import {
  generateMeta,
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
} from "@/shared/lib/seo";
import { DirectionProvider } from "@/shared/ui/direction";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { JsonLd } from "@/shared/ui/json-ld";
import { ToastProvider } from "@/shared/ui/toast";

import type { Route } from "./+types/root";
import {
  getLocale,
  i18nextMiddleware,
  localeCookie,
} from "./middleware/i18next";
import { themeSessionResolver } from "./sessions.server";

import "@/app/styles/globals.css";

export const middleware = [i18nextMiddleware];

export function meta() {
  return generateMeta({
    title: "Creact",
    description: "A modern React frontend template with SSR support.",
  });
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const { getTheme } = await themeSessionResolver(request);
  // Context is a RouterContextProvider when middleware is enabled
  // Type assertion needed due to generated types not reflecting middleware
  const locale = getLocale(context);
  return data(
    { locale, theme: getTheme() },
    { headers: { "Set-Cookie": await localeCookie.serialize(locale) } }
  );
}

/** Root loader data type for use in child route meta functions */
export type RootLoaderData = Awaited<ReturnType<typeof loader>>["data"];

function noop() {
  // Intentionally empty - used as a stable no-op callback reference
}
function emptySubscribe() {
  return noop;
}
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function InnerLayout({
  children,
  ssrTheme,
}: {
  children: React.ReactNode;
  ssrTheme: boolean;
}) {
  const { i18n } = useTranslation();
  const [theme] = useTheme();

  return (
    <html
      lang={i18n.language}
      dir={i18n.dir(i18n.language)}
      className={theme ?? ""}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />

        {/* JSON-LD Structured Data */}
        <JsonLd data={generateOrganizationJsonLd()} />
        <JsonLd data={generateWebSiteJsonLd()} />

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

        <PreventFlashOnWrongTheme ssrTheme={ssrTheme} />
        <Meta />
        <Links />
      </head>
      <body className="relative">
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <DirectionProvider direction={i18n.dir(i18n.language)}>
          <ToastProvider>
            {/* We need to set relative on the body for iOS Safari 26 and isolate for portals to work properly
                See: https://base-ui.com/react/overview/quick-start#set-up
            */}
            <div className="relative isolate flex min-h-svh flex-col">
              {children}
            </div>
          </ToastProvider>
        </DirectionProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  return (
    <ThemeProvider
      specifiedTheme={data?.theme ?? null}
      themeAction={href("/action/set-theme")}
    >
      <InnerLayout ssrTheme={Boolean(data?.theme)}>{children}</InnerLayout>
    </ThemeProvider>
  );
}

export function HydrateFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div
          className="inline-block size-8 animate-spin rounded-full border-4
            border-solid border-current border-r-transparent align-[-0.125em]
            motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span
            className="absolute! -m-px! size-px! overflow-hidden! border-0! p-0!
              whitespace-nowrap! [clip:rect(0,0,0,0)]!"
          >
            Loading...
          </span>
        </div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

const AUTH_ROUTES = new Set([href("/login"), href("/signup")]);

export default function Root({ loaderData: { locale } }: Route.ComponentProps) {
  const hydrated = useHydrated();
  const { i18n } = useTranslation();
  const { pathname } = useLocation();

  // Sync client-side i18n with server-detected locale
  useEffect(() => {
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return (
    <SWRProvider>
      <ErrorBoundary>
        <div id="app" data-hydrated={hydrated || undefined}>
          {!AUTH_ROUTES.has(pathname) && <Header />}
          <Outlet />
        </div>
      </ErrorBoundary>
    </SWRProvider>
  );
}
