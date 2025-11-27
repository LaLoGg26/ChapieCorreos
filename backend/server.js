import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

import parentRoutes from "./routes/parentRoutes.js";
import childRoutes from "./routes/childRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/parents", parentRoutes);
app.use("/api/children", childRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Servidor de Chapie Correos funcionando!");
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
});
