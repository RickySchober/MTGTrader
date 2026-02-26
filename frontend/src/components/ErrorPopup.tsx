import React from "react";

import { GlobalError } from "@/lib/types.js";
interface ErrorPopupProps {
  error: GlobalError | null;
  onClose: () => void;
}

const ErrorPopup = ({ error, onClose }: ErrorPopupProps) => {
  if (!error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-surface border-border w-96 rounded-xl border p-6 shadow-xl">
        <h2 className="mb-2 text-lg font-semibold">
          {error.status ? `Error ${error.status}` : "Error"}
        </h2>

        <p className="text-muted mb-4">{error.message}</p>

        <button className="bg-primary hover:bg-primary-hover rounded px-4 py-2" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
export default ErrorPopup;
