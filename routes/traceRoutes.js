import initKnex from "knex";
import express from "express";
import configuration from "../knexfile.js";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";

const knex = initKnex(configuration);
const router = express.Router();

router.get('/', verifyToken, verifyRole('forwarder'), async (req, res) => {
  try {
    const username = req.user.username;
    const operator = await knex("forwarder_operator").where({username}).first();
    if (!operator) {
      return res.status(404).json({ message: "Operator not found" });
    }
    //join data from multiple tables
    const data = await knex("container_movements")
      .join("containers", "container_movements.container_id", "containers.id")
      .leftJoin("agent", "containers.agent_id", "agent.id")
      .leftJoin("client", "containers.client_id", "client.id")
      .where("containers.operator_id", operator.id)
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
    // Step 1: Find the container_id from container_movements
    const movement = await knex("container_movements").where({ id }).first();

    if (!movement) {
      return res.status(404).json({ message: "Container movement not found." });
    }

    const containerId = movement.container_id;

    // Step 2: Delete the container_movements row
    await knex("container_movements").where({ id }).del();

    // Step 3: Delete the corresponding container row
    await knex("containers").where({ id: containerId }).del();

    res.status(200).json({ message: "Container movement and its container deleted successfully." });
  } catch (error) {
    console.error("Error deleting records:", error);
    res.status(500).json({ message: "Failed to delete container movement and container." });
  }
});

export default router;