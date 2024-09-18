import express from "express";
import { getEmergency } from "../controllers/EmergencyController.js";

const router = express.Router();

router.get("/getEmergency/:occupation", getEmergency); // Route for fetching emergencies by occupation

export default router;
