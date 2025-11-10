import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, RefreshCw, ArrowLeftRight } from "lucide-react";

function PredictionFormEPL({ onStartPredict }) {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:8000/api/predict";
  const TEAMS_URL = `${API_BASE}/teams/premier/`;
  const BHM_URL = `${API_BASE}/bhm/epl/`;
  const NBR_URL = `${API_BASE}/nbr/epl/`;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(TEAMS_URL);
        if (!res.ok) throw new Error("Gagal ambil data tim");
        const data = await res.json();
        setTeams(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeams();
  }, [TEAMS_URL]);

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectTeam = (team) => {
    if (homeTeam && team.id === homeTeam.id) {
      setHomeTeam(null);
      setError(null);
      return;
    }
    if (awayTeam && team.id === awayTeam.id) {
      setAwayTeam(null);
      setError(null);
      return;
    }
    if (homeTeam && awayTeam) {
      setError("Kedua tim sudah dipilih. Reset dulu kalau mau ganti.");
      return;
    }
    if (!homeTeam) {
      setHomeTeam(team);
      setError(null);
      return;
    }
    if (!awayTeam && team.id !== homeTeam.id) {
      setAwayTeam(team);
      setError(null);
      return;
    }
  };

  const handleSwap = () => {
    const temp = homeTeam;
    setHomeTeam(awayTeam);
    setAwayTeam(temp);
  };

  const handleSubmit = async () => {
    if (!homeTeam || !awayTeam) {
      setError("Pilih tim Home dan Away dulu.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const bhmRes = await fetch(BHM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          home_id: homeTeam.id,
          away_id: awayTeam.id,
        }),
      });
      if (!bhmRes.ok) throw new Error(await bhmRes.text());
      const bhm = await bhmRes.json();

      const nbrRes = await fetch(NBR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          home_id: homeTeam.id,
          away_id: awayTeam.id,
        }),
      });
      if (!nbrRes.ok) throw new Error(await nbrRes.text());
      const nbr = await nbrRes.json();

      const data = {
        homeTeam,
        awayTeam,
        // BHM
        p_home: bhm.p_home,
        p_draw: bhm.p_draw,
        p_away: bhm.p_away,
        // NBR
        goal_diff_pred: nbr.goal_diff_pred,
        mu_home: nbr.mu_home,
        mu_away: nbr.mu_away,
        alpha: nbr.alpha,
        contrib_home: nbr.contrib_home ?? [],
        contrib_away: nbr.contrib_away ?? [],
        // Tambahan lambda dari BHM jika ada
        mu_home_mean: bhm.mu_home_mean ?? bhm.mu_home,
        mu_away_mean: bhm.mu_away_mean ?? bhm.mu_away,
      };

      localStorage.setItem("predictionResult", JSON.stringify(data));
      onStartPredict?.(data);
    } catch (err) {
      console.error(err);
      setError("Gagal melakukan prediksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 font-bebas text-2xl max-w-5xl mx-auto">
      <motion.h2
        className="text-center text-4xl font-extrabold mb-8 tracking-wider bg-gradient-to-r from-[#4a0b0b] to-[#ff4b1f] bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Prediksi Sebelum Pertandingan — Premier League
      </motion.h2>

      <motion.div
        className="bg-gradient-to-br from-[#4a0b0b] to-[#660f0f] shadow-2xl rounded-3xl p-8 mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {[{ label: "Home", value: homeTeam }, { label: "Away", value: awayTeam }].map(
            (f, i) => (
              <div className="flex-1" key={i}>
                <label className="block font-semibold text-white mb-1">
                  {f.label}
                </label>
                <motion.input
                  type="text"
                  readOnly
                  value={f.value ? f.value.name : ""}
                  placeholder={`Pilih tim ${f.label}`}
                  className="w-full p-3 border rounded-lg bg-white text-[#470000]"
                  whileFocus={{ scale: 1.03 }}
                />
              </div>
            )
          )}
        </div>
      </motion.div>

      <motion.input
        type="text"
        placeholder="Cari tim..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border-2 border-[#660f0f] rounded-lg mb-6 shadow-inner focus:ring-2 focus:ring-[#ff4b1f]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-8">
        {filteredTeams.map((team) => {
          const isHome = homeTeam?.id === team.id;
          const isAway = awayTeam?.id === team.id;
          let bg = "bg-white/90 hover:bg-gray-100 text-gray-800 border-gray-300";
          if (isHome) bg = "bg-[#1e3a8a] text-white border-blue-600";
          if (isAway) bg = "bg-[#a82a03] text-white border-red-700";
          return (
            <motion.div
              key={team.id}
              onClick={() => handleSelectTeam(team)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`cursor-pointer border rounded-2xl p-4 flex flex-col items-center shadow-lg transition-all duration-300 ${bg}`}
            >
              {team.logo ? (
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-16 h-16 object-contain mb-2"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded mb-2" />
              )}
              <span className="text-2xl font-semibold text-center tracking-wide">
                {team.name}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="flex flex-wrap gap-3 justify-center">
        <motion.button
          onClick={handleSubmit}
          disabled={!homeTeam || !awayTeam || loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#800000] to-[#38003c] text-white px-6 py-3 rounded-full font-semibold shadow-md disabled:opacity-100"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Mulai Prediksi"}
        </motion.button>

        <motion.button
          onClick={handleSwap}
          disabled={!homeTeam || !awayTeam}
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-6 py-3 border-2 border-[#660f0f] rounded-full text-[#660f0f] font-semibold hover:bg-[#660f0f] hover:text-white transition"
        >
          <ArrowLeftRight size={20} /> Tukar
        </motion.button>

        <motion.button
          onClick={() => {
            setHomeTeam(null);
            setAwayTeam(null);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 border-2 border-gray-400 rounded-full text-gray-600 hover:bg-gray-100 font-semibold"
        >
          <RefreshCw size={20} /> Reset
        </motion.button>
      </div>

      {error && (
        <motion.p
          className="text-red-600 mt-6 text-center text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

export default PredictionFormEPL;
