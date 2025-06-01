import initKnex from "knex";
import express from "express";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);
const router = express.Router();

router.post('/', verifyToken, verifyRole('forwarder'), async (req, res) => {
if (req.user) {
    const agent_id = await knex("agent").select("id").where("name", req.body.agentName).first();
    
    const operator_id = await knex("forwarder_operator").select("id").where("username", req.user.username).first();
    const forwarder_id = await knex("forwarder_operator").select("forwarder_id").where("username", req.user.username).first();
    const client_id = await knex("client").select("id").where("name", req.body.clientName).first();

    if (!agent_id || !operator_id || !client_id || !forwarder_id) {
        return res.status(400).json({ message: "One or more related records not found." });
      }

    const forwarder_ref = req.body.refNum;
    const container_number = req.body.ctnrNum;

    try{
        await knex ('containers').insert({
        container_number: container_number,
        agent_id: agent_id.id,
        operator_id: operator_id.id,
        forwarder_id: forwarder_id.forwarder_id,
        client_id: client_id.id,
        forwarder_ref: forwarder_ref})
        res.json({message: `Container '${container_number}' has been added.`})
    } catch(error) {
        console.log("Insert error:", error);
        res.status(400).json({message: error.message});
    }

}else {
    res.status(401).json({ message: "Unauthorized" });
  }
})




export default router;