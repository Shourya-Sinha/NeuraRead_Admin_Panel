import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required: [true, "User Full Name is Required"],
    },
    email:{
        type: String,
        required: [true, "Email is Required"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Invalid Email Address"]
    },
    password:{
        type: String,
        required: [true, "Password is Required"],
        minlength: 6,
        select: false
    },
    phoneNo:{
        type: String,
        required: [true, "Phone Number is Required"],
        unique: true,
        match: [/\d{10}/, "Invalid Phone Number"]
    },
    resetPasswordToken :{
        type: String,
        select: false
    },
    resetPasswordExpires :{
        type: Date,
        select: false
    },
    tokenVersion :{
        type: Number,
        default: 0
    },
    role:{
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    otp:{
        type: Number,
    },
    contacts:{
        type: Array,
        default: []
    },
    photos: [{ type: String }],
});

const User = mongoose.model("User", userSchema);

export default User;