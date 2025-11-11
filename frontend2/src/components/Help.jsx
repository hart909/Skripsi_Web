import React from "react";
import { useNavigate } from "react-router-dom";

export default function Help() {
  const navigate = useNavigate();
  const theme = "#A50044"; // warna utama

  function goBack() {
    navigate(-1);
  }

  const steps = [
    {
      title: "Pilih Liga",
      desc: "Pilih Liga yang tersedia yaitu Laliga dan English Premier League.",
    },
    {
      title: "Masuk ke menu Prediksi (Sebelum Pertandingan & Waktu Nyata)",
      desc: "Pilih tim Home dan tim Away yang akan diprediksi.",
    },
    {
      title: 'Klik tombol "Mulai Prediksi"',
      desc: "Sistem akan memproses data dengan metode Negative Binomial Regression dan Bayesian Hierarchical Model.",
    },
    {
      title: "Lihat hasil prediksi",
      desc: "Hasil ditampilkan berupa probabilitas Menang / Seri / Kalah (H/D/A) dan selisih gol.",
    },
    {
      title: "Lihat Alur Perhitungan",
      desc: "Gunakan menu ini untuk mengetahui bagaimana alur dari setiap algoritma.",
    },
    {
      title: "Cek Statistik Tim",
      desc: "Untuk memahami performa tim lebih detail, buka menu Statistik.",
    },
  ];

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
        BANTUAN
      </h1>

      {/* CONTENT CARD */}
      <div className="w-full max-w-[1000px] bg-white shadow rounded-2xl p-8 md:p-10 flex flex-col gap-8">

        {/* STEP LIST */}
        <div className="flex flex-col gap-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-4">
              {/* NUMBER CIRCLE */}
              <div
                className="w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold shrink-0"
                style={{ backgroundColor: theme }}
              >
                {i + 1}
              </div>

              {/* TEXT */}
              <div>
                <p className="font-semibold text-[16px]">{s.title}</p>
                <p className="text-[15px] text-gray-700">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* NOTE */}
        <div className="bg-[#F3F5F7] rounded-xl p-4 text-[15px]">
          <span className="font-semibold">Catatan:</span>{" "}
          Terdapat dua liga yang dapat dipilih dan ada dua jenis prediksi yang dapat digunakan.
        </div>
      </div>
    </div>
  );
}
