import express from "express";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";

const router = express.Router();

router.post('/', verifyToken, verifyRole('forwarder'), async (req, res) => {
if (req.user) {
    console.log (req.body);
}
})











export default router;