import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM schools ORDER BY name ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { name, price } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO schools (name, price) VALUES (?, ?)",
      [name, price]
    );
    res.status(201).json({ id: result.insertId, name, price });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM schools WHERE id = ?", [req.params.id]);
    res.json({ message: "Escuela eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
