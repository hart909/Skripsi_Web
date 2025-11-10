import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import RecentMatches from "./RecentMatches";
import TopStats from "./TopStats";
import HeroCarousel from "./HeroCarousel";
import LeagueTable from "./LeagueTable";
import CTASection from "./CTASection";


export default function LaligaHome() {
  const [matches, setMatches] = useState([]);
  const [table, setTable] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/match/api/laliga/last6/")
      .then((res) => res.json())
      .then((data) => setMatches(data));

    fetch("http://127.0.0.1:8000/match/api/laliga/table/")
      .then((res) => res.json())
      .then((data) => setTable(data));
  }, []);

  // ✅ CAROUSEL DATA
  const heroSlides = [
    {
      title: "SELAMAT DATANG DI LA LIGA 2025/26",
      subtitle: "Kompetisi tertinggi Spanyol!",
      image:
        "https://theanalyst.com/wp-content/uploads/2025/05/raphinha-goal-v-real-madrid.jpg",
    },
    {
      title: "PENUH RIVALITAS & GENGSI",
      subtitle: "Buktikan siapa raja Spanyol!",
      image:
        "https://platform.barcablaugranes.com/wp-content/uploads/sites/21/2025/09/gettyimages-2237906261.jpg?quality=90&strip=all&crop=0%2C2.8552456839309%2C100%2C94.289508632138&w=2400",
    },
  ];

  // ✅ TOP STATS DATA (REALISTIC 2025/26)
  const topStatsData = {
    top_scorer: [
      {
        name: "Kylian Mbappé",
        club: "Real Madrid",
        value: 13,
        photo:
          "https://game-assets.fut.gg/cdn-cgi/image/quality=85,format=auto,width=500/2026/futgg-player-item-card/26-50563395.77db42f75cef28d7836f06221df4bf0adcef2e4bcad099c178314cd3b0881f13.webp",
        logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
      },
      {
        name: "Julián Álvarez",
        club: "Atlético Madrid",
        value: 7,
        photo:
          "https://img.a.transfermarkt.technology/portrait/header/576024-1695138194.jpg",
        logo:
          "https://upload.wikimedia.org/wikipedia/id/f/f9/Atletico_Madrid_Logo_2024.svg",
      },
      {
        name: "Karl Etta Eyong",
        club: "Levante",
        value: 6,
        photo:
          "https://img.a.transfermarkt.technology/portrait/header/1049642-1695138193.jpg",
        logo:
          "https://upload.wikimedia.org/wikipedia/id/7/7b/Levante_Uni%C3%B3n_Deportiva%2C_S.A.D._logo.svg",
      },
      {
        name: "Vinícius Júnior",
        club: "Real Madrid",
        value: 5,
        photo:
          "https://img.a.transfermarkt.technology/portrait/header/371998-1695138192.jpg",
        logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
      },
    ],

    top_assist: [
      {
        name: "Luis Milla",
        club: "Getafe",
        value: 6,
        photo:
          "https://game-assets.fut.gg/cdn-cgi/image/quality=85,format=auto,width=200/2024/futgg-player-item-card/24-242201.818d55f36b31f49088e1813bde25e5a098be9667f9c11b4c73c728287bb93d96.webp",
        logo: "https://upload.wikimedia.org/wikipedia/id/e/ea/Logo_Getafe_logo.svg",
      },
      {
        name: "Lamine Yamal",
        club: "Barcelona",
        value: 5,
        photo:
          "https://img.a.transfermarkt.technology/portrait/header/1022511-1695138193.jpg",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
      },
      {
        name: "Marcus Rashford",
        club: "Barcelona",
        value: 5,
        photo:
          "https://img.a.transfermarkt.technology/portrait/header/258923-1695138193.jpg",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
      },
      {
        name: "Arda Güler",
        club: "Real Madrid",
        value: 5,
        photo:
          "https://img.a.transfermarkt.technology/portrait/header/710743-1695138192.jpg",
        logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
      },
    ],

    clean_sheet: [
      {
        name: "Luiz Júnior",
        club: "Villarreal",
        value: 5,
        photo:
          "https://game-assets.fut.gg/cdn-cgi/image/quality=80,format=auto,width=200/2026/futgg-player-item-card/26-258885.f4dd94140f94d7931b11a320bc0533cd768ef5cad150555460503249609ce0cb.webp",
        logo:
          "https://upload.wikimedia.org/wikipedia/id/2/25/Villarreal_CF_logos-en.svg",
      },
      {
        name: "Thibaut Courtois",
        club: "Real Madrid",
        value: 5,
        photo:
          "https://img.a.transfermarkt.technology/portrait/header/108390-1695138192.jpg",
        logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
      },
      {
        name: "Jan Oblak",
        club: "Atlético Madrid",
        value: 4,
        photo:
          "https://img.a.transfermarkt.technology/portrait/header/121483-1695138194.jpg",
        logo:
          "https://upload.wikimedia.org/wikipedia/id/f/f9/Atletico_Madrid_Logo_2024.svg",
      },
      {
        name: "Marko Dmitrovic",
        club: "Espanyol",
        value: 4,
        photo:
          "https://img.a.transfermarkt.technology/portrait/header/222733-1695138193.jpg",
        logo: "https://upload.wikimedia.org/wikipedia/id/9/92/RCD_Espanyol_crest.svg",
      },
    ],
  };

  return (
    <Layout
      hero={<HeroCarousel slides={heroSlides} />}
      recentMatches={<RecentMatches matches={matches} league="laliga" />}
      topStats={<TopStats data={topStatsData} league="laliga" />}
      cta={<CTASection league="laliga" />}
      table={<LeagueTable table={table} />}
    />
  );
}
