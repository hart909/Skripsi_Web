import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LeagueTable from "./LeagueTable";

// import { BASE_URL } from "../config"


export default function StatsLeague({ league }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isLaliga =
    league === "laliga" || location.pathname.toLowerCase().includes("laliga");
  const theme = isLaliga ? "#A50044" : "#37003C";

  // BASE URL
  
  // const BASE_PRED = `${BASE_URL}/api/predict/`;
  // const BASE_MATCH = `${BASE_URL}/match/api/`;
  const BASE_PRED = 'http://127.0.0.1:8000/api/predict/';
  const BASE_MATCH = 'http://127.0.0.1:8000//match/api/';

  const TEAM_URL = isLaliga
    ? BASE_PRED + "teams/laliga/"
    : BASE_PRED + "teams/premier/";

  const TABLE_URL = isLaliga
    ? BASE_MATCH + "laliga/table/"
    : BASE_MATCH + "epl/table/";

  const STAT_URL = (teamId) =>
    `${BASE_MATCH}${isLaliga ? "laliga" : "premier"}/team-stats/${teamId}/`;

  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState(null);
  const [stats, setStats] = useState(null);
  const [table, setTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function goBack() {
    navigate(-1);
  }

  async function fetchTeams() {
    try {
      const r = await fetch(TEAM_URL);
      const d = await r.json();
      setTeams(d);
      if (!team && d.length > 0) setTeam(d[0]);
    } catch {
      setTeams([]);
    }
  }

  async function fetchStats(teamId) {
    if (!teamId) return;
    setLoading(true);
    try {
      const r = await fetch(STAT_URL(teamId));
      const d = await r.json();
      setStats(d);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTable() {
    try {
      const r = await fetch(TABLE_URL);
      const d = await r.json();
      setTable(d);
    } catch {
      setTable([]);
    }
  }

   
  
/* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchTable();
    fetchTeams();
  }, []);



  useEffect(() => {
    if (team?.id) fetchStats(team.id);
  }, [team]);// eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen w-full bg-[#F6F7F8] px-4 py-10 flex flex-col items-center">
      
      {/* Back */}
      <div className="w-full max-w-[1200px] mb-4">
        <button
          className="text-gray-600 text-sm hover:text-gray-800 transition font-bebas text-lg"
          onClick={goBack}
        >
          ← Kembali
        </button>
      </div>

      {/* Title */}
      <h1
        className="text-4xl md:text-5xl font-bebas tracking-wide mb-10 text-center"
        style={{ color: theme }}
      >
        Statistik
      </h1>

      {/* =================== MAIN LAYOUT =================== */}
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row gap-8">

        {/* LEFT */}
        <div
          className="w-full md:w-[240px] bg-white border shadow rounded-xl p-4 flex flex-col items-center shrink-0"
          style={{ borderColor: theme }}
        >
          <label className="text-xs font-semibold mb-2 text-gray-600">
            Pilih Tim
          </label>

          {/* DROPDOWN */}
          <div className="relative w-full select-none mb-4">
            <div
              className="flex items-center justify-between pb-1 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="uppercase tracking-wide font-semibold truncate text-sm">
                {team?.name?.toUpperCase() ?? "PILIH TIM"}
              </span>
              <span>▼</span>
            </div>

            <div className="w-full h-[1px] bg-black"></div>

            {dropdownOpen && (
              <div className="absolute mt-1 bg-white border shadow-lg w-full max-h-56 overflow-y-auto z-50">
                {teams.map((t) => (
                  <div
                    key={t.id}
                    className={`px-3 py-2 cursor-pointer text-sm hover:bg-gray-100 ${
                      t.id === team?.id ? "bg-red-400 text-white" : ""
                    }`}
                    onClick={() => {
                      setTeam(t);
                      setDropdownOpen(false);
                    }}
                  >
                    {t.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {team?.logo && (
            <div className="w-24 h-24 mb-2 flex items-center justify-center">
              <img
                src={team.logo}
                alt="logo"
                className="w-full h-full object-contain rounded"
              />
            </div>
          )}

          <p className="font-bebas text-lg text-center px-2 truncate">
            {team?.name}
          </p>
        </div>

        {/* CENTER */}
        <div className="flex-1 flex flex-col gap-8">
          {/* RECENT */}
          <div className="bg-white border shadow rounded-xl p-6 w-full">
            <h2
              className="font-bebas text-2xl text-center mb-6"
              style={{ color: theme }}
            >
              5 PERTANDINGAN TERAKHIR
            </h2>

            {loading ? (
              <p className="text-center text-gray-600">Loading...</p>
            ) : (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
                {stats?.recent_matches?.map((m, i) => {
                  const result = (m.result || "").toLowerCase();
                  let bg = "#B22222";
                  if (result.includes("menang")) bg = "#1E8F43";
                  else if (result.includes("seri")) bg = "#6C6C6C";

                  return (
                    <div
                      key={i}
                      className="rounded-xl p-4 text-white flex flex-col items-center justify-between text-center w-full max-w-[200px]"
                      style={{
                        background: bg,
                        minHeight: "160px",
                      }}
                    >
                      {m.opponent_logo && (
                        <img
                          src={m.opponent_logo}
                          className="w-12 h-12 mb-2 object-contain"
                          alt={m.opponent}
                        />
                      )}

                      <p className="font-bebas text-sm mb-1 px-1 leading-tight text-center">
                        {m.opponent}
                      </p>

                      <p className="font-bebas text-3xl">{m.score}</p>

                      <p className="text-[12px] mt-1 uppercase">{m.result}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AVERAGE */}
          <div className="flex flex-wrap gap-4 justify-center">
            <StatBox title="Rata-rata Gol Dicetak" value={stats?.avg_goals} />
            <StatBox
              title="Rata-rata Gol Kebobolan"
              value={stats?.avg_conceded}
              red
            />
          </div>

          {/* W D L */}
          <div className="flex flex-wrap gap-4 justify-center">
            <StatBoxSmall label="Menang" value={stats?.wins} />
            <StatBoxSmall label="Seri" value={stats?.draws} />
            <StatBoxSmall label="Kalah" value={stats?.losses} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-[340px]">
          <LeagueTable table={table} compact selectedTeam={team} />
        </div>

      </div>
    </div>
  );
}

/* ========== SMALL COMPONENTS ========== */

function StatBox({ title, value, red }) {
  return (
    <div
      className="w-[220px] bg-black text-white rounded-xl text-center py-4"
      style={red ? { border: "2px solid #B22222" } : {}}
    >
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-3xl font-bold">{value ?? "-"}</p>
    </div>
  );
}

function StatBoxSmall({ label, value }) {
  return (
    <div className="w-[120px] bg-black text-white rounded-xl text-center py-4">
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-2xl font-bold">{value ?? "-"}</p>
    </div>
  );
}
