/** Page meta configuration for generating meta tags */
export interface PageMeta {
  /** Page title (will be appended with site name) */
  title: string;
  /** Page description for search engines and social cards */
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  /** Article type for Open Graph (optional) */
  type?: "website" | "article";
  /** Whether to prevent indexing */
  noIndex?: boolean;
}

export interface MetaDescriptor {
  title?: string;
  name?: string;
  property?: string;
  content?: string;
  tagName?: "link";
  rel?: string;
  href?: string;
}
