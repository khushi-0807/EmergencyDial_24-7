import express from "express";
import {signupUser,signupEmergency,login} from "../controllers/auth.controller.js";


const router = express.Router();

// Define the signup and login routes
router.post("/signupuser", signupUser);
router.post("/signupemergency",signupEmergency);
router.post("/login", login);

export default router;
