import { useState, useEffect } from "react";
import api from "../api/client";
import CardList from "../components/CardList";
import NavBar from "../components/NavBar";
import ToggleSwitch from "../components/ToggleSwitch";
import bgArt from "../assets/Dragons-of-Tarkir-Gudul-Lurker-MtG.jpg";
export default function ProfilePage() {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState("");
  const [add, setAdd] = useState(false);
  const [haves, setHaves] = useState(false);
  const [showListInput, setShowListInput] = useState(false);
  const [listText, setListText] = useState("");
  const [form, setForm] = useState({
    name: "",
    set_name: "",
    rarity: "",
    price: "",
    image_url: "",
    quantity: 1,
    intent: haves ? "have" : "want",
  });
  
  async function fetchMyCards() {
    const res = await api.get("/auth/me");
    setCards(res.data);
  }

  async function addCard(e) {
    e.preventDefault();
    try {
      await api.post("/cards/", form);
      fetchMyCards();
    } catch (err) {
      alert("Failed to add card");
    }
  }

  useEffect(() => {
    fetchMyCards();
  }, []);
 // Called when an autocomplete suggestion is chosen
  function handleSelectCard(card) {
    setForm({
      name: card.name,
      set_name: card.set_name || card.set,
      rarity: card.rarity || "",
      price: card.prices?.usd ? parseFloat(card.prices.usd) : 0,
      image_url: card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || "",
      quantity: 1,
      intent: (haves ? "have" : "want"),
    });
    // keep the search text in sync with selected card name
    setSearch(card.name);
  }
  const heroHeight = 1000; // px - the background image area height

  return (
    <div style={{ position: "relative"}}>
      <div style={{ padding: 12 }}>
          <NavBar
            search={search}
            setSearch={setSearch}
            onSelect={handleSelectCard}
            placeholder="Search for a card..."
          />
      </div>
        <div
          style={{
            height: heroHeight,
            position: 'absolute',
            inset: 0,
            marginTop: 100,
            backgroundImage: `url(${bgArt})`,
            maskImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, transparent 100%)",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
            pointerEvents: 'none',
          }}
      />

      <div style={{ //Position all following content above bg image
        position: 'relative',
        zIndex: 2,
        marginTop: 250,
        marginLeft: 48,
        marginRight: 48,
      }}>
      <div style={{
        position: 'relative',
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        gap: 12,
      }}>
        <ToggleSwitch
          value={haves}
          onChange={setHaves}
          leftLabel="Wants"
          rightLabel="Haves"
          id="profile-type-toggle"
          size="md"
        />
        <ToggleSwitch
          value={add}
          onChange={setAdd}
          leftLabel="View"
          rightLabel="Add"
          id="profile-view-toggle"
          size="md"
        />
        {add &&  <button onClick={addCard}>Add Card</button> }
        {add &&  <button onClick={() => setShowListInput(s => !s)}>Add by List</button> }
        {add &&  <button onClick={addCard}>Add by Photo</button> }
        
      </div>

      {showListInput&&add && (
        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>Paste list (one card per line):</div>
          <textarea
            value={listText}
            onChange={(e) => setListText(e.target.value)}
            placeholder={`Example:\n1 Lightning Bolt (STA) \n1x Artist's Talent (BLB)`}
            rows={8}
            style={{ width: "60%", padding: 8, fontSize: 14, borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "var(--text)" }}
          />
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button onClick={async (e) => { e.preventDefault(); await parseAndAddList(); }}>Parse & Add</button>
            <button onClick={() => { setListText(""); setShowListInput(false); }}>Cancel</button>
          </div>
        </div>
      )}
      {!add && (
        <div style={{ marginTop: 18 }}>
          <CardList cards={cards.filter(card => card.intent === (haves ? "have" : "want"))} />
        </div>
      )}
      </div>
    </div>
  );

  async function parseAndAddList() {
    if (!listText.trim()) {
      alert("Empty textbox.");
      return;
    }

    const lines = listText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) {
      alert("No card lines found.");
      return;
    }

    // helper to parse lines of the exact required format:
    // Quantity, name, set identifier in parentheses. Lines without quantity or without a set are ignored.
    // Examples accepted: "1x Umara Wizard (ZNR)", "2 Lightning Bolt (M21)"; trailing text after the ) is ignored.
    function parseLine(line) {
      const m = line.match(/^\s*(\d+)\s*x?\s+(.+?)\s*\(([^)]+)\)/i);
      if (!m) return null; // ignore lines that don't match the required format
      const qty = parseInt(m[1], 10);
      const name = m[2].trim();
      const setId = m[3].trim();
      return { qty, name, setId };
    }

    let added = 0;
    let failed = 0;
    let ignored = 0;

    for (const raw of lines) {
      const parsed = parseLine(raw);
      if (!parsed) {
        ignored += 1;
        continue;
      }
      const { qty, name, setId } = parsed;
      try {
        // Try Scryfall named endpoint with exact name + set code first (best chance for exact edition match)
        const setCode = encodeURIComponent(setId.toLowerCase());
        const exactUrl = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}&set=${setCode}`;
        let res = await fetch(exactUrl);
        let card;
        if (!res.ok) {
          // fallback: fuzzy by name and set
          const fuzzyUrl = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(`${name} set:${setId}`)}`;
          res = await fetch(fuzzyUrl);
          if (!res.ok) throw new Error(`Scryfall lookup failed for ${name} (${setId})`);
          const searchResult = await res.json();
          if (!searchResult.data || searchResult.data.length === 0) throw new Error(`No results for ${name} (${setId})`);
          card = searchResult.data[0];
        } else {
          card = await res.json();
        }

        const payload = {
          name: card.name,
          set_name: card.set_name || card.set || "",
          rarity: card.rarity || "",
          price: card.prices?.usd ? parseFloat(card.prices.usd) : 0,
          image_url: card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || "",
          quantity: qty,
          intent: haves ? "have" : "want",
        };

        await api.post("/cards/", payload);
        added += 1;
      } catch (err) {
        console.error("Failed to add line:", raw, err);
        failed += 1;
      }
    }

    await fetchMyCards();
    setListText("");
    setShowListInput(false);
    alert(`Added ${added} cards. ${failed ? `${failed} failed.` : ""}`);
  }
}
