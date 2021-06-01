import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

// Actions
import { fetchUserProfile } from "actions/auth";
/* Import your core actions below */
// import { yourfetchAction } from "actions/core";

// Components
/* Import your components here */

import Error from "components/Error";

// Selectors
import { getUser, isLoadingUser } from "selectors/auth";
/* Import your core selectors below */
// import { yourSelector } from "selectors/core";
import { getError } from "selectors/main";

// Utilities
import { resetErrorState, isObjectEmpty } from "utils/error";
import { setPageTitle } from "utils/page";
import { Loader } from "utils/render";

/**
 * Component for displaying the user's dashboard.
 *
 * @returns {React.Component} The dashboard component
 */
function Dashboard() {
  setPageTitle("Dashboard");

  const user = useSelector(getUser);
  const error = useSelector(getError);
  const loadingUser = useSelector(isLoadingUser);
  const isLoading = loadingUser;
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      dispatch(resetErrorState());
    }

    if (!user || (user && isObjectEmpty(user) && !loadingUser)) {
      dispatch(fetchUserProfile());
    }
  }, []);

  return (
    <main className="content-container">
      <h1 className="pb-1">Dashboard</h1>

      {user && !isObjectEmpty(user) && (
        <div className="component-container"></div>
      )}

      {(isLoading || !(!isObjectEmpty(user) || error)) && <Loader />}

      {error && error.status && (
        <div className="pt-4">
          <Error status={error.status} response={error.response} />
        </div>
      )}
    </main>
  );
}

export default Dashboard;
