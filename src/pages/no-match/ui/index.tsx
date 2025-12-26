import { useRouteError, isRouteErrorResponse } from "react-router";

export default function NoMatch() {
  const error = useRouteError();

  return (
    <main className="mx-2 mb-12 pb-2 text-center max-md:pb-6 max-sm:pb-2">
      <h1 className="pb-1">404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      {isRouteErrorResponse(error) && (
        <p>
          {error.status}: {error.statusText}
        </p>
      )}
    </main>
  );
}
