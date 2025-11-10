import { Routes, Route } from "react-router-dom";

import SelectLeague from "./components/SelectLeague";
import LaligaHome from "./components/LaligaHome";
import PremierHome from "./components/PremierHome";

import PredictionForm from "./components/PredictionForm";
import PredictionFormHT from "./components/PredictionFormHT";
import PredictionResult from "./components/PredictionResult";
import AlurBHM from "./components/AlurBHM";
import AlurNBR from "./components/AlurNBR";
import StatsLeague from "./components/StatsLeague";
import About from "./components/About";
import Help from "./components/Help";

function App() {
  return (
    <Routes>

      {/* PILIH LIGA */}
      <Route path="/" element={<SelectLeague />} />

      {/* HOME */}
      <Route path="/laliga" element={<LaligaHome />} />
      <Route path="/premier" element={<PremierHome />} />

      {/* BEFORE MATCH */}
      <Route
        path="/laliga/prediksi"
        element={<PredictionForm league="laliga" />}
      />
      <Route
        path="/premier/prediksi"
        element={<PredictionForm league="premier" />}
      />

      {/* ✅ HASIL BEFORE MATCH */}
      <Route
        path="/laliga/prediksi/hasil"
        element={<PredictionResult />}
      />
      <Route
        path="/premier/prediksi/hasil"
        element={<PredictionResult />}
      />

      {/* LIVE / HALF TIME */}
      <Route
        path="/laliga/live"
        element={<PredictionFormHT league="laliga" />}
      />
      <Route
        path="/premier/live"
        element={<PredictionFormHT league="premier" />}
      />

      {/* ✅ HASIL LIVE */}
      <Route
        path="/laliga/live/hasil"
        element={<PredictionResult />}
      />
      <Route
        path="/premier/live/hasil"
        element={<PredictionResult />}
      />
    <Route path="/alur/bhm" element={<AlurBHM/>} />
    <Route path="/alur/nbr" element={<AlurNBR/>} />
    <Route path="/laliga/statistik" element={<StatsLeague league="laliga" />} />
    <Route path="/premier/statistik" element={<StatsLeague league="premier" />} />
    <Route path="/about" element={<About />} />
    <Route path="/help" element={<Help />} />
    </Routes>
  );
}

export default App;
