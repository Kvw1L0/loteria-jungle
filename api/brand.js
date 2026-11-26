const { put, get, del } = require("@vercel/blob");

const CONFIG_PATH = "brand-config.json";

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

  if (req.method === "GET") {
    try {
      const result = await get(CONFIG_PATH, { access: "public", useCache: false });
      if (!result || result.statusCode !== 200 || !result.stream) {
        return res.status(200).json({ config: null });
      }
      const text = await new Response(result.stream).text();
      const config = JSON.parse(text);
      return res.status(200).json({ config });
    } catch (err) {
      if (err && (err.statusCode === 404 || String(err.message).includes("not found"))) {
        return res.status(200).json({ config: null });
      }
      console.error("GET /api/brand error:", err);
      return res.status(200).json({ config: null });
    }
  }

  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || typeof body !== "object") {
        return res.status(400).json({ error: "Invalid config payload" });
      }

      const blob = await put(CONFIG_PATH, JSON.stringify(body), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        cacheControlMaxAge: 0
      });

      return res.status(200).json({ ok: true, url: blob.url });
    } catch (err) {
      console.error("POST /api/brand error:", err);
      return res.status(500).json({ error: err.message || "Failed to save config" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await del(CONFIG_PATH);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("DELETE /api/brand error:", err);
      return res.status(200).json({ ok: true });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
