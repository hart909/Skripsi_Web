import React from "react";

export default function LeagueTable({ table, compact, selectedTeam }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4 uppercase tracking-wide">
        Klasemen
      </h2>

      <div className="bg-white rounded-2xl shadow border p-4 overflow-hidden">
        <table className={`w-full tracking-wide ${compact ? "text-[13px]" : "text-[15px]"}`}>
          <thead className="border-b">
            <tr className="text-gray-600 font-semibold">
              <th className="py-2 text-left w-8">POS</th>
              <th className="py-2 text-left">TIM</th>
              <th className="py-2 text-center w-6">P</th>
              <th className="py-2 text-center w-6">M</th>
              <th className="py-2 text-center w-6">S</th>
              <th className="py-2 text-center w-6">K</th>
              <th className="py-2 text-center w-10">PTS</th>
            </tr>
          </thead>

          <tbody>
            {table?.map((row, idx) => {
              let posClass = "bg-gray-200 text-black";

              if (row.position >= 1 && row.position <= 4)
                posClass = "bg-[#0046FF] text-white"; // UCL
              else if (row.position === 5)
                posClass = "bg-orange-500 text-white"; // UEL
              else if (row.position >= 18 && row.position <= 20)
                posClass = "bg-red-600 text-white"; // Relegation

              const isSelected =
                selectedTeam && row.name?.toLowerCase() === selectedTeam.name?.toLowerCase();

              return (
                <tr
                  key={idx}
                  className={`border-b last:border-none hover:bg-gray-50 transition
                    ${isSelected ? "bg-yellow-200 font-bold" : ""}`}
                    style={isSelected ? { backgroundColor: "#ff4f4f", color: "white" } : {}}
                >
                  {/* POS */}
                  <td className="py-2 pr-2">
                    <span
                      className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-full ${posClass}`}
                    >
                      {row.position}
                    </span>
                  </td>

                  {/* TEAM */}
                  <td className="py-2 flex items-center gap-2 font-semibold uppercase">
                    {row.logo && (
                      <img
                        src={row.logo}
                        alt={row.name}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <span>{row.name}</span>
                  </td>

                  <td className="text-center">{row.played}</td>
                  <td className="text-center">{row.won}</td>
                  <td className="text-center">{row.drawn}</td>
                  <td className="text-center">{row.lost}</td>

                  <td className="text-center font-bold text-gray-900">
                    {row.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
