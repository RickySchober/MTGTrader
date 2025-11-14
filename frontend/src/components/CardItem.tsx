import api from "../api/client";
import * as React from "react";
import { card } from "../../types";

interface CardItemProps {
  card: card;
  triggerUpdate?: () => void;
  modifiable?: boolean;
}

const CardItem: React.FC<CardItemProps> = ({ card, triggerUpdate, modifiable = false }) => {

  async function modifyQuantity(quantity: number) {
    try {
      await api.patch(`/cards/${card.id}`, { quantity: quantity });
      card.quantity = quantity;
      await triggerUpdate?.();
    } catch (err) {
      console.error("Failed to modify quantity", err);
      throw err;
    }
  }

  return (
    <div style={{
      border: "1px solid #ccc",
      textAlign: "center",
    }}>
      <img src={card.image_url} alt={card.name} style={{ width: "100%" }} />
      <div style={{ display: "flex", 
            justifyContent: "space-around",
            alignItems: "center",
            padding: "1", }}>
        {modifiable && ( // Show quantity controls if modifiable is true
          <div style={{ display: "flex", 
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8 }}>
            <button onClick={async () => {
              await modifyQuantity(card.quantity + 1);
            }} >+</button>
            <h1>{card.quantity}</h1>
            <button onClick={async () => {
              await modifyQuantity(card.quantity - 1);
            }} >-</button>
          </div>
        )}
        <div>
          <h4>{card.name}</h4>
          <p style={{ margin: 0, fontSize: 16, color: '#bebebeff' }}>{card.set_name}</p>
          {card.print_description && (
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#888' }}>{card.print_description}</p>
          )}
          <p style={{ margin: '4px 0 0 0' }}>{card.owner}</p>
          <p style={{ margin: '4px 0 0 0' }}>${Number(card.price || 0).toFixed(2)}</p>
        </div>
        {modifiable && ( // Show remove button if modifiable is true
        <button background-color = '#cf0000ff' onClick={async () => { await modifyQuantity(0); }} >remove</button>
      )}
      </div>
    </div>
  );
}

export default CardItem;
