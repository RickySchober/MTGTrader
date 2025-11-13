import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import SearchCard from "./SearchCard";
import icon from "/favicon.png";


export default function NavBar ({ search, setSearch, onSelect, placeholder = "Search for a card..." }) {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    function handleSignOut() {
        localStorage.removeItem("token");
        navigate("/login");
    }
    return (
        <div /* ─── NAVBAR ──────────────────────────────── */
            style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
            onSelect={onSelect}
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
                <button
                onClick={() => navigate("/profile")}
                className="text-gray-700 font-medium hover:text-blue-600"
                style={{ whiteSpace: 'nowrap' }}
                >
                Profile
                </button>
                <button
                onClick={handleSignOut}
                className="text-red-600 font-medium hover:text-red-700"
                style={{ whiteSpace: 'nowrap' }}
                >
                Sign Out
                </button>
            </>
            ) : (
            <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                style={{ whiteSpace: 'nowrap' }}
            >
                Sign In
            </button>
            )}
        </div>
     </div>);
}