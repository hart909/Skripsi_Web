import React from "react";

export default function CTASection({ league }) {
  const isLaliga = league === "laliga";
  const main = isLaliga ? "#A50044" : "#37003C";

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("highlightPredict_aura"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-10 px-4 flex justify-center">
      <div
        className="
          relative max-w-4xl w-full text-white rounded-2xl
          p-10 overflow-hidden select-none
          transform transition duration-300
          hover:-translate-y-2 hover:scale-[1.02]
        "
        style={{
          backgroundColor: main,
          boxShadow: `
            inset 0 0 20px rgba(255,255,255,0.25),
            0 12px 25px rgba(0,0,0,0.35)
          `,
        }}
      >
        {/* — semi glass top highlight */}
        <div
          className="
            absolute top-0 left-0 w-full h-1/3
            pointer-events-none
          "
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(2px)",
          }}
        />


        {/* — accent line kiri */}
        <div
          className="absolute left-0 top-0 h-full w-[6px]"
          style={{ backgroundColor: "white", opacity: 0.9 }}
        />

        {/* — subtitle kecil */}
        <h3 className="text-3xl font-bebas tracking-wide mb-1 drop-shadow">
          Ayo Mulai Prediksi Tim Kamu!
        </h3>

        <p className="text-base font-light mb-6 opacity-90 leading-relaxed">
          Gunakan kemampuan analisismu dan prediksi siapa yang akan menjuarai musim ini.
        </p>

        {/* BUTTON */}
        <button
          onClick={handleClick}
          className="
            px-8 py-3 rounded-xl font-bold text-black text-lg
            bg-white shadow-lg
            hover:shadow-xl hover:scale-[1.05]
            transition
          "
          style={{
            boxShadow: `
              inset 0 0 6px rgba(0,0,0,0.25),
              0 6px 16px rgba(0,0,0,0.35)
            `,
          }}
        >
          Mulai Prediksi
        </button>

      </div>
    </div>
  );
}
