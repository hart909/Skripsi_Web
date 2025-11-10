import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HOME_COLOR = "#112F4A";
const AWAY_COLOR = "#7A1A1A";
const DRAW_COLOR = "#D4AF37";

export default function PredictionResult() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F6FA]">
        <div className="text-center">
          <p className="font-bebas text-3xl text-gray-700">
            Data prediksi tidak ditemukan
          </p>
          <button
            className="underline text-sm text-gray-500 hover:text-gray-700"
            onClick={() => navigate(-1)}
          >
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  const { home, away, dataBHM, dataNBR, league } = state;

  // ====== DETECT LIGA ======
  const isLaliga =
    league === "laliga" ||
    home?.league === "laliga" ||
    window.location.pathname.includes("laliga");

  const theme = isLaliga ? "#A50044" : "#37003C";

  // ====== NORMALIZE PROBABILITY BHM ======
  let pH = dataBHM?.p_home ?? 0;
  let pD = dataBHM?.p_draw ?? 0;
  let pA = dataBHM?.p_away ?? 0;

  // EPL kadang sudah % atau 0–1, kita cek
  if (pH <= 1 && pD <= 1 && pA <= 1) {
    pH *= 100;
    pD *= 100;
    pA *= 100;
  }

  // ====== GOAL DIFF ======
  const rawDiff =
    dataNBR?.goal_diff_pred ??
    dataNBR?.goal_diff ??
    0;

  const diff = Math.abs(rawDiff);

  const prediction =
    rawDiff > 0 ? home?.name : rawDiff < 0 ? away?.name : "DRAW";

  const leagueLogo = isLaliga
    ? "https://upload.wikimedia.org/wikipedia/commons/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg"
    : "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg";

  return (
    <div className="min-h-screen w-full bg-[#F4F5F7] px-4 py-10 flex flex-col items-center">

      {/* BACK BUTTON */}
      <div className="w-full max-w-[900px] mb-3">
        <button
          className="text-gray-600 text-sm hover:text-gray-800 transition font-bebas text-lg"
          onClick={() => navigate(-1)}
        >
          ← Kembali
        </button>
      </div>

      {/* LIGA LOGO */}
      <img src={leagueLogo} className="h-14 mb-3" alt="league" />

      <h1
        className="text-4xl md:text-5xl font-bebas tracking-wide mb-6 text-center"
        style={{ color: theme }}
      >
        HASIL PREDIKSI
      </h1>

      <p className="text-gray-600 text-sm mb-10 text-center px-3">
        Hasil probabilitas berdasarkan model BHM & selisih gol (NBR)
      </p>

      {/* MAIN CARD */}
      <div className="relative max-w-[900px] w-full bg-white rounded-3xl border shadow-lg px-6 md:px-10 py-14">

        {/* ACCENT LINE */}
        <div
          className="absolute top-0 left-0 w-full h-1 rounded-t-3xl"
          style={{ background: theme }}
        />

        {/* FLOAT: SELISIH GOL */}
        <div
          className="
            absolute -top-8 left-6 md:left-10
            px-4 md:px-5 py-3 rounded-2xl
            font-bebas tracking-wide text-xl text-white
            shadow-[0_6px_16px_rgba(0,0,0,0.25)]
            flex flex-col items-center
          "
          style={{ background: theme }}
        >
          <span className="text-xs opacity-80 font-normal">
            Selisih Gol (NBR)
          </span>
          <span className="text-2xl">{diff.toFixed(2)}</span>
        </div>

        {/* TEAMS */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-12">

          {/* HOME */}
          <div className="rounded-xl p-6 w-40 md:w-48 bg-white border shadow-sm flex flex-col items-center hover:shadow-md transition">
            <img src={home?.logo} className="w-14 h-14 mb-2" alt="home" />
            <p className="text-center font-bebas text-xl">{home?.name}</p>
          </div>

          <span
            className="text-3xl font-bebas px-6 py-2 tracking-wide rounded-xl shadow-sm"
            style={{
              color: theme,
              background: `${theme}10`,
            }}
          >
            VS
          </span>

          {/* AWAY */}
          <div className="rounded-xl p-6 w-40 md:w-48 bg-white border shadow-sm flex flex-col items-center hover:shadow-md transition">
            <img src={away?.logo} className="w-14 h-14 mb-2" alt="away" />
            <p className="text-center font-bebas text-xl">{away?.name}</p>
          </div>
        </div>

        {/* PROBABILITY */}
        <p className="text-center text-sm mb-1 text-gray-600 font-semibold">
          Probabilitas (BHM)
        </p>

        <div className="w-full mt-4 mb-6 flex flex-col gap-2">
          <div
            className="
              relative w-full h-6 rounded-full overflow-hidden 
              bg-[#E7E7E8]
            "
            style={{
              boxShadow: "inset 0 0 3px rgba(0,0,0,0.20)",
            }}
          >
            <div
              style={{
                width: `${pH}%`,
                background: HOME_COLOR,
                transition: "width .55s ease",
              }}
              className="absolute left-0 top-0 h-full"
            />

            <div
              style={{
                width: `${pD}%`,
                left: `${pH}%`,
                background: DRAW_COLOR,
                transition: "width .55s ease",
              }}
              className="absolute top-0 h-full"
            />

            <div
              style={{
                width: `${pA}%`,
                left: `${pH + pD}%`,
                background: AWAY_COLOR,
                transition: "width .55s ease",
              }}
              className="absolute top-0 h-full"
            />
          </div>

          <div className="flex justify-between text-xs font-semibold tracking-wide">
            <span style={{ color: HOME_COLOR }}>HOME {pH.toFixed(1)}%</span>
            <span style={{ color: DRAW_COLOR }}>DRAW {pD.toFixed(1)}%</span>
            <span style={{ color: AWAY_COLOR }}>AWAY {pA.toFixed(1)}%</span>
          </div>
        </div>

        {/* FINAL RESULT */}
        <div className="mt-14 text-center">
          <p className="text-sm text-gray-600 font-medium mb-1">
            Prediksi Akhir
          </p>

          <p
            className="text-5xl md:text-6xl font-bebas tracking-wide"
            style={{ color: theme }}
          >
            {prediction}
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-12">

          <button
            className="px-6 py-3 rounded-xl font-bebas tracking-wide bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-md transition"
                       onClick={() =>
  navigate("/alur/nbr", {
    state:{
        home,
        away,
        dataNBR,
        league: isLaliga? "laliga": "premier"
    }
  })
}
          >
            Lihat Alur NBR
          </button>

          <button
            className="px-6 py-3 rounded-xl font-bebas tracking-wide text-white hover:brightness-110 transition"
            style={{ background: theme }}
            onClick={() =>
  navigate("/alur/bhm", {
    state:{
        home,
        away,
        dataBHM,
        league: isLaliga? "laliga": "premier"
    }
  })
}

          >
            Lihat Alur BHM
          </button>
        </div>
      </div>
    </div>
  );
}
