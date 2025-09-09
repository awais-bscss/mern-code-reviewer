require("dotenv").config();
const cors = require("cors");

const express = require("express");
const app = express();
const aiRoutes = require("./routes/ai.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/ai", aiRoutes);

module.exports = app;
