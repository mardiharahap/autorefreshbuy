import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = "8BCDC5E5-2741-40E6-AFAF-66390970BEDA";

    const requests = [
        { no: "083159707199", produk: "BPAL1" },
        { no: "081993638305", produk: "BPAL1" },
        { no: "083824540658", produk: "BPAL1" },
        { no: "083177242774", produk: "BPAL1" },
        { no: "081957427944", produk: "BPAL1" },
        { no: "085941929038", produk: "BPAL1" },
        { no: "083846573200", produk: "BPAL1" },
        { no: "087831770750", produk: "BPAL1" },
        { no: "083168458940", produk: "BPAL1" },
        { no: "083159127892", produk: "BPAL1" },
        { no: "083114237846", produk: "BPAL1" },
        { no: "083894993020", produk: "BPAL3" },
        { no: "083168918321", produk: "BPAL3" },
        { no: "083823284377", produk: "BPAL7" },
        { no: "087849967963", produk: "BPAL7" },
        { no: "083835340099", produk: "BPAL15" },
        { no: "083867777946", produk: "BPAL15" },
        { no: "083850136357", produk: "BPAL3" },
        { no: "083167802624", produk: "BPAL3" },
        { no: "083183287369", produk: "BPAL7" },
        { no: "083119168310", produk: "BPAL11" },
        { no: "083899090704", produk: "BPAL11" },
        { no: "083890718168", produk: "BPAL19" },
        { no: "083840117369", produk: "BPAL19" },
    ];

    const results = await Promise.all(
        requests.map(async ({ no, produk }) => {
            const reff = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const url = `https://panel.khfy-store.com/api_v2/trx?produk=${produk}&tujuan=${no}&reff_id=${reff}&api_key=${apiKey}`;
            try {
                const res = await fetch(url);
                const data = await res.json();
                return { no, produk, data };
            } catch (err) {
                return { no, produk, error: err.message };
            }
        })
    );

    return NextResponse.json(results);
}
