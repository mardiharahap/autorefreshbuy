"use client";
import { useState } from "react";

export default function Page() {
  const [commands, setCommands] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/beli", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commands }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">🛒 Beli Produk KHFY</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white p-4 rounded-2xl shadow">
        <label className="block mb-2 font-semibold">Masukkan Command:</label>
        <textarea
          rows={6}
          className="w-full border rounded-lg p-2 font-mono"
          placeholder={`Contoh:\nbeli BPAL3 087808960796\nbeli BPAL5 083155810399`}
          value={commands}
          onChange={(e) => setCommands(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Memproses..." : "Kirim"}
        </button>
      </form>

      {result && (
        <div className="w-full max-w-3xl mt-6 bg-white rounded-2xl shadow p-4 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-2">📡 Hasil Transaksi</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-2 border">Nomor</th>
                <th className="p-2 border">Produk</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Pesan</th>
              </tr>
            </thead>
            <tbody>
              {result.results.map((r, i) => (
                <tr key={i} className="odd:bg-gray-50 even:bg-gray-100">
                  <td className="border p-2">{r.no}</td>
                  <td className="border p-2">{r.produk}</td>
                  <td className="border p-2">
                    {r.data?.status === "sukses" ? "✅ Sukses" :
                     r.data?.status === "gagal" ? "❌ Gagal" :
                     "⏳ Proses"}
                  </td>
                  <td className="border p-2">{r.data?.msg || r.error || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
