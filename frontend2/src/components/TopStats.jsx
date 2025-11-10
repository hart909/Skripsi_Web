import React from "react";

export default function TopStats({ data = {}, league = "laliga" }) {
  const { top_scorer = [], top_assist = [], clean_sheet = [] } = data;

  // WARNA BERDASARKAN LIGA
  const mainColor =
    league === "premier" ? "#5A1B7C" : "#163263"; // purple vs deep-blue

  const Section = (title, arr) => {
    if (!arr || arr.length === 0) return null;
    const top = arr[0];

    return (
      <div
        className="
          relative rounded-xl shadow overflow-hidden border
          bg-gradient-to-br from-gray-50 to-white
        "
      >
        {/* Accent left bar */}
        <div
          className="absolute left-0 top-0 h-full w-[6px]"
          style={{ backgroundColor: mainColor }}
        />

        {/* Subtle texture */}
        <div
          className="
            absolute inset-0 
            bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]
            opacity-[0.10] pointer-events-none
          "
        />

        {/* Dekorasi abu-abu */}
        <div className="absolute right-0 top-0 w-16 h-16 bg-gray-200 opacity-30 clip-triangle-top-right" />
        <div className="absolute left-0 bottom-0 w-16 h-16 bg-gray-300 opacity-30 clip-triangle-bottom-left" />

        {/* TOP AREA */}
        <div className="flex p-4 gap-4 items-center border-b relative">
          {/* VALUE + TITLE */}
          <div className="flex flex-col justify-center leading-none">
            <div
              className="font-extrabold text-7xl drop-shadow-sm"
              style={{ color: mainColor }}
            >
              {top.value}
            </div>

            <div className="text-[25px] font-semibold tracking-wide uppercase text-gray-600 mt-1">
              {title}
            </div>
          </div>

          {/* CARD */}
          <div className="flex items-center justify-center ml-auto">
            <div className="relative w-32 h-44 drop-shadow">
              <img
                src={top.photo}
                className="w-full h-full object-contain"
                alt={top.name}
              />
            </div>
          </div>
        </div>

        {/* PLAYER LABEL */}
        <div className="px-4 pt-3 relative">
          <div className="text-[10px] text-gray-500 uppercase tracking-wide">
            {title}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-m font-bold px-1.5 py-0.5 rounded-md text-black">
              1°
            </span>
            <span className="font-extrabold text-xl uppercase leading-tight">
              {top.name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 uppercase mt-1">
            <img src={top.logo} className="w-5 h-5" alt={top.club} />
            {top.club}
          </div>
        </div>

        {/* LIST */}
        <div className="mt-4 relative">
          {arr.slice(0, 5).map((p, i) => (
            <div
              key={i}
              className={`
                flex items-center text-sm px-4 py-2 border-t transition
                ${i % 2 === 1 ? "bg-gray-100" : "bg-gray-50"}
                hover:bg-gray-200
              `}
            >
              <span className="w-6 text-gray-500 font-semibold">
                {String(i + 1).padStart(2, "0")}
              </span>

              <img src={p.logo} className="w-5 h-5 mr-2" alt={p.club} />

              <span className="flex-1 font-semibold uppercase text-gray-700">
                {p.name}
              </span>

              <span className="font-bold">{p.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Section("GOALS", top_scorer)}
      {Section("ASSISTS", top_assist)}
      {Section("CLEAN SHEETS", clean_sheet)}
    </div>
  );
}
