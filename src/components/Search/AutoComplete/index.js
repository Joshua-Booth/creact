import React, { Component } from "react";
import PropTypes from "prop-types";
import AutoSuggest from "react-autosuggest";

import { Snippet, connectAutoComplete } from "react-instantsearch-dom";
import { SearchIcon } from "react-line-awesome";
import { withRouter } from "react-router-dom";

// Components
import Highlight from "./Highlight";

// Styles
import "instantsearch.css/themes/reset.css";
import "./styles.scss";

// Utilities
import { searchStateToUrl } from "utils/search";

/**
 * Autocomplete corner site search bar.
 *
 * @extends Component React class component
 */
class AutoComplete extends Component {
  state = {
    value: this.props.currentRefinement,
  };

  onChange = (_event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.props.refine(value);
  };

  onSuggestionsClearRequested = () => {
    this.props.refine();
  };

  getSuggestionValue(hit) {
    return hit.title;
  }

  onSearchSubmit = (e) => {
    e.preventDefault();
    document.activeElement.blur();

    const dropDown = document.querySelector(
      ".react-autosuggest__suggestions-container"
    );
    dropDown.style.display = "none";

    const searchUrl = searchStateToUrl({ query: this.state.value });
    this.props.history.push(searchUrl);

    if (this.props.location.pathname === "/search") {
      const input = document.querySelector("#search-box");
      input.value = this.state.value;
    }
  };

  renderSuggestionsContainer = ({ containerProps, children }) => {
    return (
      <>
        <div {...containerProps}>
          <div className="scroll-container scroll-bar">{children}</div>
          <button
            className="btn block text-primary mx-auto text-center"
            onClick={this.onSearchSubmit}
            aria-label="View more results"
          >
            View more results
          </button>
        </div>
      </>
    );
  };

  renderInputComponent = (inputProps) => (
    <form
      role="search"
      className="page search-bar"
      onSubmit={this.onSearchSubmit}
    >
      <input
        id="corner-search"
        {...inputProps}
        aria-label="Auto-complete site search"
        role="searchbox"
        data-hj-allow
      />
      <SearchIcon className="la-xs search-icon" onClick={this.onSearchSubmit} />
    </form>
  );

  renderSuggestion(hit) {
    const url = `${window.location.origin}/${hit.url}`;
    return (
      <a href={url} className="hit-link" aria-label={hit.title}>
        <div className="hit">
          <div className="hit-content auto-complete">
            <div className="hit-title">
              <Highlight attribute="title" hit={hit} tagName="mark" />
            </div>
            <div className="hit-description">
              <Snippet attribute="description" hit={hit} tagName="mark" />
            </div>
            <div className="hit-text-content">
              <Snippet attribute="content" hit={hit} tagName="mark" />
            </div>
          </div>
        </div>
      </a>
    );
  }

  renderSectionTitle() {
    return null;
  }

  getSectionSuggestions(section) {
    return section.hits;
  }

  render() {
    const { hits, onSuggestionSelected } = this.props;
    const { value } = this.state;

    const inputProps = {
      placeholder: "Search",
      onChange: this.onChange,
      value,
      type: "search",
    };

    return (
      <AutoSuggest
        suggestions={hits}
        multiSection={true}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={this.getSuggestionValue}
        renderInputComponent={this.renderInputComponent}
        renderSuggestion={this.renderSuggestion}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        inputProps={inputProps}
        renderSectionTitle={this.renderSectionTitle}
        getSectionSuggestions={this.getSectionSuggestions}
      />
    );
  }
}

AutoComplete.propTypes = {
  /** The records that matched the search. */
  hits: PropTypes.array.isRequired,
  /** Will be called every time suggestion is selected via mouse or keyboard. */
  onSuggestionSelected: PropTypes.func,
  /** The current query. */
  currentRefinement: PropTypes.string,
  /** Changes the query. */
  refine: PropTypes.func,
  /** Current window location object. */
  location: PropTypes.object.isRequired,
  /** Browser history object. */
  history: PropTypes.object.isRequired,
};

export default withRouter(connectAutoComplete(AutoComplete));
