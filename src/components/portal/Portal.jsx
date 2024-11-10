import React from "react";
import ReactDOM from "react-dom";

const Portal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out`}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 relative h-[85%] w-[85%] overflow-y-auto transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng khi click vào nội dung dialog
      >
        {/* Nút đóng */}
        <button
          className="absolute top-2 right-2 text-gray-600 flex items-center justify-center hover:bg-red-700 transition duration-300 ease-in-out"
          onClick={() => onClose()}
        >
          &times;
        </button>

        {/* Nội dung dialog */}
        <div>{children}</div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};

export default Portal;
