import express from "express";
import { getCompanyDetails } from "../controllers/EmergencyController.js";

const router = express.Router();

// Get company details by company ID
router.get("/company/:companyId", getCompanyDetails);

export default router;
