interface JsonLdProps<T extends object> {
  data: T;
}

/* istanbul ignore start @preserve -- Renders in document <head>, not reachable in Storybook body */
/** Injects a JSON-LD structured data script tag into the page for SEO. */
export function JsonLd<T extends object>({ data }: JsonLdProps<T>) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- Safe: JSON.stringify + \u003c escaping prevents script injection
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replaceAll("<", "\\u003c"),
      }}
    />
  );
}
/* istanbul ignore end @preserve */
