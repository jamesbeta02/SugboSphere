import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, destination }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>{destination.name}</h2>
                <img src={destination.image} alt={destination.name} />
                <p>{destination.detailedInfo.overview}</p>
                <p>{destination.detailedInfo.culturalSignificance}</p>
                <p>{destination.detailedInfo.architecture}</p>
                <p>{destination.detailedInfo.currentStatus}</p>
                <p>{destination.detailedInfo.visitorInfo}</p>
            </div>
        </div>
    );
};

export default Modal;