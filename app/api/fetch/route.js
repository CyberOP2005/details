import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const psid = searchParams.get("psid");

  if (!psid) {
    return Response.json({ error: "PSID required" }, { status: 400 });
  }

  const pdfPath = path.join(process.cwd(), "public", "results.pdf");
  const buffer = fs.readFileSync(pdfPath);
  const data = await pdf(buffer);

  const lines = data.text.split("\n");

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.includes(psid)) {
      const i = parts.indexOf(psid);

      return Response.json({
        psid,
        physics: parts[i + 4],
        chemistry: parts[i + 5],
        botany: parts[i + 6],
        zoology: parts[i + 7]
      });
    }
  }

  return Response.json({ error: "PSID not found" }, { status: 404 });
}
