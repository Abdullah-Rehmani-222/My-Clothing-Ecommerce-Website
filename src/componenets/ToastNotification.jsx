import React from 'react'

const ToastNotification = ({ message, close, isActive }) => {
  return (
    <>
      <div className={`toast-notification ${isActive ? "active" : ""}`}>
        <div className="right-side">
          <i className="fa-solid fa-circle-check tick"></i>
          <p>{message}</p>
        </div>
        <button className="cross" onClick={close}>&#10005;</button>
      </div>
    </>
  );
};

export default ToastNotification