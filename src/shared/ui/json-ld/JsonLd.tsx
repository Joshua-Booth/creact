interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

/**
 * Renders JSON-LD structured data as a script tag.
 * @param props - Component props
 * @param props.data - JSON-LD data object to serialize
 * @returns Script element with JSON-LD data
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- Safe: JSON.stringify escapes content
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
