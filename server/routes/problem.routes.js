import express from "express";
import getProblem from "../controllers/problem.controller.js";

const router = express.Router();
router.post("/getproblem", getProblem);

export default router;
