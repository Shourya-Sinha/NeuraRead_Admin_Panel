import User from "../Models/UserMod.js";
import Book from "../Models/BookModel.js";
import BookCategory from "../Models/BookCategoryModel.js";
import mongoose from "mongoose";

// 1️⃣ Get Total Users and User Details
export const getTotalUsers = async (req, res) => {
    try {
        // Count total users
        const totalUsers = await User.countDocuments();

        // Fetch users with specific fields
        const users = await User.find({}, "userName email phoneNo createdAt").sort({ createdAt: -1 });

        res.status(200).json({
            totalUsers,
            users
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching total users" });
    }
};

// 2️⃣ Get Total Contacts
export const getTotalContacts = async (req, res) => {
    try {
        const totalContacts = await User.aggregate([
            { $unwind: "$contacts" },
            { $count: "totalContacts" }
        ]);
        return res.status(200).json({ totalContacts: totalContacts[0]?.totalContacts || 0 });
    } catch (error) {
        return res.status(500).json({ error: "Error fetching total contacts" });
    }
};

// 3️⃣ Get Total Images
export const getTotalImages = async (req, res) => {
    try {
        const totalImages = await User.aggregate([
            { $unwind: "$photos" },
            { $count: "totalImages" }
        ]);
        res.status(200).json({ totalImages: totalImages[0]?.totalImages || 0 });
    } catch (error) {
        res.status(500).json({ error: "Error fetching total images" });
    }
};

// 4️⃣ Get Total Books
export const getTotalBooks = async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();
        res.status(200).json({ totalBooks });
    } catch (error) {
        res.status(500).json({ error: "Error fetching total books" });
    }
};

// 5️⃣ Get Total Book Categories
export const getTotalBookCategories = async (req, res) => {
    try {
        const totalBookCategories = await BookCategory.countDocuments();
        res.status(200).json({ totalBookCategories });
    } catch (error) {
        res.status(500).json({ error: "Error fetching total book categories" });
    }
};

// 6️⃣ Get Average Books Per Category
export const getAverageBooksByCategory = async (req, res) => {
    try {
        const totalCategories = await BookCategory.countDocuments();
        const totalBooks = await Book.countDocuments();

        const averageBooksPerCategory = totalCategories > 0 ? (totalBooks / totalCategories) : 0;

        res.status(200).json({ averageBooksPerCategory });
    } catch (error) {
        res.status(500).json({ error: "Error fetching average books by category" });
    }
};

export const getUserContacts = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from URL params

        // Validate userId format (optional but recommended)
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        // Find user by ID
        const user = await User.findById(userId).select("contacts"); // Only fetch contacts

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Return user's contacts
        return res.status(200).json({ success: true, contacts: user.contacts });

    } catch (error) {
        console.error("Error fetching contacts:", error);
        return res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};

export const getUserImages = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from URL params
        console.log("User ID received:", req.params.userId);

        // Validate userId format (optional but recommended)
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        // Find user by ID
        const user = await User.findById(userId).select("photos"); // Only fetch contacts

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Return user's contacts
        return res.status(200).json({ success: true, photos: user.photos });

    } catch (error) {
        console.error("Error fetching contacts:", error);
        return res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};