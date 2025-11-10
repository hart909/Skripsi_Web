import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HOME_COLOR = "#112F4A"; // biru gelap
const AWAY_COLOR = "#7A1A1A"; // merah gelap

export default function PredictionForm() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isLaliga = pathname.toLowerCase().includes("laliga");
  const theme = isLaliga ? "#A50044" : "#37003C";

  // ✅ Base URL
  const BASE = "http://127.0.0.1:8000/api/predict/";

  // ✅ URL team
  const TEAMS_URL = isLaliga
    ? BASE + "teams/laliga/"
    : BASE + "teams/premier/";

  // ✅ URL Predict
  const BHM_URL = isLaliga ? BASE + "bhm/" : BASE + "bhm/epl/";
  const NBR_URL = isLaliga ? BASE + "nbr/" : BASE + "nbr/epl/";

  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");

  const [home, setHome] = useState(null);
  const [away, setAway] = useState(null);

  const [loading, setLoading] = useState(false);

  // ✅ FETCH TEAMS
  useEffect(() => {
    fetch(TEAMS_URL)
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch(() => setTeams([]));
  }, [TEAMS_URL]);

  const filtered = search
    ? teams.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    : teams;

  function pick(club) {
    if (home?.id === club.id) return setHome(null);
    if (away?.id === club.id) return setAway(null);

    if (!home) setHome(club);
    else if (!away) setAway(club);
  }

  function swapTeams() {
    const a = home;
    setHome(away);
    setAway(a);
  }

  function resetTeams() {
    setHome(null);
    setAway(null);
  }

  // ✅ Predict Handler — NO UI CHANGE
  async function handlePredict() {
    if (!home || !away) {
      alert("Pilih home dan away dulu!");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        home_id: home.id,
        away_id: away.id,
      };

      // ✅ call BHM
      const resBHM = await fetch(BHM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const dataBHM = await resBHM.json();

      if (dataBHM?.error) {
        alert("BHM Error: " + dataBHM.error);
      }

      // ✅ call NBR
      const resNBR = await fetch(NBR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const dataNBR = await resNBR.json();

      if (dataNBR?.error) {
        alert("NBR Error: " + dataNBR.error);
      }

      // ✅ navigate ke hasil
      navigate("hasil", {
        state: {
          home,
          away,
          dataBHM,
          dataNBR,
        },
      });

      console.log("✅ BHM:", dataBHM);
      console.log("✅ NBR:", dataNBR);
    } catch (e) {
      alert("Gagal memproses prediksi");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[950px] mx-auto px-4 py-8">

      {/* Back */}
      <button
        className="text-gray-600 text-sm mb-6"
        onClick={() => navigate(isLaliga ? "/laliga" : "/premier")}
      >
        ← Kembali
      </button>

      <h1
        className="text-center text-4xl mb-8"
        style={{ fontFamily: "Bebas Neue", color: theme }}
      >
        PREDIKSI SEBELUM PERTANDINGAN
      </h1>

{/* HOME / AWAY BOX */}
<div
  className="rounded-2xl p-6 mb-4 shadow-md flex flex-col gap-6"
  style={{
    background: `linear-gradient(140deg, ${theme} 0%, ${theme}cc 60%, ${theme}99 100%)`,
    border: `1px solid ${theme}55`,
    backdropFilter: "blur(6px)",
  }}
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">

    {/* HOME */}
    <div className="flex flex-col gap-2">
      <label className="text-xs tracking-wide opacity-80">
        HOME
      </label>

      <div
        className="relative rounded-xl px-4 py-3 bg-white text-black flex items-center gap-3
                   shadow-inner transition-all"
        style={{
          fontFamily: "Bebas Neue",
          minHeight: "52px",
        }}
      >
        {home?.logo && (
          <img
            src={home.logo}
            className="w-8 h-8 object-contain"
            alt="home"
          />
        )}

        <span className="text-lg tracking-wide">
          {home?.name || "Belum dipilih"}
        </span>

        {home && (
          <span
            className="absolute right-2 top-2 px-2 py-[1px] text-[13px] font-bold rounded-md tracking-wider"
            style={{
              background: theme,
              color: "white",
              fontFamily: "Bebas Neue",
            }}
          >
            HOME
          </span>
        )}
      </div>
    </div>

    {/* AWAY */}
    <div className="flex flex-col gap-2">
      <label className="text-xs tracking-wide opacity-80">
        AWAY
      </label>

      <div
        className="relative rounded-xl px-4 py-3 bg-white text-black flex items-center gap-3
                   shadow-inner transition-all"
        style={{
          fontFamily: "Bebas Neue",
          minHeight: "52px",
        }}
      >
        {away?.logo && (
          <img
            src={away.logo}
            className="w-8 h-8 object-contain"
            alt="away"
          />
        )}

        <span className="text-lg tracking-wide">
          {away?.name || "Belum dipilih"}
        </span>

        {away && (
          <span
            className="absolute right-2 top-2 px-2 py-[1px] text-[13px] font-bold rounded-md tracking-wider"
            style={{
              background: theme,
              color: "white",
              fontFamily: "Bebas Neue",
            }}
          >
            AWAY
          </span>
        )}
      </div>
    </div>
  </div>
</div>


      {/* SEARCH */}
      <input
        placeholder="Cari tim..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border w-full px-3 py-2 rounded-lg mb-6 text-sm"
      />

      {/* CLUB GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {filtered.map((club, i) => {
          const isHome = home?.id === club.id;
          const isAway = away?.id === club.id;

          const baseShadow =
            "0px 3px 6px rgba(0,0,0,0.20), 0px 6px 12px rgba(0,0,0,0.10)";

          const lifted =
            "0px 6px 12px rgba(0,0,0,0.25), 0px 10px 20px rgba(0,0,0,0.15)";

          return (
            <div
              key={i}
              onClick={() => pick(club)}
              className={`cursor-pointer rounded-xl px-4 py-4
                flex flex-col items-center justify-center gap-2
                transition-all duration-200 ease-out
              `}
              style={{
                backgroundColor: isHome
                  ? HOME_COLOR
                  : isAway
                  ? AWAY_COLOR
                  : "white",

                color: isHome || isAway ? "white" : "black",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: isHome || isAway ? lifted : baseShadow,
                transform: isHome || isAway ? "translateY(-4px)" : "translateY(0)",
              }}
              onMouseEnter={(e) => {
                if (!isHome && !isAway)
                  e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                if (!isHome && !isAway)
                  e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Logo */}
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src={club.logo}
                  alt="team"
                  className="max-w-full max-h-full object-contain"
                  style={{
                    filter: isHome || isAway ? "brightness(0.95)" : "none",
                  }}
                />
              </div>

              <p
                className="text-center text-lg tracking-wide"
                style={{ fontFamily: "Bebas Neue" }}
              >
                {club.name}
              </p>

              {(isHome || isAway) && (
                <span
                  className="px-2 py-[2px] text-xs font-bold rounded-md"
                  style={{
                    background: "white",
                    color: isHome ? HOME_COLOR : AWAY_COLOR,
                  }}
                >
                  {isHome ? "HOME" : "AWAY"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={handlePredict}
          disabled={loading}
          className="px-5 py-2 rounded-lg text-white shadow"
          style={{ backgroundColor: theme, fontFamily: "Bebas Neue" }}
        >
          {loading ? "LOADING..." : "MULAI PREDIKSI"}
        </button>

        <button
          onClick={swapTeams}
          className="px-5 py-2 rounded-lg border"
          style={{ fontFamily: "Bebas Neue" }}
        >
          ↻ TUKAR
        </button>

        <button
          onClick={resetTeams}
          className="px-5 py-2 rounded-lg border"
          style={{ fontFamily: "Bebas Neue" }}
        >
          RESET
        </button>
      </div>
    </div>
  );
}
