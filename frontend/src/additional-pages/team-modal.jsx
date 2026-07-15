import React from "react";
import { FaTimes, FaInfoCircle } from "react-icons/fa";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center max-md:bg-teal-900/50 bg-teal-900/80 bg-opacity-30">
      <div className="bg-white mx-2 rounded-2xl w-full max-w-md relative shadow-xl animate-fade-in ">
        
        <div className="flex items-center justify-between p-3 gap-2 text-teal-700">
          <div className="flex items-center justify-center gap-2">
            <FaInfoCircle className="text-xl" />
            <h2 className="text-lg font-bold">Ma’lumotnoma</h2>
          </div>
          <button
            onClick={onClose}
            className="text-teal-600 hover:text-teal-800 text-2xl cursor-pointer"
            aria-label="Close Modal"
          >
            <FaTimes />
          </button>
        </div>
        <div className="text-teal-800 p-4 text-sm">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
