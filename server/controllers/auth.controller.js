import Emergency from "../models/emergency.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const signupuser = async (req, res) => {
    try {
      const { fullname, email, address, phone, password, confirmPassword } = req.body;
 
      const user = await User.findOne({ email });
      const emergency = await Emergency.findOne({ email });
  
      if (user || emergency) {
        return res.status(400).json({ error: "Email already exists" });
      }
  
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords don't match" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        fullname,
        email,
        address,
        phone,
        password: hashedPassword,
      });
  
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.log("Error in signup", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

  export const signupemergency = async (req, res) => {
    try {
      const { occupation, fullname, companyname, email, occupationaddress, phone, features, photo, password, confirmPassword } = req.body;
  
      const emergency = await Emergency.findOne({ email });
      const user = await User.findOne({ email });
  
      if (user || emergency) {
        return res.status(400).json({ error: "Email already exists" });
      }
  
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords don't match" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newEmergency = new Emergency({
        occupation,
        fullname,
        companyname,
        email,
        occupationaddress,
        phone,
        features,
        photo,
        password: hashedPassword,
      });
  
      await newEmergency.save();
      res.status(201).json({ message: "Emergency contact registered successfully" });
    } catch (error) {
      console.log("Error in signup", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      
      let emergency = null;
      if (!user) {
        emergency = await Emergency.findOne({ email });
      }

      if (user) {
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
        if (!isPasswordCorrect) {
          return res.status(400).json({ error: "Invalid email or password" });
        }

        return res.status(200).json({
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          address: user.address,
          phone: user.phone,
          profileType: "user"  // To indicate this is a user
        });
      }

      if (emergency) {
        const isPasswordCorrect = await bcrypt.compare(password, emergency.password);
  
        if (!isPasswordCorrect) {
          return res.status(400).json({ error: "Invalid email or password" });
        }

        return res.status(200).json({
          _id: emergency._id,
          fullname: emergency.fullname,
          email: emergency.email,
          companyname: emergency.companyname,
          occupation: emergency.occupation,
          occupationaddress: emergency.occupationaddress,
          phone: emergency.phone,
          features: emergency.features,
          photo: emergency.photo,
          profileType: "emergency"  // To indicate this is an emergency contact
        });
      }

      return res.status(400).json({ error: "Invalid email or password" });
  
    } catch (error) {
      console.log("Error in login", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  