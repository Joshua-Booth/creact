import {
  useActiveFeatureFlags,
  useFeatureFlagEnabled,
  useFeatureFlagPayload,
  useFeatureFlagVariantKey,
} from "@posthog/react";

import type { FeatureFlagKey } from "./keys";
import type { FeatureFlagOptions, FeatureFlagPayload } from "./types";

/**
 * Check if a boolean feature flag is enabled.
 * Returns `undefined` while loading, or falls back to `defaultValue`.
 *
 * @example
 * ```tsx
 * const isEnabled = useFeatureFlag("new-feature", { defaultValue: false });
 * return isEnabled ? <NewFeature /> : <OldFeature />;
 * ```
 */
export const useFeatureFlag = (
  key: FeatureFlagKey,
  options?: FeatureFlagOptions<boolean>
): boolean | undefined => {
  const enabled = useFeatureFlagEnabled(key);
  return enabled ?? options?.defaultValue;
};

/**
 * Get the variant key for multivariate/A/B test flags.
 *
 * @example
 * ```tsx
 * const variant = useFeatureFlagVariant("pricing-test", { defaultValue: "control" });
 * return variant === "discount" ? <DiscountPrice /> : <StandardPrice />;
 * ```
 */
export const useFeatureFlagVariant = (
  key: FeatureFlagKey,
  options?: FeatureFlagOptions<string>
): string | undefined => {
  const variant = useFeatureFlagVariantKey(key);
  if (typeof variant === "string") {
    return variant;
  }
  return options?.defaultValue;
};

/**
 * Get custom JSON payload attached to a feature flag.
 *
 * @public
 * @example
 * ```tsx
 * interface Config { maxItems: number }
 * const config = useFeatureFlagConfig<Config>("feature-config");
 * return <List max={config?.maxItems ?? 10} />;
 * ```
 */
export const useFeatureFlagConfig = <T = FeatureFlagPayload>(
  key: FeatureFlagKey,
  options?: FeatureFlagOptions<T>
): T | undefined => {
  const payload = useFeatureFlagPayload(key);
  return (payload as T | undefined) ?? options?.defaultValue;
};

/**
 * Get all currently active feature flag keys. Useful for debugging.
 *
 * @public
 * @example
 * ```tsx
 * const activeFlags = useActiveFlags();
 * console.log("Active flags:", activeFlags);
 * ```
 */
export const useActiveFlags = (): string[] => {
  return useActiveFeatureFlags() ?? [];
};
