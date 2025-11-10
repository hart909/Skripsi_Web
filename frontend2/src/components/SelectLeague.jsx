import React from "react";
import { useNavigate } from "react-router-dom";

export default function SelectLeague() {
  const navigate = useNavigate();

  const go = (code) => {
    if (code === "laliga") navigate("/laliga");
    else if (code === "premier") navigate("/premier");
  };

  return (
    <div className="min-h-screen w-full bg-[#1A0423] flex flex-col items-center pt-12 px-4">

      <h1 className="text-2xl font-bold text-white mb-12">
        Pilih Liga
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-4xl w-full place-items-center">

        {/* La Liga */}
        <div
          onClick={() => go("laliga")}
          className="
            cursor-pointer bg-white rounded-3xl shadow-xl 
            hover:scale-105 transition transform duration-300
            w-[330px] h-[540px] flex flex-col items-center justify-center px-4
          "
        >
          <img
            src='https://upload.wikimedia.org/wikipedia/commons/archive/5/54/20230704043314%21LaLiga_EA_Sports_2023_Vertical_Logo.svg'
            alt='La Liga'
            className="h-20 w-auto mb-4 object-contain"
          />

          <h2 className="text-lg font-bold text-[#7d273f] mb-2">
            La Liga
          </h2>

          <p className="text-gray-600 text-xs text-center leading-relaxed">
            Kompetisi tertinggi Spanyol dengan<br/>Pemenang Juara Eropa Terbanyak.
          </p>
        </div>

        {/* Premier League */}
        <div
          onClick={() => go("premier")}
          className="
            cursor-pointer bg-white rounded-3xl shadow-xl 
            hover:scale-105 transition transform duration-300
            w-[330px] h-[540px] flex flex-col items-center justify-center px-4
          "
        >
          <img
            src='https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg'
            alt='Premier League'
            className="h-20 w-auto mb-4 object-contain"
          />

          <h2 className="text-lg font-bold text-[#3b0b59] mb-2">
            Premier League
          </h2>

          <p className="text-gray-600 text-xs text-center leading-relaxed">
            Liga paling kompetitif di dunia,<br/>rumah bagi klub-klub legendaris Inggris.
          </p>
        </div>

      </div>
    </div>
  );
}
