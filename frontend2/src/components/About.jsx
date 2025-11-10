import React from "react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  function goBack() {
    navigate(-1);
  }

  return (
    <div className="min-h-screen w-full bg-[#F6F7F8] px-4 py-10 flex flex-col items-center">

      {/* BACK */}
      <div className="w-full max-w-[1000px] mb-6">
        <button
          onClick={goBack}
          className="text-gray-600 text-sm hover:text-gray-800 transition font-medium"
        >
          ← Kembali
        </button>
      </div>

      {/* TITLE */}
      <h1 className="text-4xl md:text-5xl font-bold tracking-wide mb-10 text-center">
        Tentang
      </h1>

      {/* CONTENT CARD */}
      <div className="w-full max-w-[1000px] bg-white shadow rounded-2xl p-8 md:p-10 flex flex-col gap-10">

        <div className="flex flex-col md:flex-row gap-10 justify-between w-full">

          {/* LEFT CONTENT */}
          <div className="flex-1">
            {/* Tentang Aplikasi */}
            <h2 className="text-xl font-semibold mb-4" style={{ color: "#A50044" }}>
              Tentang Aplikasi
            </h2>

            <p className="mb-1 font-semibold">Judul:</p>
            <p className="leading-relaxed text-[15px] mb-6">
              Prediksi Pertandingan La Liga Berdasarkan Historis
              Pertandingan Menggunakan <i>Negative Binomial Regression</i> dan{" "}
              <i>Bayesian Hierarchical Model</i>.
            </p>

            {/* Pembimbing */}
            <h2 className="text-xl font-semibold mb-3" style={{ color: "#A50044" }}>
              Pembimbing
            </h2>

            <p className="leading-relaxed text-[15px] mb-2">
              <span className="font-semibold">Pembimbing Utama:</span>{" "}
              Prof. Dr. Ir. Dyah Erny Herwindati, M.Si
            </p>
            <p className="leading-relaxed text-[15px] mb-2">
              <span className="font-semibold">Pembimbing Pendamping:</span>{" "}
              Janson Hendryli, S.Kom., M.Kom
            </p>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex flex-col items-center gap-4">
            {/* FOTO */}
            <div className="w-[230px] h-[320px] overflow-hidden rounded-xl border">
              <img
                src="./assets/pasfoto_aldo.png"        
                alt="Foto"
                className="w-full h-full object-cover"
              />
            </div>

            {/* BIODATA BOX */}
            <div className="bg-[#F3F5F7] rounded-xl p-4 w-[230px] text-[15px]">
              <p><span className="font-semibold">Nama:</span> Aldo Hartanto Dewantoro</p>
              <p><span className="font-semibold">NIM:</span> 535220135</p>
              <p><span className="font-semibold">Fakultas:</span> Teknologi Informasi</p>
              <p><span className="font-semibold">Program Studi:</span> Teknik Informatika</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
