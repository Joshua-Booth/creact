import { algoliasearch } from "algoliasearch";

const appId = import.meta.env.VITE_ALGOLIA_APP_ID;
const searchKey = import.meta.env.VITE_ALGOLIA_SEARCH_KEY;
const indexName = import.meta.env.VITE_ALGOLIA_INDEX_NAME;

// Only create client if credentials are configured
export const algoliaClient =
  appId && searchKey ? algoliasearch(appId, searchKey) : null;

export const ALGOLIA_INDEX_NAME = indexName ?? "";
