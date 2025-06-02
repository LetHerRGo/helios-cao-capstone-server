import initKnex from "knex";
import express from "express";
import configuration from "../knexfile.js";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";

const knex = initKnex(configuration);
const router = express.Router();

router.get('/', verifyToken, verifyRole('forwarder'), async (req, res) => {
  try {
    const data = await knex("container_movements")
      .join("containers", "container_movements.container_id", "containers.id")
      .leftJoin("agent", "containers.agent_id", "agent.id")
      .leftJoin("client", "containers.client_id", "client.id")
      .select(
        "container_movements.*",
        "containers.container_number",
        "containers.forwarder_ref",
        "agent.name as agent_name",
        "client.name as client_name"
      );
      res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving container movement data:", error);
    res.status(500).json({ message: "Failed to retrieve data" });
  }
});

router.delete('/:id', verifyToken, verifyRole('forwarder'), async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await knex("container_movements").where({ id }).del();

    if (deleted) {
      res.status(200).json({ message: "Container movement deleted successfully." });
    } else {
      res.status(404).json({ message: "Container movement not found." });
    }
  } catch (error) {
    console.error("Error deleting container movement:", error);
    res.status(500).json({ message: "Failed to delete container movement." });
  }
});

export default router;