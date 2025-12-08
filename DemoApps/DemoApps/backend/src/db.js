import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // charge ton .env

// Création du pool de connexion
const pool = new pg.Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Petit test de connexion
async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connecté :", res.rows[0].now);
  } catch (err) {
    console.error("❌ Erreur connexion PostgreSQL :", err);
  }
}

testConnection();

export { pool };
