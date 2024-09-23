import bcrypt from "bcryptjs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from "path";
import fs from 'fs';
import User from "../models/user.model.js";
import Emergency from "../models/emergency.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// User signup
export const signupUser = async (req, res) => {
  try {
    const { fullName, email, address, phoneNo, password, confirmPassword ,latitude,longitude} = req.body;
    console.log(req.body);
        // Check if the user or emergency already exists
    const existingUser = await User.findOne({ email });
    const existingEmergency = await Emergency.findOne({ email });

    if (existingUser || existingEmergency) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Validate passwords
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname: fullName,
      email,
      address,
      phone: phoneNo,
      latitude,
      longitude,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Emergency signup
export const signupEmergency = async (req, res) => {
  try {
    const {
      occupation,
      fullName,
      companyName,
      address,
      phoneNo,
      password,
      email,
      features,
      confirmPassword,
      latitude,
      longitude,
      photo, // Assuming this is your Base64 string
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Remove the "data:image/png;base64," prefix
    const base64Data = photo.replace(/^data:image\/png;base64,/, "");
    const imgBuffer = Buffer.from(base64Data, 'base64');

    // Define the image file name and path
    const imageName = `${Date.now()}.png`; // Use a timestamp to create a unique file name
    const uploadsDir = path.join(__dirname, 'uploads'); // Make sure this folder exists
    const photoPath = `/uploads/${imageName}`; // URL path to store in the database

    // Save the image to the uploads directory
    fs.writeFileSync(path.join(uploadsDir, imageName), imgBuffer);

    const newEmergency = new Emergency({
      fullname: fullName,
      companyname: companyName,
      occupation,
      email,
      address,
      features,
      phone: phoneNo,
      latitude,
      longitude,
      photo: photoPath, // Store the relative path in the database
      password: hashedPassword,
    });

    await newEmergency.save();
    res.status(201).json({ message: "Emergency registered successfully!" });
  } catch (error) {
    console.error("Error in signupEmergency:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login for both user and emergency contacts
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    let emergency = null;

    if (!user) {
      emergency = await Emergency.findOne({ email });
    }

    if (!user && !emergency) {
      return res.status(400).json({ error: "Invalid email or password" });
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
        latitude:user.latitude,
        longitude:user.longitude,
        profileType: "user",
      });
    }

    if (emergency) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        emergency.password
      );
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
        latitude:emergency.latitude,
        longitude:emergency.longitude,
        photo: emergency.photo,
        profileType: "emergency",
      });
    }

    return res.status(200).json({ message: "Login successfull!" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
