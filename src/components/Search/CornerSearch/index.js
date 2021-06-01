import React from "react";

import { InstantSearch, Index, Configure } from "react-instantsearch-dom";

// Components
import AutoComplete from "components/Search/AutoComplete";

// Utilities
import { searchClient, ENV } from "utils/search";

/**
 * Search component for the corner of the site.
 *
 * @returns {React.Component} The corner search component
 */
function CornerSearch() {
  return (
    <InstantSearch indexName={`Knowledge_${ENV}`} searchClient={searchClient}>
      <Configure hitsPerPage={3} />
      <AutoComplete />
      <Index indexName={`Knowledge_${ENV}`} />
      <Index indexName={`App_${ENV}`} />
      <Index indexName="SitePages" />
    </InstantSearch>
  );
}

export default CornerSearch;
