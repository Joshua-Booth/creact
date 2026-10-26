import i18next from "i18next";
import { HTTPError } from "ky";

interface ApiErrorField {
  readonly key: string;
  readonly shape: "list" | "text";
}

/**
 * Turn a failed ky call into the message a form shows.
 * The caller picks field order and the empty-body message. Transport cases live here.
 * @param error - Whatever the request threw.
 * @param options - Field order, the empty-body message, and the console prefix.
 * @param options.fields - Body keys to try, in order. `list` reads the first item. `text` reads the value. A field whose value isn't a string is skipped.
 * @param options.fallback - Message when the body has none of those fields.
 * @param options.logLabel - Prefix for the non-HTTP console line, such as `[Login]`.
 * @returns The message to show.
 */
export function apiErrorMessage(
  error: unknown,
  options: {
    readonly fields: readonly ApiErrorField[];
    readonly fallback: string;
    readonly logLabel: string;
  }
): string {
  if (!(error instanceof HTTPError)) {
    console.error(`${options.logLabel} Non-HTTP error:`, error);
    if (error instanceof DOMException && error.name === "AbortError") {
      return i18next.t("errors.api.requestTimeout");
    }
    if (error instanceof TypeError) {
      return i18next.t("errors.api.networkError");
    }
    return i18next.t("errors.api.unexpectedError");
  }

  const body: unknown = error.data;
  if (typeof body === "object" && body !== null) {
    const message = readBody(body, options.fields);
    if (message !== undefined) return message;
    return options.fallback;
  }

  return i18next.t("errors.api.serverError", {
    status: String(error.response.status),
  });
}

function readBody(
  body: object,
  fields: readonly ApiErrorField[]
): string | undefined {
  const record = body as Record<string, unknown>;
  for (const field of fields) {
    const value = record[field.key];
    const picked = field.shape === "list" ? firstItem(value) : value;
    if (typeof picked === "string") return picked;
  }
  return undefined;
}

function firstItem(value: unknown): unknown {
  return Array.isArray(value) ? value[0] : undefined;
}
