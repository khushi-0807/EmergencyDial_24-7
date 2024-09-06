import Emergency from "../models/emergency.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const signupuser =async(req,res)=>{
    try{
        const {fullname,email,address,phone,password,confirmPassword}=req.body;
        const user=await User.findOne({email});

        if(password!=confirmPassword)
           return res.status(400).json({error:"Passwords don't match"});

        if(user)
            return res.status(400).json({error:"User already exists"});

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser = new User({
            fullname,
            email,
            address,
            phone,
            password:hashedPassword,
        })
        await newUser.save();
    }
    catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({ error: "Internal server error" }); 
      }
}

export const signupemergency =async(req,res)=>{
    try{
        const {occupation,fullname,companyname,email,occupationaddress,phone,featues,photo,password,confirmPassword}=req.body;
        const emergency=await Emergency.findOne({email});

        if(password!=confirmPassword)
           return res.status(400).json({error:"Passwords don't match"});

        if(emergency)
            return res.status(400).json({error:"User already exists"});

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newEmergency = new Emergency({
            occupation,
            fullname,
            companyname,
            email,
            occupationaddress,
            phone,
            featues,
            photo,
            password:hashedPassword
        })
        await newEmergency.save();
    }
    catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({ error: "Internal server error" }); 
      }
}