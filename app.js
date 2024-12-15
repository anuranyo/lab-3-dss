const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const apiRoutes = require("./routes/apiRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Статическая папка
app.use(express.static(path.join(__dirname, "public")));

// Маршруты API
app.use("/api", apiRoutes);

// Перенаправление на index.html при переходе на корневой маршрут
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
