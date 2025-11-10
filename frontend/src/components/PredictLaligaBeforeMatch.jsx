import React, { useState } from "react";

function PredictLaligaBeforeMatch() {
  const [homeId, setHomeId] = useState("");
  const [awayId, setAwayId] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  // ⬇️ INI fungsi handleSubmit yang kamu paste tadi ⬇️
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/predict/bhm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          home_id: homeId,
          away_id: awayId,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log("Prediction result:", data);
      setPrediction(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">Prediksi Pre-Match</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Home ID:</label>
          <input
            type="number"
            value={homeId}
            onChange={(e) => setHomeId(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div className="mb-3">
          <label>Away ID:</label>
          <input
            type="number"
            value={awayId}
            onChange={(e) => setAwayId(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-[#7d273f] text-white px-4 py-2 rounded hover:bg-[#5a1d2e]"
        >
          Prediksi
        </button>
      </form>

      {error && <p className="text-red-600 mt-3">{error}</p>}
      {prediction && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
          <p> Home Win: {Math.round(prediction.p_home * 100)}%</p>
          <p> Draw: {Math.round(prediction.p_draw * 100)}%</p>
          <p>🚗 Away Win: {Math.round(prediction.p_away * 100)}%</p>
        </div>
      )}
    </div>
  );
}

export default PredictLaligaBeforeMatch;
