import { algoliasearch } from "algoliasearch";

const appId = import.meta.env.VITE_ALGOLIA_APP_ID;
const searchKey = import.meta.env.VITE_ALGOLIA_SEARCH_KEY;
const indexName = import.meta.env.VITE_ALGOLIA_INDEX_NAME;

export const algoliaClient = algoliasearch(appId, searchKey);

export const ALGOLIA_INDEX_NAME = indexName;
