import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();
app.use(bodyParser.json());
app.use(express.static(join(dirname(fileURLToPath(import.meta.url)), "public")));

const mongoURL = "mongodb://localhost/university-app";
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

// Use student routes for API
app.use("/api", studentRoutes);

// Serve the main HTML page
app.get("/", (req, res) => {
  res.sendFile(join(dirname(fileURLToPath(import.meta.url)), "public", "index.html"));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));