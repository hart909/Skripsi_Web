import React from "react";

export default function SelectLeague({ onLeagueSelect }) {
  return (
    <div className="text-center px-4">
      <h1 className="text-3xl font-bold text-white mb-8">
        Pilih Liga
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* La Liga */}
        <div
          onClick={() => onLeagueSelect({ name: "La Liga", code: "laliga" })}
          className="cursor-pointer bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col"
          style={{ aspectRatio: "3 / 4" }}
        >
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/archive/5/54/20230704043314%21LaLiga_EA_Sports_2023_Vertical_Logo.svg"
              alt="La Liga"
              className="h-24 w-auto mb-2"   // sedikit lebih kecil
            />
            <h2 className="font-bold text-xl text-[#7d273f] mb-1">
              La Liga
            </h2>
            <p className="text-gray-600 text-sm text-center">
              Kompetisi tertinggi Spanyol dengan Pemenang Juara Eropa Terbanyak.
            </p>
          </div>
        </div>

        {/* Premier League */}
        <div
          onClick={() => onLeagueSelect({ name: "Premier League", code: "premier" })}
          className="cursor-pointer bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col"
          style={{ aspectRatio: "3 / 4" }}
        >
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg"
              alt="Premier League"
              className="h-24 w-auto mb-2"   // sedikit lebih kecil
            />
            <h2 className="font-bold text-xl text-[#3b0b59] mb-1">
              Premier League
            </h2>
            <p className="text-gray-600 text-sm text-center">
              Liga paling kompetitif di dunia, rumah bagi klub-klub legendaris Inggris.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
