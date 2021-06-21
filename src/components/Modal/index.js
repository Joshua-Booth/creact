import React from "react";
import PropTypes from "prop-types";

// Components
import ModalHeader from "./Header";

/**
 * UpdateAlert component, displaying a modal for reloading the page to update
 * the service worker.
 *
 * @param {...object} props The component properties
 * @param {string} props.id The id of the modal
 * @param {string} props.description The body text of the modal
 * @param {string} props.submitLabel A label for the modal submit button
 * @param {Function} props.onSubmit A handler for the success modal button
 * @param {string} props.closeLabel A label for the modal close button
 * @param {Function} props.onClose A handler to close the modal
 * @returns {React.Component} The UpdateAlert component
 */
const Modal = ({
  id,
  description,
  submitLabel,
  onSubmit,
  closeLabel,
  onClose,
}) => {
  closeLabel ??= "Close";
  submitLabel ??= "Submit";

  // Default hide event handler
  const hideModal = () => {
    const modal = document.getElementById(id);
    modal.classList.add("hidden");
  };

  // Default submit event handler
  const submitModal = (e) => {
    e.preventDefault();
  };

  const hide = onClose || hideModal;
  const submit = onSubmit || submitModal;

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    const modal = document.getElementById(id);
    if (event.target == modal) {
      hideModal();
    }
  };

  return (
    <div
      className="modal flex items-center fixed left-0 top-0 bg-black bg-opacity-50 overflow-x-hidden overflow-y-auto outline-none h-full w-full z-50"
      id={id}
      tabIndex="-1"
      role="dialog"
      aria-labelledby={`${id}Label`}
    >
      <div
        className="modal-dialog relative w-auto mx-auto pointer-events-none"
        role="document"
      >
        <div className="modal-content relative flex flex-col rounded-lg pointer-events-auto w-full sm:w-96 bg-white border border-gray-300">
          <ModalHeader title="Update" id={id} closeHandler={hideModal} />
          <div className="modal-body flex-auto relative p-4 px-6">
            {description}
          </div>
          <div className="flex flex-shrink-0 flex-wrap center-items justify-center md:justify-end p-3 border-0">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={hide}
              aria-label={closeLabel}
              data-dismiss="modal"
            >
              {closeLabel}
            </button>
            <button
              type="button"
              className="btn btn-primary ml-3"
              onClick={submit}
              aria-label={submitLabel}
              data-testid={`${submitLabel.toLowerCase()}-button`}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  submitLabel: PropTypes.string,
  onSubmit: PropTypes.func,
  closeLabel: PropTypes.string,
  onClose: PropTypes.func,
};

export default Modal;
