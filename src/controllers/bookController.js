"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBook = exports.deleteBook = exports.addBook = exports.getAllBooks = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_1 = __importDefault(require("../middleware/error"));
const response_1 = __importDefault(require("../middleware/response"));
dotenv_1.default.config();
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.default.join(__dirname, "../bookData.json");
        const fileContent = yield fs_1.promises.readFile(filePath, "utf-8");
        const books = JSON.parse(fileContent);
        const booksLimit = parseInt(process.env.BOOKS_LIMIT || "10", 10);
        const limitedBooks = books.slice(0, booksLimit);
        return res
            .status(200)
            .json(new response_1.default(200, limitedBooks, "Books Fetch successfully"));
    }
    catch (error) {
        console.error("Error reading books data:", error);
        throw new error_1.default(500, "Internal Server Error");
    }
});
exports.getAllBooks = getAllBooks;
// Handler to add a new book after ensuring it's unique by ISBN.
const addBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author, isbn, publicationDate, genre, price } = req.body;
        // Check if all fields are provided
        if (!title || !author || !isbn || !publicationDate || !genre || !price) {
            throw new error_1.default(400, "All fields are required.");
        }
        const filePath = path_1.default.join(__dirname, "../bookData.json");
        let fileContent = [];
        // Read the existing data from the file
        try {
            const data = yield fs_1.promises.readFile(filePath, "utf-8");
            fileContent = JSON.parse(data);
        }
        catch (err) {
            console.log("File not found or empty. Starting fresh.");
        }
        // Ensure the ISBN is unique
        const existingBook = fileContent.find((book) => book.isbn === isbn);
        if (existingBook) {
            throw new error_1.default(409, "A book with this ISBN already exists.");
        }
        // Create and add the new book
        const newBook = {
            title,
            author,
            isbn,
            publicationDate,
            genre,
            price,
        };
        fileContent.push(newBook);
        // Write the updated data back to the file
        yield fs_1.promises.writeFile(filePath, JSON.stringify(fileContent, null, 2), "utf-8");
        return res
            .status(200)
            .json(new response_1.default(200, newBook, "Book added successfully"));
    }
    catch (error) {
        console.error("Error while adding book:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.addBook = addBook;
// Handler to delete a book by ISBN
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { isbn } = req.params;
    if (!isbn) {
        throw new error_1.default(400, "ISBN is required.");
    }
    try {
        const filePath = path_1.default.join(__dirname, "../bookData.json");
        let fileContent = [];
        // Read the existing book data from the JSON file
        try {
            const data = yield fs_1.promises.readFile(filePath, "utf-8");
            fileContent = JSON.parse(data);
        }
        catch (err) {
            console.log("File not found or empty. Starting fresh.");
            throw new error_1.default(404, "File not found or empty, starting fresh.");
        }
        const isbnNumber = Number(isbn);
        const bookIndex = fileContent.findIndex((book) => book.isbn === isbnNumber);
        if (bookIndex !== -1) {
            // If the book exists, delete it from the list
            fileContent.splice(bookIndex, 1);
            // Write the updated data back to the file
            yield fs_1.promises.writeFile(filePath, JSON.stringify(fileContent, null, 2), "utf-8");
            return res
                .status(200)
                .json(new response_1.default(200, "", "Book deleted successfully"));
        }
        else {
            throw new error_1.default(404, "Book not found.");
        }
    }
    catch (error) {
        console.error("Error while deleting book:", error);
        throw new error_1.default(500, "Internal Server Error");
    }
});
exports.deleteBook = deleteBook;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isbn } = req.query;
        const { title, author, publicationDate, genre, price } = req.body;
        const isbnNumber = Number(isbn);
        // Check if ISBN is provided
        if (!isbn) {
            throw new error_1.default(400, "ISBN is required.");
        }
        // Define file path to book data
        const filePath = path_1.default.join(__dirname, "../bookData.json");
        // Read the existing book data from the JSON file
        const fileContent = yield fs_1.promises.readFile(filePath, "utf-8");
        let bookData = JSON.parse(fileContent);
        // Find the book by ISBN
        const bookIndex = bookData.findIndex((book) => book.isbn === isbnNumber);
        // If book not found, return a 404 error
        if (bookIndex === -1) {
            throw new error_1.default(404, "Book not found.");
        }
        // Update the book details if provided, else keep the old values
        const updatedBook = Object.assign(Object.assign({}, bookData[bookIndex]), { title: title || bookData[bookIndex].title, author: author || bookData[bookIndex].author, publicationDate: publicationDate || bookData[bookIndex].publicationDate, genre: genre || bookData[bookIndex].genre, price: price || bookData[bookIndex].price });
        // Replace the old book data with the updated one
        bookData[bookIndex] = updatedBook;
        // Write the updated book data back to the file
        yield fs_1.promises.writeFile(filePath, JSON.stringify(bookData, null, 2), "utf-8");
        // Return a success response
        return res.status(200).json(new response_1.default(200, updatedBook, "Book updated successfully"));
    }
    catch (error) {
        console.error("Error while updating book:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateBook = updateBook;
