/**
 * Known feature flag keys. Add new flags here for type safety and autocomplete.
 * @example
 * ```ts
 * export type FeatureFlagKey =
 *   | "new-dashboard"
 *   | "pricing-experiment";
 * ```
 */
export type FeatureFlagKey =
  // Add your feature flags here
  "example-flag";

/**
 * Accepts known flags with autocomplete, plus arbitrary strings for dynamic keys.
 * @public
 */
// eslint-disable-next-line sonarjs/no-useless-intersection -- Intentional pattern for autocomplete with arbitrary strings
export type ExtendedFlagKey = FeatureFlagKey | (string & {});
