import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const produk = searchParams.get("produk");
    const tujuan = searchParams.get("tujuan");
    const reff_id = searchParams.get("reff_id");
    const api_key = "5CF5EE68-FD0A-41D4-93D7-2AAF7BF69E08";

    if (!produk || !tujuan || !reff_id)
        return NextResponse.json(
            { status: false, message: "Parameter tidak lengkap" },
            { status: 400 }
        );

    try {
        const apiUrl = `https://panel.khfy-store.com/api_v2/trx?produk=${encodeURIComponent(
            produk
        )}&tujuan=${encodeURIComponent(
            tujuan
        )}&reff_id=${reff_id}&api_key=${api_key}`;

        const res = await fetch(apiUrl, { cache: "no-store" });
        const text = await res.text();

        // coba parse JSON, kalau gagal kirim teks mentah
        try {
            const data = JSON.parse(text);
            return NextResponse.json(data);
        } catch {
            return NextResponse.json({ status: true, message: text });
        }
    } catch (err) {
        return NextResponse.json(
            { status: false, message: "Server proxy error: " + err.message },
            { status: 500 }
        );
    }
}
