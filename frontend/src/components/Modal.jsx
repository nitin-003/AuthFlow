import { useEffect } from "react";

export default function Modal({ isOpen, onClose, children }){
  useEffect(() => {
    if(!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
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
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      role="dialog" aria-modal="true"
    >
      {/* BACKDROP (NO BLUR) */}
      <div
        className="absolute inset-0 bg-black/40" onClick={onClose}
      />

      {/* MODAL CONTENT */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl bg-white
          rounded-2xl shadow-2xl border animate-fadeIn"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-2 p-2 rounded-full
            text-gray-700 hover:bg-gray-400 hover:text-white transition-colors
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}


