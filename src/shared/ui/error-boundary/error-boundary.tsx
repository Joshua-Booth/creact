import { Component } from "react";
import { useTranslation } from "react-i18next";

import type { ErrorInfo, ReactNode } from "react";
import * as Sentry from "@sentry/react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "../button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../empty";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component that catches JavaScript errors anywhere in the
 * child component tree, logs them to Sentry, and displays a fallback UI.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  /* istanbul ignore start @preserve -- Reset handler only triggered via user interaction on fallback UI */
  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };
  /* istanbul ignore end @preserve */

  // eslint-disable-next-line sonarjs/function-return-type -- Error boundaries need conditional rendering by design
  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback != null) {
        return this.props.fallback;
      }

      return <ErrorFallback onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  onReset: () => void;
}

/** Default fallback UI rendered when the ErrorBoundary catches an error. */
function ErrorFallback({ onReset }: ErrorFallbackProps) {
  const { t } = useTranslation();

  return (
    <Empty className="min-h-100">
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="bg-destructive/10 text-destructive rounded-full"
        >
          <AlertTriangle />
        </EmptyMedia>
        <EmptyTitle>{t("errors.boundaryError")}</EmptyTitle>
        <EmptyDescription>
          {t("errors.boundaryErrorDescription")}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onReset} variant="outline">
          <RefreshCw />
          {t("errors.tryAgain")}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
