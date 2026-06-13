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
 *
 * Falls back to `defaultValue` while flags are still loading or when the flag is
 * absent, so the value is stable from the first render with no `undefined`
 * flicker. Supplying a `defaultValue` narrows the return type to `boolean`; omit
 * it to get `boolean | undefined`.
 * @param key - Feature flag key to check
 * @param options - Configuration including optional defaultValue
 * @returns Whether the feature flag is enabled
 * @example
 * ```tsx
 * const isEnabled = useFeatureFlag("new-feature", { defaultValue: false });
 * return isEnabled ? <NewFeature /> : <OldFeature />;
 * ```
 */
export function useFeatureFlag(
  key: FeatureFlagKey,
  options: FeatureFlagOptions<boolean> & { defaultValue: boolean }
): boolean;
export function useFeatureFlag(
  key: FeatureFlagKey,
  options?: FeatureFlagOptions<boolean>
): boolean | undefined;
export function useFeatureFlag(
  key: FeatureFlagKey,
  options?: FeatureFlagOptions<boolean>
): boolean | undefined {
  return useFeatureFlagEnabled(key) ?? options?.defaultValue;
}

/**
 * Get the variant key for multivariate/A/B test flags.
 * @param key - Feature flag key to check
 * @param options - Configuration including optional defaultValue
 * @returns The variant key string, or undefined while loading
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
 * @param key - Feature flag key to check
 * @param options - Configuration including optional defaultValue
 * @returns The payload data, or undefined while loading
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
 * @returns Array of active feature flag keys
 * @public
 * @example
 * ```tsx
 * const activeFlags = useActiveFlags();
 * console.log("Active flags:", activeFlags);
 * ```
 */
export const useActiveFlags = (): string[] => {
  return useActiveFeatureFlags();
};
