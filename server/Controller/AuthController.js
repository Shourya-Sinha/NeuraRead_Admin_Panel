import User from "../Models/UserMod.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendMail from "../Utils/Mailer.js";
import moment from "moment";
import dotenv from 'dotenv'
import otpGenerator from 'otp-generator';
dotenv.config()
const hashPassword = async (password) => {
    if (!password) throw new Error('Password is required');
    const hashedPassword = await bcrypt.hash(password.toString(), 12);
    return hashedPassword;
};

export const comparePassword = async (inputPassword, hashedPassword) => {
    try {
        if (!inputPassword || !hashedPassword) {
            throw new Error("Both input and stored passwords are required");
        }
        return await bcrypt.compare(inputPassword.toString(), hashedPassword);
    } catch (error) {
        console.error("Password Comparison Error:", error.message);
        return false;
    }
};

// generate token

const generateToken = (id, email, tokenVersion) => {
    const expiresIn = process.env.JWT_EXPIRY && typeof process.env.JWT_EXPIRY === "string"
        ? process.env.JWT_EXPIRY.trim()
        : "1d"; // Fallback to default 1d if not set properly

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    return jwt.sign({ id, email, tokenVersion }, process.env.JWT_SECRET, { expiresIn });
};


// login user

export const registerUser = async (req, res) => {
    const localTime = moment();
    try {
        console.log('controller body',req.body);
        const { name, email, password, phone } = req.body;
        if (!name) {
            return res.status(400).json({ msg: "Please enter your name" });
        }
        if (!email) {
            return res.status(400).json({ msg: "Please enter email and password" });
        }
        if (!password) {
            return res.status(400).json({ msg: "Please enter email and password" });
        }
        if (!phone) {
            return res.status(400).json({ msg: "Please enter phone number" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists Try new one" });
        }
        const hashedPassword = await hashPassword(password)
        const user = new User({
            userName: name,
            email,
            phoneNo: phone,
            password: hashedPassword,
            createdAt: localTime.toISOString()
        });
        await user.save();
        return res.status(200).json({
            status: "success",
            message: "User Registered Successfully"
        })
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ status: "error", message: "Validation Error", errors: error.errors });
        }

        // Handle Duplicate Key Error (MongoDB Unique Constraint Violation)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0]; // Get the field that caused the duplicate error
            return res.status(400).json({
                status: "error",
                message: `${field === "email" ? "Email" : "Phone number"} already exists. Please use a different one.`,
            });
        }
        return res.status(500).json({ status: "error", message: "Server Error", error })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('body in controller',req.body);

        if (!email) {
            return res.status(400).json({ msg: "Please enter email and password" });
        }
        if (!password) {
            return res.status(400).json({ msg: "Please enter email and password" });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ status: "error", message: "User not found with this email" });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: "error", message: "Invalid password,Try again" });
        }

        // generate token
        const token = generateToken(user._id, user.email, user.tokenVersion)

        // save token in cookies
        res.cookie('user_cred', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 1 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            user: {
                id: user._id,
                name: user.userName,
                email: user.email,
                token: token
            }
        })
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ status: "error", message: "Validation Error", errors: error.errors });
        }
        return res.status(500).json({ status: "error", message: error.message })
    }

}

export const logoutUser = async (req, res) => {
    res.clearCookie('user_cred', { path: '/' });
    return res.status(200).json({ status: "success", message: "User logged out successfully" });
}

export const sendLinkForforgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ msg: "Please enter your email" });
        }
        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "No user found with this email" });
        }
        // generate password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const emailData = {
            recipient: user.email,
            sender: "shouryasinha.c@gmail.com",
            subject: "Reset Password Link",
            html: `You are receiving this email because you (or someone else) requested a password reset for your account.\n\nPlease click on the following link, or paste this URL into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
            text: `You are receiving this email because you (or someone else) requested a password reset for your account.\n\nPlease click on the following link, or paste this URL into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
        }

        await sendMail(emailData);

        return res.status(200).json({
            status: "success",
            message: "Password reset link sent to your email",
            email: user.email,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Server Error", error });
    }
}

export const mobileForgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ msg: "No user found with this email" });
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
            digits: true
        });
        user.otp = otp;
        await user.save();

        // Send OTP to user's registered mobile number
        const emailData = {
            recipient: user.email,
            sender: "shouryasinha.c@gmail.com",
            subject: "Reset Password OTP",
            text: `Your One Time Password (OTP) for password reset is: ${otp}`,
            html: `You are receiving this email because you (or someone else) requested a password reset for your account.\n\nPlease copy otp, and paste next app screen to complete the process:\n\n${otp}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
        }
        await sendMail(emailData);

        return res.status(200).json({
            status: "success",
            message: "Password reset otp sent to your email",
            email: user.email,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Server Error", error });
    }
}

export const mobileVerifyOtp = async (req, res) => {
    try {

        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ msg: "No user found with this email" });
        }
        if (String(user.otp) !== String(otp)) {
            console.log('otp.user, otp.provided',otp.user,otp)
            return res.status(400).json({ msg: "Invalid OTP" });
        }
        user.password = await hashPassword(newPassword);
        user.otp = null; // Reset OTP after use
        await user.save();
        return res.status(200).json({
            status: "success",
            message: "Password reset successfully",
            email: user.email,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Server Error", error });
    }
}
export const verifyAndResetPassword = async (req, res) => {
    try {
        // const { token } = req.params;
        const { token } = req.body;
        const { newPassword } = req.body;

        if (!token) {
            return res.status(400).json({ msg: "Token is required" });
        }
        if (!newPassword) {
            return res.status(400).json({ msg: "New password is required" });
        }
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Check token validity
        });

        if (!user) {
            return res.status(400).json({ msg: "Invalid or expired token" });
        }

        user.password = await hashPassword(newPassword);
        user.resetPasswordToken = null; // Remove token after use
        user.resetPasswordExpires = null;

        await user.save();

        return res.status(200).json({
            status: "success",
            message: "Password reset successfully",
            email: user.email,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Server Error", error });
    }
}

