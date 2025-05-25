import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js"
import trackRoutes from "./routes/trackRoutes.js"
import initKnex from "knex";
import configuration from "./knexfile.js";

const knex = initKnex(configuration);

const app = express();

const logRequest = (req, res, next) => {
  console.log(`Request: ${req.method} for ${req.path}`);
  next();
};

const PORT = process.env.PORT || 9090;

app.use(express.json());

app.use(logRequest);

app.use(cors());

app.get("/", (req, res) => {
  res.send("Catstone API");
});

app.use("/login", authRoutes);
app.use("/track", trackRoutes);

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}...`);
});
