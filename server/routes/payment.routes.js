import express from "express";
import makePayment from "../controllers/payment.controller.js";

const router = express.Router();
router.post("/payment", makePayment);

export default router;
