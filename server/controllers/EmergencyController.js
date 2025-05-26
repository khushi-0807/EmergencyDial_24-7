import mongoose from "mongoose";
import Emergency from "../models/emergency.model.js";

// Get emergency contacts by occupation
export const getEmergency = async (req, res) => {
  const occupation = req.params.occupation; // Get occupation from the URL
  try {
    const companies = await Emergency.find({ occupation }); // Fetch companies with matching occupation
    console.log("Number of companies found:", companies.length);
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get company details by companyId
export const getCompanyDetails = async (req, res) => {
  try {
    const { companyId } = req.params; // Get companyId from the request parameters

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ error: "Invalid companyId format" });
    }

    // Find the emergency provider by companyId

    const emergencyProvider = await Emergency.findById(companyId);

    // If no provider found, return a 404 error
    if (!emergencyProvider) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Send back the company details
    res.status(200).json({
      companyId: emergencyProvider._id,
      companyname: emergencyProvider.companyname,
      occupation: emergencyProvider.occupation,
      address: emergencyProvider.address,
      phone: emergencyProvider.phone,
      latitude: emergencyProvider.latitude,
      longitude: emergencyProvider.longitude,
      features: emergencyProvider.features,
      photo: emergencyProvider.photo,
    });
  } catch (error) {
    console.error("Error fetching company details:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
