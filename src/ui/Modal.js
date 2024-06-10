// Import necessary React module and styles
import React from 'react';
import './modal.css';

// Define the Modal component
function Modal({ show, onClose, children }) {
    // If the modal is not supposed to be shown, return null to render nothing
    if (!show) {
        return null;
    }

    // Render the modal overlay and content
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {/* Close button */}
                <button className="modal-close" onClick={onClose}>×</button>
                {/* Render any children passed to the modal */}
                {children}
            </div>
        </div>
    );
}

export default Modal;
