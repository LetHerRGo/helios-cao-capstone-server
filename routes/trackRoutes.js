import express from "express";
import verifyToken from "../services/verifyToken.js";
import verifyRole from "../services/verifyRole.js";

const router = express.Router();

router.post('/', verifyToken, verifyRole('forwarder'), (req, res) => {
    const {ctnrNums} = req.body;
    res.send('You are forwarder.')
    console.log(ctnrNums);
})

export default router;