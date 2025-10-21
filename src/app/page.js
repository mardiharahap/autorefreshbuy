"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResults([]);

    const res = await fetch("/api/beli", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          🛒 Kirim Daftar Pembelian
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows="8"
            placeholder={`Contoh format:\nbeli BPAL3 087808960796\nbeli BPAL5 083182682630\nbeli BPAL7 083873840683`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border border-gray-300 p-3 rounded w-full text-sm font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Kirim"}
          </button>
        </form>

        {results.length > 0 && (
          <div className="mt-8 bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold mb-3">
              ✅ Hasil Transaksi ({results.length})
            </h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border p-2">#</th>
                  <th className="border p-2">Nomor</th>
                  <th className="border p-2">Produk</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2 font-mono">{r.no}</td>
                    <td className="border p-2">{r.produk}</td>
                    <td className="border p-2">
                      {r.error ? (
                        <span className="text-red-600">❌ {r.error}</span>
                      ) : (
                        <span className="text-green-600">✅ {r.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
