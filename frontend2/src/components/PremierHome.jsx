import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import RecentMatches from "./RecentMatches";
import TopStats from "./TopStats";
import HeroCarousel from "./HeroCarousel";
import LeagueTable from "./LeagueTable";
import CTASection from "./CTASection";
import {BASE_URL} from "../config"

export default function PremierHome() {
  const [matches, setMatches] = useState([]);
  const [table, setTable] = useState([]);

  useEffect(() => {
    fetch("https://89d91acf6036.ngrok-free.app/match/api/epl/last6/")
      .then(res => res.json())
      .then(data => setMatches(data));

    fetch("https://89d91acf6036.ngrok-free.app/match/api/epl/table/")
      .then(res => res.json())
      .then(data => setTable(data));
      
  }, []);
  

  // ✅ CAROUSEL DATA
  const heroSlides = [
    {
      title: "SELAMAT DATANG DI EPL 2025/26",
      subtitle: "Liga Paling Kompetitif di Seluruh Dunia!",
      image:
        "https://theanalyst.com/wp-content/uploads/2024/10/arsenal-vs-liverpool-stats.jpg",
    },
    {
      title: "PERTARUNGAN SENGIT SETIAP MINGGU!",
      subtitle: "Satu Pertandingan Menentukan Segalanya!",
      image:
        "https://static.independent.co.uk/2025/10/19/9/57/Erling-Haaland-fojed7yt.jpeg"
    },
  ];


  const topStatsData = {

  top_scorer: [
    {
      name: "Erling Haaland",
      club: "Manchester City",
      value: 13,
      photo:
        "https://game-assets.fut.gg/cdn-cgi/image/quality=85,format=auto,width=200/2025/futgg-player-item-card/25-201565677.c1d9f74bc9e8b6f14e4e68198ddcd3a7b89f672b95bf0ff006ca6bb03a895cec.webp",
      logo:
        "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
    },
    {
      name: "Antoine Semenyo",
      club: "Bournemouth",
      value: 6,
      photo:
        "https://img.a.transfermarkt.technology/portrait/header/64113-1672665867.jpg",
      logo:
        "https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg",
    },
    {
      name: "Danny Welbeck",
      club: "Brighton",
      value: 6,
      photo:
        "https://img.a.transfermarkt.technology/portrait/header/62838-1659705400.jpg",
      logo:
        "https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg",
    },
    {
      name: "Jean-Philippe Mateta",
      club: "Crystal Palace",
      value: 6,
      photo:
        "https://img.a.transfermarkt.technology/portrait/header/342254-1672665867.jpg",
      logo:
        "https://upload.wikimedia.org/wikipedia/id/0/0c/Crystal_Palace_FC_logo.svg",
    },
  ],

  top_assist: [
    {
      name: "Mohammed Kudus",
      club: "Tottenham Hotspur",
      value: 5,
      photo:
        "https://game-assets.fut.gg/cdn-cgi/image/quality=80,format=auto,width=200/2026/futgg-player-item-card/26-50576803.1e37766bc93c77c59178305e382d170bd5abf099bfcc88d945d3ef0978ee2fea.webp",
      logo:
        "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
    },
    {
      name: "Jack Grealish",
      club: "Everton",
      value: 4,
      photo:
        "https://img.a.transfermarkt.technology/portrait/header/255503-1695138194.jpg",
      logo:
        "https://upload.wikimedia.org/wikipedia/id/7/7c/Everton_FC_logo.svg",
    },
    {
      name: "Quilindschy Hartman",
      club: "West Ham United",
      value: 4,
      photo:
        "https://img.a.transfermarkt.technology/portrait/header/692215-1695138193.jpg",
      logo:
        "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg",
    },
    {
      name: "Georginio Rutter",
      club: "Brighton",
      value: 3,
      photo:
        "https://img.a.transfermarkt.technology/portrait/header/716279-1659705400.jpg",
      logo:
        "https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg",
    },
  ],

  clean_sheet: [
    {
      name: "David Raya",
      club: "Arsenal",
      value: 7,
      photo:
        "https://game-assets.fut.gg/cdn-cgi/image/quality=85,format=auto,width=200/2025/futgg-player-item-card/25-50552549.18dd6b17c6aa0749e7596201fe07be721468491ef3b769a05aa0c4a9012af023.webp",
      logo:
        "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
    },
    {
      name: "Robert Sánchez",
      club: "Chelsea",
      value: 5,
      photo:
        "https://img.a.transfermarkt.technology/portrait/header/351958-1695138192.jpg",
      logo:
        "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
    },
    {
      name: "Nick Pope",
      club: "Newcastle United",
      value: 5,
      photo:
        "https://img.a.transfermarkt.technology/portrait/header/105274-1695138193.jpg",
      logo:
        "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg",
    },
    {
      name: "Dean Henderson",
      club: "Crystal Palace",
      value: 4,
      photo:
        "https://img.a.transfermarkt.technology/portrait/header/351027-1695138194.jpg",
      logo:
        "https://upload.wikimedia.org/wikipedia/id/0/0c/Crystal_Palace_FC_logo.svg",
    },
  ],

};


  return (
    <Layout
      hero={<HeroCarousel slides={heroSlides} />}
      recentMatches={<RecentMatches matches={matches} league="premier" />}
      topStats={<TopStats data={topStatsData} league="premier" />
}
      cta={<CTASection league="premier" />}

      table={<LeagueTable table={table} />}
    />
  );
}
