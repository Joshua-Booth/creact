import React, { Component } from "react";
import PropTypes from "prop-types";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

// Selectors
import { isAuthenticated } from "selectors/auth";

/**
 * Require authentication wrapper for view components.
 *
 * @param {React.Component} ComposedComponent The component to manipulate
 * @returns {React.Component} The newly wrapped component
 */
export default function (ComposedComponent) {
  /**
   * Component for making components require authentication.
   *
   * @extends Component React class component
   * @returns {React.Component} The composed component with props
   */
  class Authentication extends Component {
    static propTypes = {
      /** Object containing the app's history state. */
      history: PropTypes.object,
    };

    componentDidMount() {
      this.checkAuthentication(this.props);
    }

    componentDidUpdate(nextProps) {
      this.checkAuthentication(nextProps);
    }

    checkAuthentication(props) {
      if (!props.authenticated) {
        this.props.history.push("/login");
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  /**
   * Maps Redux store state to component props.
   *
   * @constant
   * @param {object} state The current Redux store state
   * @returns {object} The relevant state as the required props for the component
   */
  const mapStateToProps = (state) => ({
    authenticated: isAuthenticated(state),
  });

  return withRouter(connect(mapStateToProps)(Authentication));
}
