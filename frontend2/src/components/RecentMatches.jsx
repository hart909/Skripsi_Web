import React from "react";

export default function RecentMatches({ matches = [], league = "laliga" }) {
  // warna dasar berdasarkan liga
  const bgColor =
    league.toLowerCase() === "premier"
      ? "bg-[#1c0433]" // EPL → ungu gelap
      : "bg-black"; // LaLiga → hitam

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 font-bebas uppercase">
        PERTANDINGAN TERAKHIR — {league.toUpperCase()}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {matches.map((m, i) => (
          <div
            key={i}
            className={`
              ${bgColor} text-white p-5 rounded-2xl shadow-xl
              flex flex-col justify-between h-40
            `}
          >
            {/* TEAM NAMES */}
            <div className="flex flex-col gap-3 font-bebas">
              <div className="flex items-center gap-3 text-xl tracking-wide">
                <img src={m.homeLogo} alt="home" className="w-6 h-6" />
                {m.home}
              </div>

              <div className="flex items-center gap-3 text-xl tracking-wide">
                <img src={m.awayLogo} alt="away" className="w-6 h-6" />
                {m.away}
              </div>
            </div>

            {/* DATE + SCORE */}
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-gray-300 font-sans">{m.date}</div>

              <div className="text-3xl font-bebas tracking-wide">
                {m.homeScore} – {m.awayScore}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
