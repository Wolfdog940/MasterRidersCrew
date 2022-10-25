import React from "react";

const Modal = ({ cambiarModo, texto }) => {
  return (
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{texto}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => {
                cambiarModo(false);
              }}
            ></button>
          </div>
          <div className="modal-body">
            <p>Tus datos se actualizaron correctamente!</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                cambiarModo(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
  );
};

export default Modal;