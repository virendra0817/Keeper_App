// server.js
import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Connect to PostgreSQL using environment variables from Render
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // allow self-signed certificates
  },
});


// ✅ Root route (for testing if backend is alive)
app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

// ✅ Get all notes
app.get("/notes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).send("Server error");
  }
});

// ✅ Add a new note
app.post("/notes", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const result = await pool.query(
      "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting note:", err);
    res.status(500).send("Server error");
  }
});

// ✅ Delete a note
app.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM notes WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).send("Server error");
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
