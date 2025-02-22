import mongoose from "mongoose";

const bookCayegorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Book category name is required"],
        unix: true,
    },
}, { timestamps: true });

const BookCategory = mongoose.model("BookCategory", bookCayegorySchema);

export default BookCategory;