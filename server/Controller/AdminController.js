import User from "../Models/UserMod.js";
import { v2 as cloudinary } from "cloudinary";
import multer, { memoryStorage } from 'multer';
import sharp from 'sharp';
import Book from "../Models/BookModel.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import BookCategory from "../Models/BookCategoryModel.js";



dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);  // Allow image files
    } else if (
        file.mimetype === "application/pdf" ||  // PDF
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // DOCX
        file.mimetype === "text/plain" // TXT
    ) {
        cb(null, true);  // Allow PDF, DOCX, and TXT
    } else {
        cb(new Error("Unsupported file format"), false);  // Reject other files
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5000000, // 5MB limit for each file
    },
}).fields([
    { name: "book", maxCount: 1 },
    { name: "cover", maxCount: 1 },
]);

const fileFilterss = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type'), false); // Reject non-image files
    }
};

export const uploaduserPhotosMulter = multer({
    storage: storage,
    fileFilter: fileFilterss,
    limits: { fileSize: 20000000 }, // 20MB max
    debug: true
}).fields([
    { name: "photos", maxCount: 10 },
]);


const resizeCover = async (fileBuffer) => {
    try {
        const resizedBuffer = await sharp(fileBuffer)
            .resize({ width: 300, height: 300, fit: sharp.fit.inside })
            .toFormat('jpg')
            .jpeg({ quality: 90 })
            .toBuffer();
        return resizedBuffer;
    } catch (error) {
        throw new Error("Error resizing cover image");
    }
};

// Store file in memory before upload

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.user_cred;
        if (!token) {
            return res.status(401).json({ message: "Access Denied. No Token Provided." });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from DB to validate tokenVersion
        const user = await User.findById(decoded.id).select("email tokenVersion");

        if (!user || user.tokenVersion !== decoded.tokenVersion) {
            console.log('user token version', user.tokenVersion);
            console.log('decoded tokenVersion', decoded.tokenVersion);
            return res.status(403).json({ message: "Invalid or Expired Token" });
        }

        // Attach user info (only ID & email) to request object
        req.userId = user._id;
        req.userEmail = user.email;

        next(); // Continue to the next middleware

    } catch (error) {
        return res.status(403).json({ message: "Invalid Token", error: error.message });
    }
};

