import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/80 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-sm shadow-lg w-full max-w-md p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 text-2xl hover:text-slate-900 cursor-pointer"
        >
          <IoClose size={24} />
        </button>
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        <div className="space-y-3">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
