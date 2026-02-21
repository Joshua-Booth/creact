type TokenProvider = () => string | null;

let _getToken: TokenProvider = () => null;

/**
 * Register a function that returns the current auth token.
 * Call once at app startup from the entities layer.
 * @param provider - A function returning the current token or null.
 */
export function configureTokenProvider(provider: TokenProvider): void {
  _getToken = provider;
}

/**
 * Retrieve the current auth token via the configured provider.
 * @returns The current token, or null when no provider is configured or no token exists.
 */
export function getToken(): string | null {
  return _getToken();
}
