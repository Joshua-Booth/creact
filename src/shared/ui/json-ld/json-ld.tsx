interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- JSON-LD schemas are arbitrary nested objects
  data: Record<string, any>;
}

/* v8 ignore start -- Renders in document <head>, not reachable in Storybook body */
/** Injects a JSON-LD structured data script tag into the page for SEO. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- Safe: JSON.stringify escapes content
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
/* v8 ignore stop */
