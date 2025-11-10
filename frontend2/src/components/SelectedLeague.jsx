import React from "react";

export default function SelectedLeague({ league, onConfirm }) {
  if (!league) {
    return (
      <div className="min-h-screen w-full bg-[#1A0423] text-white flex items-center justify-center">
        <p className="text-lg font-semibold">Belum ada liga yang dipilih.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#1A0423] text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-8">Liga Terpilih</h1>

      <div className="bg-white text-black rounded-xl shadow-md p-8 w-72 flex flex-col items-center gap-4">
        
        {league.code === "laliga" && (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/archive/5/54/20230704043314%21LaLiga_EA_Sports_2023_Vertical_Logo.svg"
            alt="La Liga"
            className="h-20 w-auto"
          />
        )}

        {league.code === "premier" && (
          <img
            src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg"
            alt="Premier League"
            className="h-20 w-auto"
          />
        )}

        <h2 className="font-semibold text-xl">{league.name}</h2>

        <button
          onClick={onConfirm}
          className="w-full bg-[#1A0423] text-white py-2 rounded-lg hover:bg-[#2b0640] transition"
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}
