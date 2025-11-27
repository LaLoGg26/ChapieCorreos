import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// GET
router.get("/parent/:parentId", async (req, res) => {
  const { parentId } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM child_emails WHERE parent_id = ? ORDER BY created_at DESC",
      [parentId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST
router.post("/", async (req, res) => {
  const { parent_id, email, phone_number, school_id } = req.body;
  if (!parent_id || !email)
    return res.status(400).json({ error: "Faltan datos" });

  try {
    const [result] = await pool.query(
      "INSERT INTO child_emails (parent_id, email, phone_number, school_id) VALUES (?, ?, ?, ?)",
      [parent_id, email, phone_number, school_id]
    );
    res
      .status(201)
      .json({ id: result.insertId, parent_id, email, phone_number, school_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT (Editar - NUEVO) ✏️
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { email, phone_number, school_id } = req.body;

  try {
    await pool.query(
      "UPDATE child_emails SET email = ?, phone_number = ?, school_id = ? WHERE id = ?",
      [email, phone_number, school_id, id]
    );
    res.json({ message: "Correo hijo actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM child_emails WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
