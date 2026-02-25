/* Custom Button component with default styling used accross the application.
   Additional styling can be passed via the className prop and also override default styling.
*/
import React from "react";

import { cn } from "@/lib/utils.js";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}
const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      className={cn(
        "cursor-pointer rounded-sm border-0 px-4 py-2 text-lg font-semibold transition-all",
        "bg-primary hover:bg-primary-hover",
        "hover:not-disabled:-translate-y-0.5 active:not-disabled:translate-y-0",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
