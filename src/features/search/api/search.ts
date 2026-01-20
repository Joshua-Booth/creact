import { algoliaClient, ALGOLIA_INDEX_NAME } from "@/shared/config/algolia";

export interface SearchHit {
  objectID: string;
  title: string;
  description?: string;
  url?: string;
  [key: string]: unknown;
}

export interface SearchResult {
  hits: SearchHit[];
  nbHits: number;
  query: string;
}

export async function search(query: string): Promise<SearchResult> {
  if (!query.trim()) {
    return { hits: [], nbHits: 0, query };
  }

  const { results } = await algoliaClient.search<SearchHit>({
    requests: [
      {
        indexName: ALGOLIA_INDEX_NAME,
        query,
        hitsPerPage: 10,
      },
    ],
  });

  const result = results[0];

  if (result && "hits" in result) {
    return {
      hits: result.hits,
      nbHits: result.nbHits ?? 0,
      query,
    };
  }

  return { hits: [], nbHits: 0, query };
}
