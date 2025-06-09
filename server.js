import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js"
import trackRoutes from "./routes/trackRoutes.js"
import addshipmentRoutes from "./routes/addshipmentRoutes.js"
import agentsRoutes from "./routes/agentsRoutes.js"
import clientsRoutes from "./routes/clientsRoutes.js"
import traceRoutes from "./routes/traceRoutes.js"
import initKnex from "knex";
import configuration from "./knexfile.js";
import "./services/updateContainers.js" // update container every 1 mins
import logRoutes from "./routes/logRoutes.js";

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
app.use("/addshipment", addshipmentRoutes);
app.use("/agents", agentsRoutes);
app.use("/clients", clientsRoutes);
app.use("/trace", traceRoutes);
app.use("/logs", logRoutes);

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}...`);
});
