import { useEffect } from "react";

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if(!isOpen) return;

    const handleEsc = (e) => {
      if(e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div onClick={onClose}
        className="absolute inset-0 bg-black/50 transition-opacity"
      />

      {/* Modal */}
      <div onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-2xl
          transform transition-all duration-200 scale-100 opacity-100"
      >
        {/* Close Button */}
        <button onClick={onClose} aria-label="Close"
          className="absolute top-3 right-3 h-9 w-9 flex items-center justify-center
            rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}

