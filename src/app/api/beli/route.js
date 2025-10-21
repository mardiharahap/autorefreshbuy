import { NextResponse } from "next/server";

function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

export async function GET() {
    const apiKey = "8BCDC5E5-2741-40E6-AFAF-66390970BEDA";

    const requests = [
        // BPAL3
        { no: "083155810399", produk: "BPAL3" },
        { no: "083836957424", produk: "BPAL3" },
        { no: "083872053702", produk: "BPAL3" },
        { no: "083182682630", produk: "BPAL3" },

        // BPAL5
        { no: "083140135467", produk: "BPAL5" },
        { no: "083829754198", produk: "BPAL5" },
        { no: "083841928427", produk: "BPAL5" },
        { no: "085942067212", produk: "BPAL5" },
        { no: "087849967974", produk: "BPAL5" },
        { no: "083896016335", produk: "BPAL5" },
        { no: "083126453738", produk: "BPAL5" },
        { no: "081998406635", produk: "BPAL5" },
        { no: "083168632463", produk: "BPAL5" },

        // BPAL7
        { no: "083863622087", produk: "BPAL7" },
        { no: "083163816339", produk: "BPAL7" },
        { no: "085923254678", produk: "BPAL7" },
        { no: "083873840683", produk: "BPAL7" },
        { no: "087713877842", produk: "BPAL7" },
        { no: "083121420412", produk: "BPAL7" },
        { no: "083157583090", produk: "BPAL7" },
        { no: "083115640738", produk: "BPAL7" },

        // BPAL9
        { no: "083844952728", produk: "BPAL9" },
        { no: "083893699502", produk: "BPAL9" },
        { no: "083831558647", produk: "BPAL9" },
        { no: "083844536125", produk: "BPAL9" },
        { no: "083862247780", produk: "BPAL9" },
        { no: "083188394115", produk: "BPAL9" },
        { no: "083174066619", produk: "BPAL9" },
        { no: "083196397291", produk: "BPAL9" },
        { no: "083824829238", produk: "BPAL9" },

        // BPAL11
        { no: "083825915666", produk: "BPAL11" },
        { no: "083896016350", produk: "BPAL11" },
        { no: "083199289590", produk: "BPAL11" },

        // BPAL13
        { no: "083837340932", produk: "BPAL13" },

        // BPAL15
        { no: "087896391992", produk: "BPAL15" },
        { no: "083874830599", produk: "BPAL15" },
        { no: "083894211883", produk: "BPAL15" },
        { no: "083173319983", produk: "BPAL15" },

        // BPAL19
        { no: "087846206286", produk: "BPAL19" },
        { no: "087873805118", produk: "BPAL19" },
    ];


    const capacityPerSecond = 4;
    let tokens = capacityPerSecond;

    const refill = setInterval(() => {
        tokens = capacityPerSecond;
    }, 1000);

    const results = [];

    async function sendRequest(item) {
        const reff = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const url = `https://panel.khfy-store.com/api_v2/trx?produk=${item.produk}&tujuan=${item.no}&reff_id=${reff}&api_key=${apiKey}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            if (data.error === "rate_limited" && data.retry_after_ms) {
                await delay(data.retry_after_ms + 10);
                return sendRequest(item);
            }
            return { no: item.no, produk: item.produk, data };
        } catch (err) {
            return { no: item.no, produk: item.produk, error: err.message };
        }
    }

    for (const item of requests) {
        while (tokens <= 0) await delay(10);
        tokens--;
        sendRequest(item).then(res => results.push(res));
    }

    while (results.length < requests.length) await delay(50);
    clearInterval(refill);

    const html = `
        <html>
        <head>
            <title>Hasil Transaksi KHFY</title>
            <meta http-equiv="refresh" content="2">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    background:#f9fafb; 
                    color:#333; 
                    padding:20px;
                }
                h1 { 
                    text-align:center; 
                    color:#111; 
                }
                table { 
                    width:100%; 
                    border-collapse:collapse; 
                    margin-top:20px; 
                    font-size:15px;
                }
                th, td { 
                    border:1px solid #ddd; 
                    padding:8px; 
                    text-align:center; 
                }
                th { 
                    background:#111827; 
                    color:#fff; 
                }
                tr:nth-child(even) { 
                    background:#f3f4f6; 
                }
                .success { color:green; font-weight:bold; }
                .failed { color:red; font-weight:bold; }
                .loading { color:orange; font-weight:bold; }
                .spin {
                    display:inline-block;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <h1>📡 Hasil Transaksi API KHFY Store</h1>
            <table>
                <thead>
                    <tr>
                        <th>No. Tujuan</th>
                        <th>Produk</th>
                        <th>Status</th>
                        <th>Pesan</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map(item => {
        let emoji = "⚙️";
        let statusText = "Proses";
        let message = item.data?.msg || "-";

        if (item.error) {
            emoji = "❌";
            statusText = "Error";
            message = item.error;
        } else if (item.data?.status === "sukses") {
            emoji = "✅";
            statusText = "Sukses";
        } else if (item.data?.status === "gagal") {
            emoji = "❌";
            statusText = "Gagal";
        }

        const cls =
            item.data?.status === "sukses"
                ? "success"
                : item.error
                    ? "failed"
                    : "loading";

        return `
                            <tr>
                                <td>${item.no}</td>
                                <td>${item.produk}</td>
                                <td class="${cls}">
                                    ${item.data?.status === "proses" || !item.data?.status ?
                '<span class="spin">⚙️</span>' : emoji} ${statusText}
                                </td>
                                <td>${message}</td>
                            </tr>
                        `;
    }).join("")}
                </tbody>
            </table>
            <p style="text-align:center; margin-top:20px; color:#6b7280;">
                ⏱️ Auto refresh tiap <b>2 detik</b> — Dibuat dengan ⚡ Next.js API
            </p>
        </body>
        </html>
    `;

    return new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
    });
}
