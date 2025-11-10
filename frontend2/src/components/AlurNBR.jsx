import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HOME_COLOR = "#112F4A";
const AWAY_COLOR = "#7A1A1A";
const DRAW_COLOR = "#D4AF37";

export default function AlurNBR() {
  const navigate = useNavigate();
  const { state } = useLocation();

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

  const { home, away, dataNBR, league } = state;

  // DETECT LIGA
  const isLaliga = league === "laliga";
  const theme = isLaliga ? "#A50044" : "#37003C";

  const leagueLogo = isLaliga
    ? "https://upload.wikimedia.org/wikipedia/commons/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg"
    : "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg";

  // MAIN PARAMS
  const muH = dataNBR?.mu_home ?? 0;
  const muA = dataNBR?.mu_away ?? 0;
  const diff = dataNBR?.goal_diff_pred ?? 0;

  // ✅ FILTER KONTRIBUSI — Biar EPL sama seperti LaLiga
  const KEEP = [
    "Intercept",
    "HomeStrength",
    "AwayStrength",
    "StrengthDiff",
    "HalfTimeAdj",
    "HT_adjust",
    "HomeAdv",
  ];

  function filterContrib(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.filter((x) => KEEP.includes(x.name));
  }

  const contribH = filterContrib(dataNBR?.contrib_home ?? []);
  const contribA = filterContrib(dataNBR?.contrib_away ?? []);

  return (
    <div className="min-h-screen w-full bg-[#F8F8FB] px-4 py-10 flex flex-col items-center">
      {/* BACK */}
      <div className="w-full max-w-[1100px] mb-4">
        <button
          className="text-gray-600 text-sm hover:text-gray-800 transition font-bebas text-lg"
          onClick={() => navigate(-1)}
        >
          ← Kembali
        </button>
      </div>

      {/* LOGO LIGA */}
      <img src={leagueLogo} className="h-14 mb-3" alt="league" />

      {/* JUDUL */}
      <h1
        className="text-4xl md:text-5xl font-bebas tracking-wide mb-8 text-center"
        style={{ color: theme }}
      >
        Penjelasan Negative Binomial Regression
      </h1>

      {/* TEAMS */}
      <div className="flex items-center justify-center gap-10 mb-10">
        <div className="flex flex-col items-center">
          <img src={home?.logo} className="w-20 h-20 mb-2" alt="home" />
          <p className="font-bebas text-xl">HOME</p>
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
          <p className="font-bebas text-xl">AWAY</p>
          <p className="font-bebas text-2xl">{away?.name}</p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="flex gap-6 mb-10 flex-wrap justify-center">
        <Box label="μ Home" value={muH} color={HOME_COLOR} />
        <Box label="μ Away" value={muA} color={AWAY_COLOR} />
        <Box label="Selisih μ" value={Math.abs(muH - muA)} color={theme} />
      </div>

      {/* EXPLANATION BOX */}
      <div className="max-w-[900px] w-full bg-white border shadow rounded-xl px-6 py-5 mb-14">
        <p className="font-bebas text-lg mb-3" style={{ color: theme }}>
          Gambaran Singkat
        </p>

        <p className="text-sm text-gray-800 leading-relaxed mb-3">
          Model NBR menjumlahkan kontribusi fitur menjadi nilai n.
          Lalu menghasilkan ekspektasi gol via:
        </p>

        <pre className="bg-gray-100 text-center py-2 rounded-md font-mono text-sm">
          μ = exp(n)
        </pre>

        <p className="text-sm text-gray-800 leading-relaxed mt-3">
          Dengan membandingkan μ kedua tim, kita mendapatkan prediksi selisih gol.
        </p>
      </div>

      {/* CONTRIBUTION TABLE */}
      <div className="flex flex-wrap gap-10 justify-center w-full max-w-[1200px]">
        <ContributionTable
  title="Kontribusi Home"
  data={contribH}
  color={HOME_COLOR}
  muValue={muH}
/>

<ContributionTable
  title="Kontribusi Away"
  data={contribA}
  color={AWAY_COLOR}
  muValue={muA}
/>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Box({ label, value, color }) {
  return (
    <div
      className="px-6 py-4 rounded-xl border shadow bg-white text-center"
      style={{ borderColor: color }}
    >
      <p className="font-bebas text-lg" style={{ color }}>
        {label}
      </p>
      <p className="text-xl font-semibold">{Number(value).toFixed(2)}</p>
    </div>
  );
}

function ContributionTable({ title, data, color, muValue }) {
  const n = data.reduce((sum, row) => sum + Number(row.value || 0), 0);

  // kalau muValue gak valid → fallback ke exp(n)
  const muSafe = Number(muValue);
  const mu = isNaN(muSafe) ? Math.exp(n) : muSafe;

  return (
    <div className="bg-white border shadow rounded-xl p-5 w-[350px]">
      <p
        className="font-bebas text-xl mb-3 text-center"
        style={{ color }}
      >
        {title}
      </p>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ background: `${color}15` }}>
            <th className="px-3 py-2 border text-left">Parameter</th>
            <th className="px-3 py-2 border text-right">Kontribusi (xβ)</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td className="px-3 py-2 border">{row.name}</td>
              <td className="px-3 py-2 border text-right">
                {Number(row.value ?? 0).toFixed(4)}
              </td>
            </tr>
          ))}

          <tr style={{ background: `${color}12` }}>
            <td className="px-3 py-2 border font-semibold">Total n</td>
            <td className="px-3 py-2 border text-right font-semibold">
              {n.toFixed(4)}
            </td>
          </tr>

          <tr style={{ background: `${color}05` }}>
            <td className="px-3 py-2 border font-semibold">μ</td>
            <td className="px-3 py-2 border text-right font-semibold">
              {mu.toFixed(4)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
