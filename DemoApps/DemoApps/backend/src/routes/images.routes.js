import express from "express";
import { pool } from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;

/* ============================
   📂 MULTER CONFIG
============================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/* ============================
   📂 ROUTES CATEGORIES
============================ */

// Liste catégories
router.get("/category", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer catégorie
router.post("/category", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Nom requis" });

    const result = await pool.query(
      "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );

    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Ce nom de catégorie existe déjà" });
    }
    res.status(500).json({ error: err.message });
  }
});

// Supprimer catégorie
router.delete("/category/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM categories WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Images d’une catégorie
router.get("/category/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.* 
       FROM images i
       JOIN image_categories ic ON i.id = ic.image_id
       WHERE ic.category_id = $1`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Définir image primaire
router.put("/category/:id/primary", async (req, res) => {
  try {
    const { imageId } = req.body;

    await pool.query(
      "UPDATE categories SET primary_image_id = $1 WHERE id = $2",
      [imageId, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   📂 ROUTE À METTRE AVANT /:id
============================ */

router.get("/categories-with-images", async (req, res) => {
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
  } catch (err) {
    console.error("Erreur /categories-with-images:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   📸 ROUTES IMAGES
============================ */

// Liste images
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.id, i.name, i.url, i.uploaded_at,
             COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name, 'description', c.description))
                      FILTER (WHERE c.id IS NOT NULL), '[]') AS categories
      FROM images i
      LEFT JOIN image_categories ic ON i.id = ic.image_id
      LEFT JOIN categories c ON ic.category_id = c.id
      GROUP BY i.id
      ORDER BY i.id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Détail image
router.get("/:id", async (req, res) => {
  try {
    const img = await pool.query("SELECT * FROM images WHERE id=$1", [req.params.id]);
    if (img.rows.length === 0) return res.status(404).json({ error: "Image non trouvée" });

    const zones = await pool.query("SELECT * FROM hotspots WHERE image_id=$1", [req.params.id]);
    const categories = await pool.query(
      `SELECT c.id, c.name, c.description
       FROM categories c
       INNER JOIN image_categories ic ON c.id = ic.category_id
       WHERE ic.image_id = $1`,
      [req.params.id]
    );

    res.json({ ...img.rows[0], zones: zones.rows, categories: categories.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ajouter image
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { name, hotspots, categoryId, categoryIds } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Aucun fichier reçu" });

    const imageUrl = `${BASE_URL}/uploads/${file.filename}`;

    const result = await pool.query(
      "INSERT INTO images (name, url) VALUES ($1, $2) RETURNING *",
      [name || file.originalname, imageUrl]
    );
    const image = result.rows[0];

    // Catégories
    let categoriesToInsert = [];
    if (categoryIds) {
      try { categoriesToInsert = JSON.parse(categoryIds); }
      catch { categoriesToInsert = []; }
    } else if (categoryId) {
      categoriesToInsert = [Number(categoryId)];
    }

    for (const catId of categoriesToInsert) {
      await pool.query(
        "INSERT INTO image_categories (image_id, category_id) VALUES ($1, $2)",
        [image.id, catId]
      );
    }

    // Hotspots
    if (hotspots) {
      const parsedHotspots = JSON.parse(hotspots);
      for (const h of parsedHotspots) {
        await pool.query(
          "INSERT INTO hotspots (image_id, x, y, width, height, target_image_id) VALUES ($1,$2,$3,$4,$5,$6)",
          [image.id, h.x, h.y, h.width, h.height, h.targetImageId || null]
        );
      }
    }

    res.json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modifier image
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { name, hotspots, categoryId, categoryIds } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = `${BASE_URL}/uploads/${req.file.filename}`;
    }

    await pool.query(
      `UPDATE images
       SET name = COALESCE($1, name),
           url = COALESCE($2, url)
       WHERE id = $3`,
      [name || null, imageUrl, req.params.id]
    );

    // Catégories
    await pool.query("DELETE FROM image_categories WHERE image_id=$1", [req.params.id]);

    let categoriesToInsert = [];
    if (categoryIds) {
      try { categoriesToInsert = JSON.parse(categoryIds); }
      catch { categoriesToInsert = []; }
    } else if (categoryId) {
      categoriesToInsert = [Number(categoryId)];
    }

    for (const catId of categoriesToInsert) {
      await pool.query(
        "INSERT INTO image_categories (image_id, category_id) VALUES ($1, $2)",
        [req.params.id, catId]
      );
    }

    // Hotspots
    await pool.query("DELETE FROM hotspots WHERE image_id=$1", [req.params.id]);

    if (hotspots) {
      const parsedHotspots = Array.isArray(hotspots) ? hotspots : JSON.parse(hotspots);
      for (const h of parsedHotspots) {
        await pool.query(
          "INSERT INTO hotspots (image_id, x, y, width, height, target_image_id) VALUES ($1,$2,$3,$4,$5,$6)",
          [req.params.id, h.x, h.y, h.width, h.height, h.targetImageId || null]
        );
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer image
router.delete("/:id", async (req, res) => {
  try {
    const img = await pool.query("SELECT * FROM images WHERE id=$1", [req.params.id]);
    if (img.rows.length === 0) return res.status(404).json({ error: "Image non trouvée" });

    const filename = path.basename(img.rows[0].url);
    const filePath = path.join(process.cwd(), "uploads", filename);

    await pool.query("DELETE FROM hotspots WHERE image_id=$1", [req.params.id]);
    await pool.query("DELETE FROM image_categories WHERE image_id=$1", [req.params.id]);
    await pool.query("DELETE FROM images WHERE id=$1", [req.params.id]);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ success: true });
  } catch (err) {
    console.error("Erreur DELETE /api/images/:id:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