export const adminProtectRoute = async (req, res, next) => {
    try {
        // Use req.userId set by protectRoute middleware
        const user = await User.findById(req.userId).select("email role");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access Denied. You are not an admin." });
        }

        next(); // Allow request to proceed

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const uploadBookAndCover = async (req, res) => {
    try {
        const { title, author, category } = req.body;

        if (!req.files || !req.files.book || !req.files.cover) {
            return res.status(400).json({ message: "Both book and cover image are required" });
        }
        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        const bookFile = req.files.book[0];
        const bookMimeType = bookFile.mimetype; // Get file MIME type
        let bookFormat = "pdf"; // Default format

        // Determine file format based on MIME type
        if (bookMimeType === "text/plain") {
            bookFormat = "txt";
        } else if (bookMimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            bookFormat = "docx";
        } else if (bookMimeType !== "application/pdf") {
            return res.status(400).json({ message: "Invalid book format. Only PDF, TXT, and DOCX are allowed." });
        }

        // Upload Book PDF to Cloudinary
        const bookUpload = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: "books",
                    format: bookFormat,
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            ).end(req.files.book[0].buffer);  // ✅ Use `buffer` instead of `stream.pipe()`
        });

        // Resize and Upload Cover Image to Cloudinary
        const resizedCover = await resizeCover(req.files.cover[0].buffer);

        const coverUpload = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "image",
                    folder: "book_covers",
                    format: "jpg",
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            ).end(resizedCover);
        });

        // Save Book details in MongoDB
        const newBook = new Book({
            title,
            author,
            bookSecureUrl: bookUpload.secure_url,
            bookPublicUrl: bookUpload.url,
            coverSecureUrl: coverUpload.secure_url,
            coverPublicUrl: coverUpload.url,
            bookCategoryId: category,  // Assuming category ID is passed in request body
        });

        await newBook.save();

        return res.status(200).json({
            status: "success",
            message: "Book and cover uploaded successfully",
            book: newBook,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

export const createBookCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;

        // Check if category already exists
        const existingCategory = await BookCategory.findOne({ name: categoryName });
        if (existingCategory) {
            return res.status(400).json({ message: "Category name already exists" });
        }

        const newCategory = new BookCategory({ name: categoryName });
        await newCategory.save();

        return res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateBookCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        const id = req.params.id;


        // Check if category exists
        const category = await BookCategory.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Check if another category with the same name exists
        const existingCategory = await BookCategory.findOne({ name: categoryName });
        if (existingCategory && existingCategory._id.toString() !== id) {
            return res.status(400).json({ message: "Category name already exists" });
        }

        // Update category
        category.name = categoryName;
        await category.save();

        return res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteBookCategory = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('body', id)
        // Check if category exists
        const category = await BookCategory.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Delete category
        await category.deleteOne();

        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const title = req.body.title || req.query.title;
        const author = req.body.author || req.query.author;
        const bookCategoryId = req.body.categoryId || req.query.categoryId;

        // Find the book in the database
        let book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Update title and author if provided
        if (title) book.title = title;
        if (author) book.author = author;
        if (bookCategoryId) book.bookCategoryId = bookCategoryId;

        // Handle Book PDF update if uploaded
        if (req.files && req.files.book) {
            if (book.bookSecureUrl) {
                const publicId = book.bookSecureUrl.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
            }

            const bookUpload = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: "raw", folder: "books", format: "pdf" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                ).end(req.files.book[0].buffer);
            });

            book.bookSecureUrl = bookUpload.secure_url;
            book.bookPublicUrl = bookUpload.url;
        }

        // Handle Cover Image update if uploaded
        if (req.files && req.files.cover) {
            if (book.coverSecureUrl) {
                const publicId = book.coverSecureUrl.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }

            const resizedCover = await resizeCover(req.files.cover[0].buffer);

            const coverUpload = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: "image", folder: "book_covers", format: "jpg" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                ).end(resizedCover);
            });

            book.coverSecureUrl = coverUpload.secure_url;
            book.coverPublicUrl = coverUpload.url;
        }

        // Save updated book details
        await book.save();

        return res.status(200).json({ message: "Book updated successfully", book });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        // Find the book in the database
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        console.log("Found Book:", book); // Debugging log to verify the book is found

        // Delete Book File from Cloudinary (if exists)
        if (book.bookSecureUrl) {
            // Correct extraction of public ID for the book file
            const bookPublicId = book.bookSecureUrl.split("/").slice(-2).join("/").split(".")[0]; // Correct extraction
            console.log("Deleting Book File from Cloudinary with ID:", bookPublicId); // Debugging log
            const deletionResult = await cloudinary.uploader.destroy(`books/${bookPublicId}`, { resource_type: "raw" });
            console.log("Book File Deletion Result:", deletionResult); // Log the result from Cloudinary
        }

        // Delete Cover Image from Cloudinary (if exists)
        if (book.coverSecureUrl) {
            // Correct extraction of public ID for the cover image
            const coverPublicId = book.coverSecureUrl.split("/").slice(-2).join("/").split(".")[0]; // Correct extraction
            console.log("Deleting Cover Image from Cloudinary with ID:", coverPublicId); // Debugging log
            const coverDeletionResult = await cloudinary.uploader.destroy(`book_covers/${coverPublicId}`);
            console.log("Cover Image Deletion Result:", coverDeletionResult); // Log the result from Cloudinary
        }

        // Delete the book entry from the database
        // await Book.findByIdAndDelete(bookId);

        return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getAllUser = async (req, res) => {
    try {
        const allUser = await User.find();
        if (!allUser) {
            return res.status(404).json({ message: "No user found" });
        }
        return res.status(200).json({
            status: "success",
            users: allUser
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            status: "success",
            user
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const getAllBookCategories = async (req, res) => {
    try {
        const categories = await BookCategory.find();

        if (categories.length === 0) {
            return res.status(404).json({ status: "error", message: "No categories found" });
        }

        return res.status(200).json({ status: "success", message: "Categories retrieved successfully", categories });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: "Server error", error: error.message });
    }
};

export const getSingleBookCategory = async (req, res) => {
    try {
        const { catId } = req.params;

        // Check if category exists
        const category = await BookCategory.findById(catId);
        if (!category) {
            return res.status(404).json({ status: "error", message: "Category not found" });
        }

        return res.status(200).json({ status: "success", message: "Category retrieved successfully", category });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Server error", error: error.message });
    }
};

export const uploadImagesToCloudinary = async (photos) => {
    const cloudinaryUrls = [];

    for (const photo of photos) {
        try {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: 'user_photos',  // Folder for user photos in Cloudinary
                        format: 'jpg',  // You can change the format based on your requirement
                    },
                    (error, result) => {
                        if (error) return reject(new Error(error.message));
                        resolve(result);
                    }
                ).end(photo.buffer);
            });

            cloudinaryUrls.push(result.secure_url);  // Store the URL of the uploaded image
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }

    return cloudinaryUrls;
};
export const uploadUserPhotos = async (req, res) => {
    try {
        // Log request body and files for debugging
        console.log('Request Body:', req.body);
        console.log('Request Files:', req.files);
        console.log('Request Headers:', req.headers);

        // Upload images using Multer
        uploaduserPhotosMulter(req, res, async (err) => {
            if (err) {
                console.log('Multer error:', err);
                return res.status(400).json({ message: 'Multer error', error: err.message });
            }

            // Check if photos are uploaded
            if (!req.files || !req.files.photos || req.files.photos.length === 0) {
                return res.status(400).json({ message: 'No photos uploaded' });
            }

            // Upload images to Cloudinary and retrieve their URLs
            const uploadedUrls = await uploadImagesToCloudinary(req.files.photos);
            if (uploadedUrls.length === 0) {
                return res.status(500).json({ message: 'Error uploading photos to Cloudinary' });
            }

            // Find user by ID (assuming you have middleware to set `req.userId`)
            const user = await User.findById(req.userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            // Save the uploaded photo URLs to the user's record
            user.photos = [...user.photos, ...uploadedUrls];  // Add new URLs to existing photos array
            await user.save();  // Save user with updated photos

            return res.status(200).json({
                message: 'Photos uploaded successfully',
                photos: uploadedUrls,
            });
        });
    } catch (error) {
        console.error('Error uploading photos:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const uploadBatchPhotos = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if photos are included in the request
        if (!req.files || !req.files.photos || req.files.photos.length === 0) {
            return res.status(400).json({ message: "No photos uploaded" });
        }

        const batchFiles = [];

        // Loop over all uploaded photos
        for (const photo of req.files.photos) {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: "image",
                        folder: "batch_photos",  // Folder for batch photos in Cloudinary
                        format: "jpg",
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                ).end(photo.buffer);
            });

            // Push the Cloudinary URL of the uploaded image to the batchFiles array
            batchFiles.push(result.secure_url);
        }

        // Update the user’s photos with the new batch files using findByIdAndUpdate
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { photos: { $each: batchFiles } } }, // $push with $each to add multiple photos
            { new: true, runValidators: true }
        );

        // Check if the update was successful
        if (!updatedUser) {
            return res.status(404).json({ message: "Failed to update user photos" });
        }

        return res.status(200).json({ message: "Batch photos uploaded successfully", photos: batchFiles });

    } catch (error) {
        console.error('Error uploading batch photos:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const fetchAdminProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("userName email phoneNo createdAt");
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({
            message: "Admin profile fetched successfully",
            user,
        });
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}
