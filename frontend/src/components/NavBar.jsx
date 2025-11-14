import { useNavigate, useLocation } from "react-router-dom";
import SearchCard from "./SearchCard";
import icon from "/favicon.png";


export default function NavBar ({ search, setSearch, onSelect, placeholder = "Search for a card..." }) {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    function handleSignOut() {
        localStorage.removeItem("token");
        navigate("/login");
    }
    const location = useLocation();

    function handleSearchSelection(card) {
        if (location.pathname === "/search") {
            setSearch?.(card?.name || "");
            if (typeof onSelect === "function") onSelect(card);
            return;
        }
        const q = encodeURIComponent(card?.name || "");
        navigate(`/search?q=${q}`);
    }

    return (
        <div /* ─── NAVBAR ──────────────────────────────── */
            style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px",
            }}>
        {/* App Icon / Title */}
        <div
            onClick={() => navigate("/")}
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        >
            <h1 style={{ margin: 0, fontSize: 46, fontWeight: 700, color: '#ddddddff', display: 'flex', alignItems: 'center', gap: 6 }}>
                <img
                    src={icon}
                    alt="M"
                    style={{ width: 50, height: 50, objectFit: 'contain', display: 'inline-block' }}
                />
                <span style={{ lineHeight: 1, marginLeft: -7 }}>TGTrader</span>
            </h1>
        </div>

        {/* Search Bar */}
       <SearchCard
            value={search}
            onChange={setSearch}
            onSelect={handleSearchSelection}
            placeholder={placeholder}
        />

        {/* Auth & Profile Buttons */}
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
        }}>
            {token ? (
            <>
                <button onClick={() => navigate("/profile")} style={{ whiteSpace: 'nowrap' }}>
                    Profile
                </button>
                <button onClick={handleSignOut} style={{ whiteSpace: 'nowrap' }}>
                    Sign Out
                </button>
            </>
            ) : (
            <button onClick={() => navigate("/login")} style={{ whiteSpace: 'nowrap' }}>
                Sign In
            </button>
            )}
        </div>
     </div>);
}