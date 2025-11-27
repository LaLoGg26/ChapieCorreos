import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // 1. Calcular INGRESOS (Escuelas * Precio)
    const incomeQuery = `
            SELECT 
                s.name as school_name, 
                s.price, 
                COUNT(c.id) as total_emails,
                (COUNT(c.id) * s.price) as total_earnings
            FROM schools s
            LEFT JOIN child_emails c ON s.id = c.school_id
            GROUP BY s.id
            ORDER BY total_earnings DESC
        `;
    const [incomeRows] = await pool.query(incomeQuery);

    // Suma total de ingresos
    const grossIncome = incomeRows.reduce(
      (acc, curr) => acc + Number(curr.total_earnings),
      0
    );

    // 2. Calcular EGRESOS (Suma de contadores de padres * $20)
    const [parentRows] = await pool.query(
      "SELECT SUM(counter) as total_clicks FROM parent_emails"
    );
    const totalClicks = parentRows[0].total_clicks || 0;
    const deductions = totalClicks * 20;

    // 3. Calcular GANANCIA NETA
    const netProfit = grossIncome - deductions;

    res.json({
      stats: incomeRows,
      grossIncome,
      deductions,
      netProfit,
      totalClicks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
