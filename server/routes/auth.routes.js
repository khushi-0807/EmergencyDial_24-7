import express from "express";
import {signupuser,signupemergency} from "../controllers/auth.controller.js"
const router=express.Router();

// router.post("/login",login);

// router.post("/logout",logout);

router.post("/signupuser",signupuser);

router.post("/signupemergency",signupemergency)


export default router;