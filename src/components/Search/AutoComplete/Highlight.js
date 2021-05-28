import React from "react";
import PropTypes from "prop-types";

import { connectHighlight } from "react-instantsearch-dom";

/**
 * Custom highlight component for search results.
 *
 * @param {...object} props Component properties
 * @param {Function} props.highlight Function for parsing the hit for highlighting
 * @param {string} props.attribute The attribute of the record to highlight
 * @param {object} props.hit The original hit object, given from Hits
 * @returns {React.Component} The highlight component
 */
function Highlight({ highlight, attribute, hit }) {
  const parsedHit = highlight({
    highlightProperty: "_highlightResult",
    attribute,
    hit,
  });

  return (
    <span>
      {parsedHit.map((part, index) =>
        part.isHighlighted ? (
          <mark key={index}>{part.value}</mark>
        ) : (
          <span key={index}>{part.value}</span>
        )
      )}
    </span>
  );
}

Highlight.propTypes = {
  /**
   * Function to which you provide the property which contains the highlighting.
   */
  highlight: PropTypes.func.isRequired,
  /** The attribute of the record to highlight. */
  attribute: PropTypes.string.isRequired,
  /** The original hit object, given from Hits. */
  hit: PropTypes.object.isRequired,
};

export default connectHighlight(Highlight);
