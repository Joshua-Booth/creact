/**
 * Possible values returned by feature flag hooks.
 * @public
 */
export type FeatureFlagValue = boolean | string | undefined;

/** Custom JSON payload attached to a feature flag. */
export interface FeatureFlagPayload {
  [key: string]: unknown;
}

/** Options for feature flag hooks. */
export interface FeatureFlagOptions<T = undefined> {
  /** Default value when flag is loading or undefined. */
  defaultValue?: T;
}
