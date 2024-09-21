import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema({
  occupation: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  companyname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  photo: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});
const Emergency = mongoose.model("Emergency", emergencySchema);
export default Emergency;
