import express from "express";
import { getUserDetails } from "../controllers/UserController.js";

const router = express.Router();

// Get company details by company ID
router.get("/user/:userId", getUserDetails);

export default router;
