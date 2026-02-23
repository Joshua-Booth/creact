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
 * @param props - Component props
 * @param props.flag - Feature flag key to check
 * @param props.children - Content to show when flag is enabled
 * @param props.variant - Specific variant to match for multivariate flags
 * @param props.fallback - Content to show when flag is disabled
 * @param props.loading - Content to show while flag is loading
 * @returns Rendered children, fallback, or loading content based on flag state
 * @public
 * @example Boolean flag
 * ```tsx
 * <FeatureGate flag="new-dashboard" fallback={<OldDashboard />}>
 *   <NewDashboard />
 * </FeatureGate>
 * ```
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
