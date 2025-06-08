import initKnex from "knex";
import express from "express";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";
import configuration from "../knexfile.js";
import cnTracking from "../services/cnTracking.js"


const knex = initKnex(configuration);
const router = express.Router();

router.post('/', verifyToken, verifyRole('operator'), async (req, res) => {
if (req.user) {
    
    const agent_id = await knex("agent").select("id").where("name", req.body.agentName).first();
    const operator_id = await knex("forwarder_operator").select("id").where("username", req.user.username).first();
    const forwarder_id = await knex("forwarder_operator").select("forwarder_id").where("username", req.user.username).first();
    const client_id = await knex("client").select("id").where("name", req.body.clientName).first();

    if (!agent_id || !operator_id || !client_id || !forwarder_id) {
        return res.status(400).json({ message: "One or more related records not found." });
      }



    const forwarder_ref = req.body.refNum;
    // const container_number = req.body.ctnrNum;
    // const trackingData = await cnTracking([container_number]);
    // console.log(trackingData);

    const {ctnrNum} = req.body;
    
    

    try{
        const [container_id] = await knex ('containers').insert({
        container_number: ctnrNum,
        agent_id: agent_id.id,
        operator_id: operator_id.id,
        forwarder_id: forwarder_id.forwarder_id,
        client_id: client_id.id,
        forwarder_ref: forwarder_ref})
       
        const trackingData = await cnTracking([ctnrNum]);
        const equipment = trackingData?.ThirdPartyIntermodalShipment?.Equipment?.[0];
        
        await knex ('container_movements').insert({
            container_id: container_id,
            status: "N/A",
            location: equipment.Event?.Location?.Station || "N/A",
            event_description: equipment.Event?.Description || "N/A",
            event_time: equipment.Event?.Time.replace(/ [A-Z]{2,3}$/, "") || null,
            customs_status: equipment.CustomsHold?.Description || "N/A",
            destination: equipment.Destination?.Station || "N/A",
            ETA: equipment.ETA?.Time.replace(/ [A-Z]{2,3}$/, "") || null,
            storage_last_free_day: equipment.StorageCharge?.LastFreeDay || null
        })

        res.json({message: `Container '${ctnrNum}' has been added and tracking info recorded.`})


    } catch(error) {
        console.log("Insert error:", error);
        res.status(400).json({message: error.message});
    }

}else {
    res.status(401).json({ message: "Unauthorized" });
  }
})




export default router;