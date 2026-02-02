import { data } from "react-router";

import { resources } from "@/shared/i18n";

import type { Route } from "./+types/locales";

export function loader({ params }: Route.LoaderArgs) {
  const { lng, ns } = params;

  // Validate language
  if (!lng || !(lng in resources)) {
    return data({ error: "Invalid language" }, { status: 400 });
  }

  const namespaces = resources[lng as keyof typeof resources];

  // Validate namespace
  if (!ns || !(ns in namespaces)) {
    return data({ error: "Invalid namespace" }, { status: 400 });
  }

  const headers = new Headers();

  // Add cache headers in production
  if (process.env.NODE_ENV === "production") {
    headers.set(
      "Cache-Control",
      // cspell:disable-next-line
      "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800"
    );
  }

  return data(namespaces[ns as keyof typeof namespaces], { headers });
}
