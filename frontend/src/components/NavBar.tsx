import { useNavigate, useLocation } from "react-router-dom";
import SearchCard from "./SearchCard";
import icon from "/favicon.png";
import * as React from "react";
import { card } from "../../types";

interface NavBarProps {
    search: string;
    setSearch?: (value: string) => void;
    onSelect?: (card: card) => void;
    placeholder?: string;
}

const NavBar: React.FC<NavBarProps> = ({ search, setSearch, onSelect, placeholder }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    function handleSignOut() {
        localStorage.removeItem("token");
        navigate("/login");
    }
    const location = useLocation();

    function handleSearchSelection(card: card) {
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
export default NavBar;