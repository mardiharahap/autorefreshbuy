"use client";

import { useState } from "react";

export default function Home() {
  const [produk, setProduk] = useState("");
  const [nomor, setNomor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanNomor = nomor
      .split("\n")
      .map(n => n.trim())
      .filter(Boolean)
      .join(",");
    setUrl(`/api/beli?produk=${produk}&no=${cleanNomor}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Kirim Transaksi Manual</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Contoh: BPAL5"
          value={produk}
          onChange={e => setProduk(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <textarea
          placeholder="Masukkan nomor, satu per baris"
          value={nomor}
          onChange={e => setNomor(e.target.value)}
          rows="6"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Jalankan
        </button>
      </form>

      {url && (
        <div className="mt-6">
          <p>Link hasil:</p>
          <a href={url} target="_blank" className="text-blue-600 underline">
            {url}
          </a>
        </div>
      )}
    </div>
  );
}
