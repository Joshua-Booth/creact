import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useForm } from "react-hook-form";
import { connect, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";

// Actions
import { loginUser } from "actions/auth";

// Components
import Dashboard from "views/Dashboard";
import Error from "components/Error";

import LoginFields from "./fields";

// Constants
import { AuthUrls } from "constants/urls";

// Selectors
import { isAuthenticated } from "selectors/auth";
import { getError } from "selectors/main";

// Utilities
import { showAllErrors, hideAllErrors, resetErrorState } from "utils/error";
import { setPageTitle, Event, OutboundLink } from "utils/page";
import { Loader } from "utils/render";

/**
 * Component for logging in the user.
 *
 * @param {...object} props Component properties
 * @param {boolean} props.authenticated The authenticated state of the user
 * @param {object} props.error The error state
 * @param {object} props.history The history state for navigation
 * @returns {React.Component} The login component
 */
function Login({ authenticated, error, history }) {
  setPageTitle("Login");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onBlur",
  });

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) dispatch(resetErrorState());

    hideAllErrors();
  }, []);

  const onSubmit = (formValues) => {
    Event("LOGIN", "Log the user in to their account", "handleSubmit");
    setIsLoading(true);
    loginUser(formValues).then((response) => {
      setIsLoading(false);
      if (response) {
        history.push("/dashboard");
      } else {
        showAllErrors(error);
      }
    });
  };

  const onFieldChange = () => {
    hideAllErrors();
  };

  const renderForm = (submitError) => {
    return (
      <main className="content-container">
        <h1 className="pb-5">Log In</h1>

        <form
          className="page-box text-left z-0"
          style={{ maxWidth: "340px" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          {isLoading && (
            <div className="loader-modal">
              <Loader />
            </div>
          )}

          <LoginFields
            onFieldChange={onFieldChange}
            register={register}
            errors={errors}
            submitError={submitError}
          />

          <p title="Sign Up" className="mt-20">
            Not registered?{" "}
            <OutboundLink
              className="ml-2"
              to={AuthUrls.SIGNUP}
              eventLabel="Signup - Login page"
              aria-label="Signup"
            >
              Signup Here!
            </OutboundLink>
          </p>
        </form>
      </main>
    );
  };

  if (authenticated) {
    history.push("/dashboard");
    return <Dashboard />;
  }

  if (error && error.status) {
    if (error.status === 400) {
      return renderForm("Email or password is incorrect!");
    }
    return (
      <main className="content-container">
        <Error
          status={error.status}
          response={error.response}
          title={"Log In"}
        />
      </main>
    );
  } else {
    return renderForm();
  }
}

Login.propTypes = {
  /** The authenticated state of the user. */
  authenticated: PropTypes.bool,
  /** The current error state. */
  error: PropTypes.object,
  /** Object containing the app's history state. */
  history: PropTypes.object,
};

/**
 * Maps Redux store state to component props.
 *
 * @constant
 * @param {object} state The current Redux store state
 * @returns {object} The relevant state as the required props for the component
 */
const mapStateToProps = (state) => ({
  error: getError(state),
  authenticated: isAuthenticated(state),
});

export default withRouter(connect(mapStateToProps)(Login));
