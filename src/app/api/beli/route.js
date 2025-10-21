import { NextResponse } from "next/server";

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

export async function POST(req) {
  const apiKey = "8BCDC5E5-2741-40E6-AFAF-66390970BEDA";
  const { commands } = await req.json();

  // Parsing command seperti "beli BPAL3 087808960796"
  const lines = commands
    .split("\n")
    .map(l => l.trim())
    .filter(l => l && l.toLowerCase().startsWith("beli"));

  const requests = lines.map(line => {
    const parts = line.split(/\s+/);
    return { produk: parts[1]?.toUpperCase(), no: parts[2] };
  });

  const results = [];

  for (const item of requests) {
    const reff = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const url = `https://panel.khfy-store.com/api_v2/trx?produk=${item.produk}&tujuan=${item.no}&reff_id=${reff}&api_key=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      results.push({ ...item, data });
    } catch (err) {
      results.push({ ...item, error: err.message });
    }
    await delay(300); // jeda biar gak kena rate limit
  }

  return NextResponse.json({ results });
}
