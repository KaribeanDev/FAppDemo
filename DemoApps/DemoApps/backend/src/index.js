import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config(); // charge les variables du fichier .env

console.log(">>> index.js chargé et routes enregistrées <<<");

const { Pool } = pkg;

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Connexion à PostgreSQL avec les variables .env
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// --- Liste des images ---
app.get("/api/images", async (req, res) => {
  try {
    console.log("Route GET /api/images appelée");
    const result = await pool.query("SELECT * FROM images ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur SQL GET /api/images:", err);
    res.status(500).json({ error: "Erreur récupération images" });
  }
});

// --- Récupérer une image avec ses zones ---
app.get("/api/images/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    console.log("Route GET /api/images/:id appelée avec id =", id);

    const imageResult = await pool.query("SELECT * FROM images WHERE id=$1", [id]);
    if (imageResult.rows.length === 0) return res.status(404).json({ error: "Image not found" });

    const hotspotsResult = await pool.query("SELECT * FROM hotspots WHERE image_id=$1", [id]);
    const image = imageResult.rows[0];
    image.zones = hotspotsResult.rows;
    res.json(image);
  } catch (err) {
    console.error("Erreur SQL GET /api/images/:id:", err);
    res.status(500).json({ error: "Erreur récupération image" });
  }
});

// --- Ajouter une nouvelle image ---
app.post("/api/images", upload.single("file"), async (req, res) => {
  try {
    console.log("Route POST /api/images appelée");
    const file = req.file;
    const hotspots = JSON.parse(req.body.hotspots || "[]");

    const insertImage = await pool.query(
      "INSERT INTO images (name, url) VALUES ($1, $2) RETURNING *",
      [file.originalname, "/uploads/" + file.filename]
    );

    const image = insertImage.rows[0];

    // Insérer les hotspots liés
    for (const h of hotspots) {
      await pool.query(
        "INSERT INTO hotspots (image_id, x, y, width, height, target_image_id) VALUES ($1,$2,$3,$4,$5,$6)",
        [image.id, h.x, h.y, h.width, h.height, h.targetImageId || null]
      );
    }

    res.json(image);
  } catch (err) {
    console.error("Erreur SQL POST /api/images:", err);
    res.status(500).json({ error: "Erreur ajout image" });
  }
});

// --- Mettre à jour les zones d’une image existante ---
app.put("/api/images/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    console.log("Route PUT /api/images/:id appelée avec id =", id);
    const hotspots = req.body.hotspots || [];

    // Supprimer les anciens hotspots
    await pool.query("DELETE FROM hotspots WHERE image_id=$1", [id]);

    // Réinsérer les nouveaux
    for (const h of hotspots) {
      await pool.query(
        "INSERT INTO hotspots (image_id, x, y, width, height, target_image_id) VALUES ($1,$2,$3,$4,$5,$6)",
        [id, h.x, h.y, h.width, h.height, h.targetImageId || null]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Erreur SQL PUT /api/images/:id:", err);
    res.status(500).json({ error: "Erreur mise à jour zones" });
  }
});

// --- Supprimer une image (et son fichier physique) ---
app.delete("/api/images/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    console.log("Route DELETE /api/images/:id appelée avec id =", id);

    // Récupérer l'image pour supprimer le fichier
    const imageResult = await pool.query("SELECT * FROM images WHERE id=$1", [id]);
    if (imageResult.rows.length === 0) return res.status(404).json({ error: "Image not found" });

    const image = imageResult.rows[0];

    // Supprimer l'image (hotspots supprimés automatiquement via ON DELETE CASCADE)
    await pool.query("DELETE FROM images WHERE id=$1", [id]);

    // Supprimer le fichier physique
    try {
      const filename = path.basename(image.url); // ex: "abc123.png"
      const filePath = path.join(process.cwd(), "uploads", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.warn("Impossible de supprimer le fichier physique:", err.message);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Erreur SQL DELETE /api/images/:id:", err);
    res.status(500).json({ error: "Erreur suppression image" });
  }
});

// --- Lancement du serveur ---
app.listen(process.env.PORT || 4000, () =>
  console.log(`Backend SQL démarré sur http://localhost:${process.env.PORT || 4000}`)
);
