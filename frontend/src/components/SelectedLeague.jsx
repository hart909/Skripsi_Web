// src/components/SelectedLeague.jsx
import React from 'react';

export default function SelectedLeague({ league, onBack }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Liga yang dipilih: {league.name}
      </h1>
      <p className="mb-4 text-gray-700">Kode Liga: {league.code}</p>

      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Ganti Liga
      </button>
    </div>
  );
}
