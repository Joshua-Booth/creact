import React from "react";
import PropTypes from "prop-types";

/**
 * The header section of the modal.
 *
 * @param {...object} props The component properties
 * @param {string} props.title The title of the modal
 * @param {string} props.id The id of the modal
 * @param {Function} props.closeHandler A handler to close the modal
 * @returns {React.Component} The ModalHeader component
 */
function ModalHeader({ title, id, closeHandler }) {
  return (
    <div className="modal-header flex items-center justify-between flex-shrink-0 p-4 border-b border-gray-300">
      <h5 className="modal-title" id={`${id}Label`}>
        {title}
      </h5>

      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={closeHandler}
      ></button>
    </div>
  );
}

ModalHeader.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
};

export default ModalHeader;
