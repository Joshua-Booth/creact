import React from "react";

/**
 * UpdateAlert component, displaying a modal for reloading the page to update
 * the service worker.
 *
 * @returns {React.Component} The UpdateAlert component
 */
const UpdateAlert = () => {
  const update = (e) => {
    e.preventDefault();
    window.location.reload(true);
  };

  const hideModal = () => {
    const modal = document.getElementById("updateModal");
    modal.classList.remove("show", "d-block");
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    const modal = document.getElementById("updateModal");
    if (event.target == modal) {
      hideModal();
    }
  };

  return (
    <div
      className="modal fade show d-block"
      id="updateModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="updateModalLabel"
    >
      <div className="modal-dialog modal-dialog--center" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="updateModalLabel">
              Update
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={hideModal}
            ></button>
          </div>
          <div className="modal-body">There is a new update available!</div>
          <div className="modal-footer border-0">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={hideModal}
              aria-label="Close"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={update}
              aria-label="Update"
              data-testid="update-button"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAlert;
