import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {BASE_URL} from "../config"
const HOME_COLOR = "#112F4A";
const AWAY_COLOR = "#7A1A1A";
const DRAW_COLOR = "#D4AF37";

export default function AlurBHM() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [loading, setLoading] = useState(true);
  const [exp, setExp] = useState(null);

  // ---- extract from state safely ----
  const home = state?.home;
  const away = state?.away;
  const dataBHM = state?.dataBHM;
  const league = state?.league;

  // ✅ SAFE DETECT LEAGUE
  let isLaliga = false;

  if (league === "laliga") {
    isLaliga = true;
  } else if (league === "premier") {
    isLaliga = false;
  } else {
    // fallback cek lewat path
    if (window.location.pathname.toLowerCase().includes("laliga")) {
      isLaliga = true;
    }
  }

  const theme = isLaliga ? "#A50044" : "#37003C";

  const leagueLogo = isLaliga
    ? "https://upload.wikimedia.org/wikipedia/commons/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg"
    : "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg";

  const BASE = `${BASE_URL}/api/predict/`;

  async function fetchExplain() {
    try {
      setLoading(true);

      if (!home?.id || !away?.id) return;

      const url = `${BASE}bhm/explain/?home_id=${home.id}&away_id=${away.id}`;
      const res = await fetch(url);
      const data = await res.json();

      setExp(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

/* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchExplain();
  }, []);

  // ✅ fallback if no state
  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-bebas text-2xl text-gray-700">
            Data tidak ditemukan
          </p>
          <button className="underline text-sm" onClick={() => navigate(-1)}>
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  if (loading || !exp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-bebas text-2xl">Loading...</p>
      </div>
    );
  }

  // ----- BHM probabilities -----
  let pH = dataBHM?.p_home ?? 0;
  let pD = dataBHM?.p_draw ?? 0;
  let pA = dataBHM?.p_away ?? 0;

  // ✅ jika masih 0.xx → kali 100
  if (pH <= 1 && pD <= 1 && pA <= 1) {
    pH *= 100;
    pD *= 100;
    pA *= 100;
  }

  // ----- Score distributions -----
  const homeScores = exp.home_scores ?? [];
  const awayScores = exp.away_scores ?? [];
  const joint = exp.joint_matrix ?? [];

  return (
    <div className="min-h-screen w-full bg-[#F7F7FA] px-4 py-10 flex flex-col items-center">

      {/* BACK */}
      <div className="w-full max-w-[1100px] mb-4">
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
        className="text-4xl md:text-5xl font-bebas tracking-wide mb-8 text-center"
        style={{ color: theme }}
      >
        Penjelasan Prediksi (Bayesian Hierarchical Model)
      </h1>

      {/* TEAMS */}
      <div className="flex items-center justify-center gap-10 mb-10">
        <div className="flex flex-col items-center">
          <img src={home?.logo} className="w-20 h-20 mb-2" alt="home" />
          <p className="font-bebas text-2xl">{home?.name}</p>
        </div>

        <span
          className="text-4xl font-bebas px-5 py-2 tracking-wide rounded-xl shadow-sm"
          style={{
            color: theme,
            background: `${theme}10`,
          }}
        >
          VS
        </span>

        <div className="flex flex-col items-center">
          <img src={away?.logo} className="w-20 h-20 mb-2" alt="away" />
          <p className="font-bebas text-2xl">{away?.name}</p>
        </div>
      </div>

      {/* LAMBDA */}
      <div className="flex gap-6 mb-10 flex-wrap justify-center">
        <div
          className="px-6 py-4 rounded-xl border shadow bg-white"
          style={{ borderColor: theme }}
        >
          <p className="font-bebas text-lg" style={{ color: theme }}>
            λ Home
          </p>
          <p className="text-xl font-medium">
            {exp.mu_home_mean?.toFixed(2)}
          </p>
        </div>

        <div
          className="px-6 py-4 rounded-xl border shadow bg-white"
          style={{ borderColor: theme }}
        >
          <p className="font-bebas text-lg" style={{ color: theme }}>
            λ Away
          </p>
          <p className="text-xl font-medium">
            {exp.mu_away_mean?.toFixed(2)}
          </p>
        </div>
      </div>

      {/* PROBABILITAS */}
      <h2
        className="text-3xl font-bebas mb-4"
        style={{ color: theme }}
      >
        Probabilitas Menang / Seri / Kalah
      </h2>

      <div className="flex flex-wrap justify-center gap-6 mb-12">

        <div className="px-6 py-4 bg-white border rounded-xl shadow text-center">
          <p className="font-bebas text-xl" style={{ color: HOME_COLOR }}>
            Home
          </p>
          <p className="text-2xl font-semibold">{pH.toFixed(2)}%</p>
        </div>

        <div className="px-6 py-4 bg-white border rounded-xl shadow text-center">
          <p className="font-bebas text-xl" style={{ color: DRAW_COLOR }}>
            Draw
          </p>
          <p className="text-2xl font-semibold">{pD.toFixed(2)}%</p>
        </div>

        <div className="px-6 py-4 bg-white border rounded-xl shadow text-center">
          <p className="font-bebas text-xl" style={{ color: AWAY_COLOR }}>
            Away
          </p>
          <p className="text-2xl font-semibold">{pA.toFixed(2)}%</p>
        </div>
      </div>

      {/* DISTRIBUSI SKOR */}
      <h2
        className="text-3xl font-bebas mb-2"
        style={{ color: theme }}
      >
        Distribusi Skor
      </h2>

      <p className="text-sm text-gray-600 mb-6 text-center">
        Distribusi skor dihitung menggunakan model probabilistik.
      </p>

      <div className="flex flex-wrap gap-10 justify-center">
        {/* HOME TABLE */}
        <div>
          <p
            className="font-bebas text-xl text-center mb-2"
            style={{ color: HOME_COLOR }}
          >
            Home
          </p>

          <table className="border-collapse text-sm">
            <thead>
              <tr className="bg-[#E9ECF1]">
                <th className="px-4 py-2 border">Skor</th>
                <th className="px-4 py-2 border">Prob (%)</th>
              </tr>
            </thead>
            <tbody>
              {homeScores.map((row, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 border text-center">{row.score}</td>
                  <td className="px-4 py-2 border text-center">{row.prob}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AWAY TABLE */}
        <div>
          <p
            className="font-bebas text-xl text-center mb-2"
            style={{ color: AWAY_COLOR }}
          >
            Away
          </p>

          <table className="border-collapse text-sm">
            <thead>
              <tr className="bg-[#F6E9E9]">
                <th className="px-4 py-2 border">Skor</th>
                <th className="px-4 py-2 border">Prob (%)</th>
              </tr>
            </thead>
            <tbody>
              {awayScores.map((row, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 border text-center">{row.score}</td>
                  <td className="px-4 py-2 border text-center">{row.prob}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JOINT PROBABILITY */}
      <h2
        className="text-3xl font-bebas mt-14 mb-4"
        style={{ color: theme }}
      >
        Joint Probability (Kombinasi Skor)
      </h2>

      <p className="text-sm text-gray-600 mb-6 text-center px-4 max-w-[700px]">
        Tiap sel menunjukkan probabilitas skor Home × Away.
      </p>

      <div className="overflow-auto max-w-[95vw]">
        <table className="text-sm border-collapse">
          <tbody>
            {joint.map((row, r) => (
              <tr key={r}>
                {row.map((val, c) => {
                  let bg = "#EEE";
                  if (r > c) bg = "#D7F4DA";      // home unggul
                  else if (c > r) bg = "#F6D5D5"; // away unggul

                  return (
                    <td
                      key={c}
                      className="px-3 py-2 border text-center"
                      style={{ background: bg }}
                    >
                      {(val / 100).toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
