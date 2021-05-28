import React from "react";

import { Switch, Route } from "react-router-dom";

// Helper Components
import RequireAuth from "components/RequireAuth";

// View Components
import Dashboard from "views/Dashboard";
import Landing from "views/Landing";
import Login from "views/Login";
import Logout from "views/Logout";
import NoMatch from "views/NoMatch";

/**
 * Container for app routes.
 *
 * @function
 * @returns {React.Component} The router component
 */
const Router = () => (
  <>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/dashboard" component={RequireAuth(Dashboard)} />
      <Route component={NoMatch} />
    </Switch>
  </>
);

export default Router;
