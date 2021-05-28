import { actions as notifActions } from "redux-notifications";

const { notifSend } = notifActions;

export const updateProfileSuccess = () =>
  notifSend({
    message: "Your profile has been updated successfully",
    kind: "info",
    dismissAfter: 5000,
  });

export const updateProfileFailed = () =>
  notifSend({
    message: "Failed to edit profile",
    kind: "danger",
    dismissAfter: 5000,
  });

export const updateProfileUnavailable = () =>
  notifSend({
    message: "Profile could not be edited, please try again later",
    kind: "danger",
    dismissAfter: 5000,
  });
