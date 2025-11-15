import api from "../api/client";
import * as React from "react";
import { card } from "../../types";

interface CardItemProps {
  card: card;
  triggerUpdate?: () => void;
  modifiable?: boolean;
}

const CardItem: React.FC<CardItemProps> = ({
  card,
  triggerUpdate,
  modifiable = false,
}) => {
  async function modifyQuantity(quantity: number) {
    try {
      await api.patch(`/cards/${card.id}`, { quantity });
      card.quantity = quantity;
      await triggerUpdate?.();
    } catch (err) {
      console.error("Failed to modify quantity", err);
    }
  }

  return (
    <div className="border border-gray-300 rounded-md shadow-sm overflow-hidden bg-neutral-900">
      {/* Card image */}
      <img
        src={card.image_url}
        alt={card.name}
        className="w-full"
      />

      {/* Card info row */}
      <div className="flex justify-between items-center px-3 py-2 gap-4 text-white">
        {/* Quantity controls */}
        {modifiable && (
          <div className="flex items-center gap-3">
            <button
              className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
              onClick={() => modifyQuantity(card.quantity + 1)}
            >
              +
            </button>

            <h1 className="text-lg font-semibold">{card.quantity}</h1>

            <button
              className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
              onClick={() => modifyQuantity(card.quantity - 1)}
            >
              -
            </button>
          </div>
        )}

        {/* Card text info */}
        <div className="flex flex-col text-center ">
          <h4 className="font-bold">{card.name}</h4>
          <p className="text-sm text-gray-400">{card.set_name}</p>

          {card.print_description && (
            <p className="text-xs text-gray-500 mt-1">
              {card.print_description}
            </p>
          )}

          <p className="text-sm mt-1">{card.owner}</p>
          <p className="text-sm mt-1">${Number(card.price || 0).toFixed(2)}</p>
        </div>

        {/* Remove button */}
        {modifiable && (
          <button
            className="px-2 py-1 bg-red-700 hover:bg-red-800 rounded text-white whitespace-nowrap"
            onClick={() => modifyQuantity(0)}
          >
            remove
          </button>
        )}
      </div>
    </div>
  );
};

export default CardItem;
