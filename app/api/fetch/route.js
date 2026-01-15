export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const psid = searchParams.get("psid")?.trim();

  if (!psid) {
    return Response.json({ error: "PSID required" }, { status: 400 });
  }

  const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTaKR_Ox9M10woMsBVJke6m0MOvmi7tK4b2et-bDmf1Ht_1G8K1DgSCq-xaxi8jv7zrz3YvBxjW7w0a/pub?output=csv";

  const res = await fetch(SHEET_URL, { cache: "no-store" });
  const csv = await res.text();

  const rows = csv
    .split("\n")
    .map(r =>
      r.replace(/\r/g, "")
       .split(",")
       .map(c => c.replace(/"/g, "").trim())
    );

  // Header row
  const header = rows[0].map(h => h.toUpperCase());

  const psidIndex = header.indexOf("PSID");
  const phyIndex = header.indexOf("PHY");
  const chemIndex = header.indexOf("CHEM");
  const botIndex = header.indexOf("BOT");
  const zooIndex = header.indexOf("ZOO");

  if (psidIndex === -1) {
    return Response.json({ error: "PSID column not found" }, { status: 500 });
  }

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][psidIndex] === psid) {
      return Response.json({
        psid,
        physics: rows[i][phyIndex],
        chemistry: rows[i][chemIndex],
        botany: rows[i][botIndex],
        zoology: rows[i][zooIndex]
      });
    }
  }

  return Response.json({ error: "PSID not found" }, { status: 404 });
}
