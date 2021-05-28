import { combineReducers } from "redux";
import { reducer as notifReducer } from "redux-notifications";

// Constants
import { AuthTypes } from "constants/actionTypes";

// Reducers
import { default as authReducer } from "./auth";
import { default as coreReducer } from "./core";
import { default as mainReducer } from "./main";

const appReducer = combineReducers({
  notifs: notifReducer,
  auth: authReducer,
  core: coreReducer,
  main: mainReducer,
});

const rootReducer = (state, action) => {
  if (action.type === AuthTypes.LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
