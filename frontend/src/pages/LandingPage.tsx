/* Basic landing page with explanation of site.
 */
import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/Button.js";
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  return (
    <div className="bg-slate flex min-h-screen w-full flex-col">
      {/* Title Section */}
      <section className="flex flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <h1 className="text-5xl font-bold drop-shadow-lg">
          Trade Magic The Gathering Cards Worldwide
        </h1>
        <p className="max-w-2xl text-lg">
          MTGTrader makes it easy to safely trade Magic The Gathering cards with players across the
          globe. Post your collection, browse offers, and trade with confidence.
        </p>
        <Button onClick={token ? () => navigate("/profile") : () => navigate("/login")}>
          Get Started
        </Button>
      </section>

      {/* Concept Explanation */}
      <div className="bg-slate-dark flex flex-col items-center gap-6 px-6 py-16">
        <h2 className="text-primary text-3xl font-bold">How It Works</h2>
        <p className="max-w-4xl text-lg">
          MTGTrader connects collectors and players from around the world. Create an account, list
          the cards in your collections as haves, and cards your looking to aquire as wants. Search
          the site for cards you want and initiate a trade with another user. Add additional cards
          from eachother's collection and propose a trade you think is fair. Once both traders
          accept the trade begin shipment to eachothers mailing address. Track shipments, confirm
          delivery, and complete trades all from within the platform.
        </p>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-sm">
        {new Date().getFullYear()} MTGTrader. All Rights Reserved.
      </footer>
    </div>
  );
};
export default LandingPage;
