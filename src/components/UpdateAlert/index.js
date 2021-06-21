import React from "react";

// Components
import Modal from "components/Modal";

/**
 * UpdateAlert component, displaying a modal for reloading the page to update
 * the service worker.
 *
 * @returns {React.Component} The UpdateAlert component
 */
const UpdateAlert = () => {
  const id = "updateModal";
  const description = "There is a new update available!";
  const submitLabel = "Update";

  const update = (e) => {
    e.preventDefault();
    window.location.reload(true);
  };

  return (
    <Modal
      id={id}
      description={description}
      onSubmit={update}
      submitLabel={submitLabel}
    />
  );
};

export default UpdateAlert;
