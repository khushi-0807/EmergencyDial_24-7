import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema({
  problems: [
    {
      type: String,
      required: true,
    },
  ],
});
const Problem = mongoose.model("Problem", ProblemSchema);
export default Problem;
