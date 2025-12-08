import { pool } from "../db.js";

// Admin : sauvegarde finale image + hotspots
export async function saveImageWithHotspotsController(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { originalname, filename } = req.file;
    const url = `/uploads/${filename}`;
    const hotspots = JSON.parse(req.body.hotspots || "[]");

    // Sauvegarde image
    const { rows } = await pool.query(
      "INSERT INTO images (name, url) VALUES ($1, $2) RETURNING id",
      [originalname, url]
    );
    const imageId = rows[0].id;

    // Sauvegarde hotspots liés
    for (const h of hotspots) {
      await pool.query(
        "INSERT INTO hotspots (image_id, x, y, width, height, target_image_id) VALUES ($1,$2,$3,$4,$5,$6)",
        [imageId, h.x, h.y, h.width, h.height, h.targetImageId || null]
      );
    }

    res.status(201).json({ id: imageId, url, hotspots });
  } catch (e) {
    console.error("❌ Erreur saveImageWithHotspotsController:", e);
    res.status(500).json({ error: "Save failed" });
  }
}

// User : liste des images
export async function listImagesController(_req, res) {
  try {
    const { rows } = await pool.query("SELECT * FROM images ORDER BY id ASC");
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "List failed" });
  }
}

// User : image + hotspots
export async function getImageWithHotspotsController(req, res) {
  try {
    const id = Number(req.params.id);
    const imgResult = await pool.query("SELECT * FROM images WHERE id=$1", [id]);
    if (imgResult.rowCount === 0) return res.status(404).json({ error: "Image not found" });

    const hotspotsResult = await pool.query(
      "SELECT * FROM hotspots WHERE image_id=$1 ORDER BY id ASC",
      [id]
    );
    res.json({
      ...imgResult.rows[0],
      zones: hotspotsResult.rows,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Fetch failed" });
  }
}
