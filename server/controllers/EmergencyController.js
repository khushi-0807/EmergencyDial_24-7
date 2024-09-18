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
