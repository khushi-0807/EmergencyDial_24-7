import express from "express";
import {signupuser,signupemergency,login} from "../controllers/auth.controller.js"
const router=express.Router();


router.post("/signupuser",signupuser);

router.post("/signupemergency",signupemergency)

router.post("/login",login);


export default router;