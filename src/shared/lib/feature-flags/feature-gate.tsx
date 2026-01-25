import type { ReactNode } from "react";

import type { FeatureFlagKey } from "./keys";
import { useFeatureFlag, useFeatureFlagVariant } from "./use-feature-flags";

interface FeatureGateProps {
  /** Feature flag key to check. */
  flag: FeatureFlagKey;
  /** Content to show when flag is enabled (or matches variant). */
  children: ReactNode;
  /** Specific variant to match (for multivariate flags). */
  variant?: string;
  /** Content to show when flag is disabled. */
  fallback?: ReactNode;
  /** Content to show while flag is loading. */
  loading?: ReactNode;
}

/**
 * Declarative component for conditional rendering based on feature flags.
 *
 * @example Boolean flag
 * ```tsx
 * <FeatureGate flag="new-dashboard" fallback={<OldDashboard />}>
 *   <NewDashboard />
 * </FeatureGate>
 * ```
 *
 * @example Multivariate flag
 * ```tsx
 * <FeatureGate flag="pricing-test" variant="discount">
 *   <DiscountBanner />
 * </FeatureGate>
 * ```
 */
export function FeatureGate({
  flag,
  children,
  variant,
  fallback = null,
  loading = null,
}: FeatureGateProps) {
  const isEnabled = useFeatureFlag(flag);
  const currentVariant = useFeatureFlagVariant(flag);

  if (isEnabled === undefined) {
    return <>{loading}</>;
  }

  if (variant !== undefined) {
    return currentVariant === variant ? <>{children}</> : <>{fallback}</>;
  }

  return isEnabled ? <>{children}</> : <>{fallback}</>;
}
