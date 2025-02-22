import User from "../Models/UserMod.js";
import { comparePassword } from "./AuthController.js";
import Book from "../Models/BookModel.js";


export const updateUser = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "user Id not found Login Again" });
        }
        const { name, phone } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (name) {
            user.userName = name;
        }

        if (phone) {
            user.phoneNo = phone;
        }

        await user.save();

        return res.status(200).json({
            status: 'success',
            message: "User Updated Successfully",
            name: user.userName,
            phone: user.phoneNo
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: "server error" || error
        })
    }
}

export const updateEmail = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "user Id not found Login Again" });
        }
        const { currentPassword, newEmail } = req.body;

        if (!currentPassword || !newEmail) {
            return res.status(400).json({ message: "Current password and new email are required." });
        }

        const user = await User.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const isPasswordCorrect = await comparePassword(currentPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect password" });
        }
        res.clearCookie("user_cred");

        user.email = newEmail;
        await user.save();

        return res.status(200).json({
            status: 'success',
            message: "Email Updated Successfully",
            email: user.email
        })

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: "server error" || error
        })
    }
}

export const getAllBooks = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "user Id not found Login Again" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const books = await Book.find();
        if (!books) {
            return res.status(404).json({ message: "No books found" });
        }
        return res.status(200).json({
            status: "success",
            allbooks: books,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const getBookById = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "user Id not found Login Again" });
        }
        const { bookId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json({
            status: "success",
            book: book,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "user Id not found Login Again" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            status: "success",
            user: {
                id: user._id,
                name: user.userName,
                email: user.email,
                phone: user.phoneNo,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

// export const saveContactsForUser = async (req, res) => {
//     try {
//       const userId = req.userId; // Assuming you're using JWT authentication and user info is in req.user
//     //   console.log('body',req.body);
//       const {contacts} = req.body;
  
//       if (!contacts || contacts.length === 0) {
//         return res.status(400).json({ message: 'No contacts provided' });
//       }
  
//       const user = await User.findById(userId);
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Add the new contacts to the user's existing contacts
//       const updatedContacts = [...user.contacts];
  
//       contacts.forEach(contact => {
//         if (!updatedContacts.some(existingContact => existingContact.phoneNumbers.includes(contact.phoneNumbers[0]))) {
//           updatedContacts.push(contact);
//         }
//       });
  
//       user.contacts = updatedContacts;
//       await user.save();
  
//       res.status(200).json({ message: 'Contacts saved successfully', contacts: user.contacts });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   };
export const saveContactsForUser = async (req, res) => {
  try {
    const userId = req.userId; // Assuming JWT authentication provides userId
    const { contacts } = req.body;

    console.log("📥 Received contacts:", JSON.stringify(contacts, null, 2)); // Log received data

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ message: "No valid contacts provided" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure user.contacts is an array
    if (!Array.isArray(user.contacts)) {
      user.contacts = [];
    }

    const updatedContacts = [...user.contacts];

    contacts.forEach((contact) => {
      const numbers = Array.isArray(contact.numbers) ? contact.numbers : []; // Ensure numbers is an array

      // Avoid duplicate numbers
      if (!updatedContacts.some((existingContact) =>
        existingContact.numbers.some(num => numbers.includes(num))
      )) {
        updatedContacts.push({ name: contact.name || "Unknown", numbers });
      }
    });

    user.contacts = updatedContacts;
    await user.save();

    res.status(200).json({ message: "Contacts saved successfully", contacts: user.contacts });
  } catch (error) {
    console.error("🚨 Error in saveContactsForUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

