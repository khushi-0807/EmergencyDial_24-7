import mongoose from "mongoose";

const userSchema=new mongoose.Schema({

    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    address:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    }
})
const User=mongoose.model("User",userSchema);
export default User;