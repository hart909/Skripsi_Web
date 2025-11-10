import React, { useState } from "react";
import Navbar from "./Navbar";

export default function Layout({
  hero,
  recentMatches,
  topStats,
  cta,
  table
}) {

  const [highlight, setHighlight] = useState(false);

  const triggerHighlight = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setHighlight(true);

    setTimeout(() => {
      setHighlight(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar highlight={highlight} />

      {/* HERO */}
      <div className="w-full font-bebas">
        {hero}
      </div>

      {/* CONTENT */}
      <div className="w-full flex justify-center font-bebas">
        <div className="w-full max-w-[1400px] px-6 py-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Kiri */}
            <div className="lg:col-span-8 space-y-8 font-bebas">
              {recentMatches}
              {topStats}
              
              {/* CTA diberi event */}
              {cta && React.cloneElement(cta, { onStartPredict: triggerHighlight })}
            </div>

            {/* Kanan */}
            <div className="lg:col-span-4 space-y-6 font-bebas">
              {table}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
