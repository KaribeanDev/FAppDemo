import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { pool } from "./db.js";
import imagesRoutes from "./routes/images.routes.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

/* ============================
   🌍 CONFIGURATION CORS
============================ */
const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL || "https://animated-engine-vjxj4xv7r5wc66vp-5173.app.github.dev"
    : "*";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

/* ============================
   📂 STATIC FILES
============================ */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ============================
   ✅ ROUTES
============================ */
app.get("/", (req, res) => {
  res.send("Backend SQL opérationnel 🚀");
});

// Routes images + catégories
app.use("/api/images", imagesRoutes);

/* ============================
   🚀 SERVER START
============================ */
app.listen(PORT, "0.0.0.0", async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log(`✅ Backend SQL démarré sur http://0.0.0.0:${PORT}`);
    console.log("✅ PostgreSQL connecté :", res.rows[0].now);
    console.log("🌍 CORS autorisé pour :", allowedOrigin);

    if (process.env.BASE_URL) {
      console.log(`🌍 Backend accessible via ${process.env.BASE_URL}`);
    }
  } catch (err) {
    console.error("❌ Erreur connexion PostgreSQL :", err.message);
  }
});
