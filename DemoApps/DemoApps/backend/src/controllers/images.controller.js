import { pool } from "../db.js";

/* ============================
   📸 CREATE IMAGE
============================ */
export async function saveImageWithHotspotsController(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { originalname, filename } = req.file;
    const url = `/uploads/${filename}`;
    const hotspots = JSON.parse(req.body.hotspots || "[]");
    const name = req.body.name || originalname;

    // Catégories (single ou multiple)
    let categoryIds = [];
    if (req.body.category_ids) {
      try {
        categoryIds = JSON.parse(req.body.category_ids);
      } catch {
        categoryIds = [];
      }
    } else if (req.body.category_id) {
      categoryIds = [Number(req.body.category_id)];
    }

    const { rows } = await pool.query(
      "INSERT INTO images (name, url) VALUES ($1, $2) RETURNING id",
      [name, url]
    );
    const imageId = rows[0].id;

    // Hotspots
    for (const h of hotspots) {
      await pool.query(
        "INSERT INTO hotspots (image_id, x, y, width, height, target_image_id) VALUES ($1,$2,$3,$4,$5,$6)",
        [imageId, h.x, h.y, h.width, h.height, h.targetImageId || null]
      );
    }

    // Catégories
    for (const catId of categoryIds) {
      await pool.query(
        "INSERT INTO image_categories (image_id, category_id) VALUES ($1, $2)",
        [imageId, catId]
      );
    }

    res.status(201).json({ id: imageId, name, url, hotspots, categoryIds });
  } catch (e) {
    console.error("❌ saveImageWithHotspotsController:", e);
    res.status(500).json({ error: "Save failed" });
  }
}

/* ============================
   📸 LIST IMAGES
============================ */
export async function listImagesController(_req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT i.id, i.name, i.url, i.uploaded_at,
             COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name, 'description', c.description))
                      FILTER (WHERE c.id IS NOT NULL), '[]') AS categories
      FROM images i
      LEFT JOIN image_categories ic ON i.id = ic.image_id
      LEFT JOIN categories c ON ic.category_id = c.id
      GROUP BY i.id
      ORDER BY i.id ASC
    `);

    res.json(rows);
  } catch (e) {
    console.error("❌ listImagesController:", e);
    res.status(500).json({ error: "List failed" });
  }
}

/* ============================
   📸 GET IMAGE + HOTSPOTS
============================ */
export async function getImageWithHotspotsController(req, res) {
  try {
    const id = Number(req.params.id);

    const imgResult = await pool.query("SELECT * FROM images WHERE id=$1", [id]);
    if (imgResult.rowCount === 0) return res.status(404).json({ error: "Image not found" });

    const hotspotsResult = await pool.query(
      "SELECT * FROM hotspots WHERE image_id=$1 ORDER BY id ASC",
      [id]
    );

    const categoriesResult = await pool.query(
      `SELECT c.id, c.name, c.description
       FROM categories c
       INNER JOIN image_categories ic ON c.id = ic.category_id
       WHERE ic.image_id = $1`,
      [id]
    );

    res.json({
      ...imgResult.rows[0],
      zones: hotspotsResult.rows,
      categories: categoriesResult.rows,
    });
  } catch (e) {
    console.error("❌ getImageWithHotspotsController:", e);
    res.status(500).json({ error: "Fetch failed" });
  }
}

/* ============================
   📸 UPDATE IMAGE
============================ */
export async function updateImageWithHotspotsController(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid image id" });

    const hotspots = JSON.parse(req.body.hotspots || "[]");
    const name = req.body.name || null;

    let categoryIds = [];
    if (req.body.category_ids) {
      try {
        categoryIds = JSON.parse(req.body.category_ids);
      } catch {
        categoryIds = [];
      }
    } else if (req.body.category_id) {
      categoryIds = [Number(req.body.category_id)];
    }

    let url = null;
    if (req.file) {
      url = `/uploads/${req.file.filename}`;
    }

    await pool.query(
      `UPDATE images 
       SET name = COALESCE($1, name),
           url = COALESCE($2, url)
       WHERE id = $3`,
      [name, url, id]
    );

    // Hotspots
    await pool.query("DELETE FROM hotspots WHERE image_id=$1", [id]);
    for (const h of hotspots) {
      await pool.query(
        "INSERT INTO hotspots (image_id, x, y, width, height, target_image_id) VALUES ($1,$2,$3,$4,$5,$6)",
        [id, h.x, h.y, h.width, h.height, h.targetImageId || null]
      );
    }

    // Catégories
    await pool.query("DELETE FROM image_categories WHERE image_id=$1", [id]);
    for (const catId of categoryIds) {
      await pool.query(
        "INSERT INTO image_categories (image_id, category_id) VALUES ($1, $2)",
        [id, catId]
      );
    }

    res.json({ id, name, url, categoryIds, hotspots });
  } catch (e) {
    console.error("❌ updateImageWithHotspotsController:", e);
    res.status(500).json({ error: "Update failed" });
  }
}

/* ============================
   📂 CATEGORIES + IMAGES
============================ */
export async function getCategoriesWithImagesController(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        c.id AS category_id,
        c.name AS category_name,
        c.description,
        c.primary_image_id,
        i.id AS image_id,
        i.name AS image_name,
        i.url AS image_url
      FROM categories c
      LEFT JOIN image_categories ic ON ic.category_id = c.id
      LEFT JOIN images i ON i.id = ic.image_id
      ORDER BY c.id, i.id;
    `);

    const categories = {};

    for (const row of result.rows) {
      if (!categories[row.category_id]) {
        categories[row.category_id] = {
          id: row.category_id,
          name: row.category_name,
          description: row.description,
          primary_image_id: row.primary_image_id,
          images: []
        };
      }

      if (row.image_id) {
        categories[row.category_id].images.push({
          id: row.image_id,
          name: row.image_name,
          url: row.image_url
        });
      }
    }

    res.json(Object.values(categories));
  } catch (e) {
    console.error("❌ getCategoriesWithImagesController:", e);
    res.status(500).json({ error: "Fetch failed" });
  }
}
