import Problem from "../models/problems.model.js";

const getProblem = async (req, res) => {
  try {
    const { problem } = req.body;
    const newProblem = new Problem(req.body);
    await newProblem.save();
    res.status(201).json({ message: "Problem noted successfully" });
  } catch (error) {
    res.status(400).json({ message: "bad request" });
  }
};

export default getProblem;
