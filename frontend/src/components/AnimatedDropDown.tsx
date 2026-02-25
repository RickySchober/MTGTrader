/* Dropdown menu for selecting from list such as profile button
 */
import React from "react";
import { useState, useEffect, useContext } from "react";

import Button from "./Button.js";

import { TradeContext } from "@/context/TradeProvider.js";
import { useOnClickOutside } from "@/lib/hooks.js";
interface AnimatedDropDownProps {
  options: { name: string; onClick: () => void }[];
}

const AnimatedDropDown: React.FC<AnimatedDropDownProps> = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useOnClickOutside(() => setIsOpen(false)); // Use the custom hook
  const toggleMenu = () => setIsOpen(!isOpen);
  const { tradeNotification, fetchTrades } = useContext(TradeContext);
  const numberOfNotifs = tradeNotification > 99 ? "99+" : tradeNotification;

  useEffect(() => {
    fetchTrades(); // load once on mount
  }, []);

  return (
    <div className="z-99 relative inline-block text-left" ref={dropdownRef}>
      <Button onClick={toggleMenu}>Profile</Button>
      {tradeNotification > 0 && (
        <span className="border-slate bg-error absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full border-2 px-1 text-sm font-bold leading-none">
          {numberOfNotifs}
        </span>
      )}

      <div
        className={`bg-foreground absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg transition-all duration-300 ease-out ${
          isOpen
            ? "visible max-h-screen scale-y-100 opacity-100"
            : "invisible max-h-0 scale-y-95 opacity-0" // Animate max-height and opacity
        } overflow-hidden`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        {options.map((option) => {
          const isTradeLog = option.name.toLowerCase() === "trade log";
          if (isTradeLog) console.log("Trade Notification Count:", tradeNotification);
          return (
            <a
              key={option.name}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                option.onClick();
                setIsOpen(false);
              }}
              className="text-primary hover:bg-foreground hover:text-slate relative block px-4 py-3 text-lg"
              role="menuitem"
            >
              <span className="flex items-center gap-2">
                {option.name}

                {isTradeLog && tradeNotification > 0 && (
                  <span className="border-slate bg-error flex h-6 min-w-6 items-center justify-center rounded-full border-2 px-1 text-sm font-bold leading-none">
                    {numberOfNotifs}
                  </span>
                )}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedDropDown;
