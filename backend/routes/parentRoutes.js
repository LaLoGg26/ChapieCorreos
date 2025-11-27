import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// GET
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM parent_emails ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST (Crear)
router.post("/", async (req, res) => {
  const { email, name, password } = req.body;
  if (!email) return res.status(400).json({ error: "El email es obligatorio" });

  try {
    const [result] = await pool.query(
      "INSERT INTO parent_emails (email, name, password) VALUES (?, ?, ?)",
      [email, name, password]
    );
    res.status(201).json({ id: result.insertId, email, name, password });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY")
      return res.status(400).json({ error: "Correo ya registrado" });
    res.status(500).json({ error: error.message });
  }
});

// PUT (Editar - NUEVO) ✏️
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { email, name, password } = req.body;

  try {
    await pool.query(
      "UPDATE parent_emails SET email = ?, name = ?, password = ? WHERE id = ?",
      [email, name, password, id]
    );
    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT (Incrementar Contador)
router.put("/:id/increment", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE parent_emails SET counter = counter + 1 WHERE id = ?",
      [id]
    );
    res.json({ message: "Contador incrementado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "DELETE FROM parent_emails WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
