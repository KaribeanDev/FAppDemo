import { pool } from "../db.js";

export async function createHotspotController(req, res) {
  try {
    const { image_id, x, y, width, height, target_image_id } = req.body;
    if ([image_id, x, y, width, height].some(v => v === undefined))
      return res.status(400).json({ error: "Missing fields" });

    const { rows } = await pool.query(
      `INSERT INTO hotspots (image_id, x, y, width, height, target_image_id)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [image_id, x, y, width, height, target_image_id ?? null]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Create hotspot failed" });
  }
}

export async function updateHotspotController(req, res) {
  try {
    const id = Number(req.params.id);
    const { x, y, width, height, target_image_id } = req.body;

    const { rows } = await pool.query(
      `UPDATE hotspots
       SET x=COALESCE($1,x), y=COALESCE($2,y), width=COALESCE($3,width),
           height=COALESCE($4,height), target_image_id=COALESCE($5,target_image_id)
       WHERE id=$6 RETURNING *`,
      [x, y, width, height, target_image_id, id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Hotspot not found" });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Update hotspot failed" });
  }
}

export async function deleteHotspotController(req, res) {
  try {
    const id = Number(req.params.id);
    const result = await pool.query("DELETE FROM hotspots WHERE id=$1", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Hotspot not found" });
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Delete hotspot failed" });
  }
}
