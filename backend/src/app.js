require("dotenv").config(); // dotenv load karna mandatory hai

const express = require("express");
const app = express();
const aiRoutes = require("./routes/ai.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// AI routes
app.use("/ai", aiRoutes);

module.exports = app;
