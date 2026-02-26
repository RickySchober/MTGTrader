import React from "react";

import Button from "./Button.js";

import { GlobalError } from "@/lib/types.js";
interface ErrorPopupProps {
  error: GlobalError | null;
  onClose: () => void;
}

const ErrorPopup = ({ error, onClose }: ErrorPopupProps) => {
  if (!error) return null;

  function printOnClose() {
    console.log(error);
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-slate-dark border-foreground flex w-96 flex-col items-center gap-4 rounded-xl border p-6 shadow-xl">
        <h2 className="text-4xl font-semibold">
          {error.status ? `Error ${error.status}` : "Error"}
        </h2>

        <p className="text-muted text-xl">{error.message}</p>

        <Button onClick={printOnClose}>Close</Button>
      </div>
    </div>
  );
};
export default ErrorPopup;
