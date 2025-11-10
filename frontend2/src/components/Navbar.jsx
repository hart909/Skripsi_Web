import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const [highlightBefore, setHighlightBefore] = useState(false);
  const [highlightLive, setHighlightLive] = useState(false);

  // Listen CTA event
  useEffect(() => {
    const handler = () => {
      setHighlightBefore(true);
      setHighlightLive(true);

      setTimeout(() => {
        setHighlightBefore(false);
        setHighlightLive(false);
      }, 2000);
    };

    window.addEventListener("highlightPredict_aura", handler);
    return () => window.removeEventListener("highlightPredict_aura", handler);
  }, []);

  // detect league
  let leagueName = "";
  let leagueLogo = "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg";
  let btnColor = "bg-[#37003C] hover:bg-[#4d0058]";
  let hoverColor = "hover:text-[#37003C]";
  let hlColor = "#37003C";   

  if (pathname.toLowerCase().includes("laliga")) {
    leagueName = "";
    leagueLogo = "https://upload.wikimedia.org/wikipedia/commons/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg";
    btnColor = "bg-[#A50044] hover:bg-[#c80051]";
    hoverColor = "hover:text-[#A50044]";
    hlColor = "#A50044";
  }

  // STYLE stabilo
  const genHL = (isOn) =>
    isOn
      ? {
          backgroundColor: hlColor,
          color: "white",
          borderRadius: "4px",
          padding: "2px 6px",
          transition: "all .25s",
        }
      : {
          transition: "all .25s",
        };

  return (
    <nav className="w-full bg-white border-b shadow-sm px-4 py-3 font-semibold sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-2 select-none cursor-pointer">
          <img src={leagueLogo} alt="League Logo" className="h-8" />
          <span className="text-lg sm:text-xl">{leagueName}</span>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex gap-6 text-sm">

          {/* BEFORE MATCH */}
          <Link
            className={`${hoverColor} transition`}
            style={genHL(highlightBefore)}
            to={pathname.includes("laliga") ? "/laliga/prediksi" : "/premier/prediksi"}
          >
            Prediksi Sebelum Pertandingan
          </Link>

          {/* LIVE MATCH */}
          <Link
            className={`${hoverColor} transition`}
            style={genHL(highlightLive)}
            to={pathname.includes("laliga") ? "/laliga/live" : "/premier/live"}
          >
            Prediksi Waktu Nyata
          </Link>

          <Link
            className={`${hoverColor} transition`}
           to={pathname.includes("laliga") ? "/laliga/statistik" : "/premier/statistik"}
            onClick={() => setOpen(false)}
          >
            Statistik
            </Link>
          <Link
            className={`${hoverColor} transition`}
            to="/about"
            onClick={() => setOpen(false)}
          >
            Tentang
          </Link>

          <Link
            className={`${hoverColor} transition`}
            to="/help"
            onClick={() => setOpen(false)}
          >
            Bantuan
          </Link>
        </div>

        {/* BUTTON */}
        <Link
          to="/"
          className={`${btnColor} hidden lg:block text-white font-semibold px-4 py-2 rounded-md transition`}
        >
          Pilih Liga
        </Link>

        {/* MOBILE */}
        <button className="lg:hidden text-2xl" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="lg:hidden mt-4 flex flex-col gap-4 text-sm px-2 pb-4 animate-fade">

          <Link
            className={`${hoverColor} transition`}
            style={genHL(highlightBefore)}
            to={pathname.includes("laliga") ? "/laliga/prediksi" : "/premier/prediksi"}
          >
            Prediksi Sebelum Pertandingan
          </Link>

          {/* LIVE MATCH */}
          <Link
            className={`${hoverColor} transition`}
            style={genHL(highlightLive)}
            to={pathname.includes("laliga") ? "/laliga/live" : "/premier/live"}
          >
            Prediksi Waktu Nyata
          </Link>

           <Link
            className={`${hoverColor} transition`}
           to={pathname.includes("laliga") ? "/laliga/statistik" : "/premier/statistik"}
            onClick={() => setOpen(false)}
          >
            Statistik
          </Link>

          <Link
            className={`${hoverColor} transition`}
            to="/about"
            onClick={() => setOpen(false)}
          >
            Tentang
          </Link>

          <Link
            className={`${hoverColor} transition`}
            to="/help"
            onClick={() => setOpen(false)}
          >
            Bantuan
          </Link>

          <Link
            to="/"
            className={`${btnColor} text-white font-semibold px-4 py-2 rounded-lg text-center transition`}
            onClick={() => setOpen(false)}
          >
            Pilih Liga
          </Link>
        </div>
      )}
    </nav>
  );
}
