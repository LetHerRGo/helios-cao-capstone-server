import initKnex from "knex";
import express from "express";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const agents = await knex("agent").select("id", "name");
    res.json(agents); 
  } catch (error) {
    res.status(500).json({ message: "Unable to retrieve data." });
  }
});

export default router;