import React from "react";
import PropTypes from "prop-types";

import { connectSearchBox } from "react-instantsearch-dom";
import { SearchIcon, TimesIcon } from "react-line-awesome";

/**
 * Default search submit action.
 *
 * @param {object} e The onSubmit event of the input element
 */
const onSearchSubmit = (e) => {
  e.preventDefault();
};

const onChange = (e, refine) => {
  refine(e.currentTarget.value);

  const resetButton = document.querySelector(
    `.ais-SearchBox-form .ais-SearchBox-reset`
  );
  if (!e.currentTarget.value) {
    resetButton.classList.add("hidden");
  } else {
    resetButton.classList.remove("hidden");
  }
};

/**
 * Custom SearchBox component for the search bar.
 *
 * @param {...object} props Component properties
 * @param {string} props.id The id of the search input
 * @param {string} props.currentRefinement The current search query
 * @param {string} props.refine The refinement of the search
 * @param {Function} props.onSubmit The search input submit handler
 * @param {Function} props.onReset The search input reset handler
 * @returns {React.Component} The search box (form element)
 */
const SearchBox = ({
  id,
  currentRefinement,
  refine,
  onSubmit = onSearchSubmit,
  onReset,
}) => (
  <form
    className="ais-SearchBox-form"
    noValidate
    onSubmit={onSubmit}
    role="search"
  >
    <input
      id={id}
      className="ais-SearchBox-input"
      type="search"
      aria-label="Search content here..."
      value={currentRefinement}
      onChange={(e) => onChange(e, refine)}
      placeholder="Search..."
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      maxLength="80"
      data-hj-allow
    />
    <button
      type="submit"
      title="Submit your search query."
      className="ais-SearchBox-submit"
    >
      <SearchIcon className="la-xs search-icon" />
    </button>
    <button
      type="reset"
      title="Clear the search query."
      className="ais-SearchBox-reset hidden"
      onClick={onReset}
    >
      <TimesIcon className="la-xs search-icon" />
    </button>
  </form>
);

SearchBox.propTypes = {
  /** The id of the input. */
  id: PropTypes.string,
  /** The current query. */
  currentRefinement: PropTypes.string,
  /** Changes the current query. */
  refine: PropTypes.func,
  /** The function to run when search has been submitted. */
  onSubmit: PropTypes.func,
  /** The function to run when search has been reset. */
  onReset: PropTypes.func,
};

export default connectSearchBox(SearchBox);
