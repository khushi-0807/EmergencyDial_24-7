import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Emergency from "../models/emergency.model.js";

// User signup
export const signupUser = async (req, res) => {
  try {
    const { fullName, email, address, phoneNo, password, confirmPassword } =
      req.body;

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
  console.log(req.body, "hello");
  try {
    const {
      occupation,
      fullName,
      companyName,
      occupationAddress,
      phoneNo,
      password,
      email,
      features,
      confirmPassword,
    } = req.body;

    if (
      !fullName &&
      !companyName &&
      !occupationAddress &&
      !phoneNo &&
      !password &&
      !email &&
      !occupation &&
      !features &&
      !confirmPassword
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmergency = new Emergency({
      fullname: fullName,
      companyname: companyName,
      occupation,
      email,
      occupationaddress: occupationAddress,
      features,
      phone: phoneNo,
      photo: req.file ? req.file.path : "", // Ensure `photo` is handled correctly
      password: hashedPassword,
    });

    await newEmergency.save();

    res.status(201).json({ message: "Emergency signed up successfully!" });
  } catch (error) {
    console.error("Error in signupEmergency:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login for both user and emergency contacts
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });
    let user = await User.findOne({ email });
    let emergency = null;

    console.log("User found:", user);
    if (!user) {
      emergency = await Emergency.findOne({ email });
      console.log("Emergency contact found:", emergency);
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
      console.log(res.body);
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
        profileType: "emergency",
      });
    }

    return res.status(400).json({ error: "Account Passed" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
