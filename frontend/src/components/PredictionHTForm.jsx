import { useState } from "react";

export default function PredictionForm() {
  const [mode, setMode] = useState("full");
  const [homeId, setHomeId] = useState("");
  const [awayId, setAwayId] = useState("");
  const [HTHG, setHTHG] = useState("");
  const [HTAG, setHTAG] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    setError(null);
    setResult(null);

    const endpoint =
      mode === "full"
        ? "/api/predict/bhm/"
        : "/api/predict/bhm-ht/";

    const payload =
      mode === "full"
        ? { home_id: homeId, away_id: awayId }
        : { home_id: homeId, away_id: awayId, HTHG, HTAG };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Terjadi kesalahan pada server");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">⚽ Prediksi Pertandingan</h2>

      {/* Pilihan mode */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Mode:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="full">Pre-match (Full)</option>
          <option value="ht">Half-time (HT)</option>
        </select>
      </div>

      {/* Input ID tim */}
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Home ID"
          value={homeId}
          onChange={(e) => setHomeId(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Away ID"
          value={awayId}
          onChange={(e) => setAwayId(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
      </div>

      {/* Input skor HT hanya muncul saat mode ht */}
      {mode === "ht" && (
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            placeholder="HTHG (Home Goals HT)"
            value={HTHG}
            onChange={(e) => setHTHG(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <input
            type="number"
            placeholder="HTAG (Away Goals HT)"
            value={HTAG}
            onChange={(e) => setHTAG(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
        </div>
      )}

      {/* Tombol prediksi */}
      <button
        onClick={handlePredict}
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
      >
        Prediksi
      </button>

      {/* Error */}
      {error && (
        <p className="mt-3 text-center text-red-600">{error}</p>
      )}

      {/* Hasil */}
      {result && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          <p><strong>Mode:</strong> {result.mode}</p>
          <p><strong>P(Home):</strong> {(result.p_home * 100).toFixed(1)}%</p>
          <p><strong>P(Draw):</strong> {(result.p_draw * 100).toFixed(1)}%</p>
          <p><strong>P(Away):</strong> {(result.p_away * 100).toFixed(1)}%</p>
          <p><strong>μ Home:</strong> {result.mu_home.toFixed(2)}</p>
          <p><strong>μ Away:</strong> {result.mu_away.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
