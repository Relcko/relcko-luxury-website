/**
 * JSON-LD Server Component — Luxury Real Estate Website
 *
 * Renders structured data scripts server-side.
 * Used in root layout and page layouts.
 */

import type { WithContext, JsonLdObject } from 'schema-dts';

interface JsonLdProps<T extends JsonLdObject = JsonLdObject> {
  data: WithContext<T>;
}

/**
 * Server component to render JSON-LD structured data
 */
export function JsonLd<T extends JsonLdObject = JsonLdObject>({ data }: JsonLdProps<T>) {
  const json = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export default JsonLd;
