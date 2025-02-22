import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Book title is required"],
    },
    author: {
        type: String,
        required: [true, "Author name is required"],
    },
    coverSecureUrl: {
        type: String,
        required: [true, "Secure URL for cover image is required"],
    },
    coverPublicUrl: {
        type: String, // Optional: Public link for cover image
    },
    bookSecureUrl: {
        type: String,
        required: [true, "Secure URL for book is required"],
    },
    bookPublicUrl: {
        type: String, // Optional: Public link for book
    },
    bookCategoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookCategory",
        required: [true, "Book category is required"]
    }

},{ timestamps: true });

const Book = mongoose.model("Book", bookSchema);

export default Book;
