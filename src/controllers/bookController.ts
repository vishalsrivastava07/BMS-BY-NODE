import { promises as fs } from "fs";
import path from "path";
import { Request, RequestHandler, Response } from "express";
import dotenv from "dotenv";
import apiError from "../middleware/error";
import apiResponse from "../middleware/response";

dotenv.config();

export const getAllBooks: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
      const filePath = path.join(__dirname, "../bookData.json");
      let books = [];
      
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        // Handle empty file case
        if (fileContent.trim()) {
          books = JSON.parse(fileContent);
        }
      } catch (error) {
        console.log("Error reading file:", error);
        // If file doesn't exist, create it with empty array
        await fs.writeFile(filePath, '[]', 'utf-8');
      }
  
      const booksLimit = parseInt(process.env.BOOKS_LIMIT || "10", 10);
      const limitedBooks = books.slice(0, booksLimit);
  
      return res
        .status(200)
        .json(new apiResponse(200, limitedBooks, "Books fetched successfully"));
  
    } catch (error) {
      console.error("Error in getAllBooks:", error);
      return res
        .status(500)
        .json(new apiResponse(500, null, "Internal Server Error"));
    }
};

// Handler to add a new book after ensuring it's unique by ISBN.
export const addBook: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { title, author, isbn, publicationDate, genre, price } = req.body;

    // Check if all fields are provided
    if (!title || !author || !isbn || !publicationDate || !genre || !price) {
      throw new apiError(400, "All fields are required.");
    }

    const filePath = path.join(__dirname, "../bookData.json");
    let fileContent: any[] = [];

    // Read the existing data from the file
    try {
      const data = await fs.readFile(filePath, "utf-8");
      fileContent = JSON.parse(data);
    } catch (err) {
      console.log("File not found or empty. Starting fresh.");
    }

    // Ensure the ISBN is unique
    const existingBook = fileContent.find((book) => book.isbn === isbn);
    if (existingBook) {
      throw new apiError(409, "A book with this ISBN already exists.");
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
    await fs.writeFile(filePath, JSON.stringify(fileContent, null, 2), "utf-8");

    return res
      .status(201)
      .json(new apiResponse(201, newBook, "Book added successfully"));
  } catch (error) {
    console.error("Error while adding book:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Handler to delete a book by ID (previously ISBN)
export const deleteBook: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  if (!id) {
    throw new apiError(400, "Book ID is required.");
  }

  try {
    const filePath = path.join(__dirname, "../bookData.json");
    let fileContent: any[] = [];

    // Read the existing book data from the JSON file
    try {
      const data = await fs.readFile(filePath, "utf-8");
      fileContent = JSON.parse(data);
    } catch (err) {
      console.log("File not found or empty. Starting fresh.");
      throw new apiError(404, "File not found or empty, starting fresh.");
    }

    // Assuming the id parameter is the ISBN
    const bookIndex = fileContent.findIndex((book) => book.isbn === id);

    if (bookIndex !== -1) {
      // If the book exists, delete it from the list
      fileContent.splice(bookIndex, 1);

      // Write the updated data back to the file
      await fs.writeFile(filePath, JSON.stringify(fileContent, null, 2), "utf-8");

      return res
        .status(200)
        .json(new apiResponse(200, null, "Book deleted successfully"));
    } else {
      throw new apiError(404, "Book not found.");
    }
  } catch (error) {
    console.error("Error while deleting book:", error);
    throw new apiError(500, "Internal Server Error");
  }
};

// Handler to update a book by ID (previously ISBN from query parameter)
export const updateBook: RequestHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const { title, author, publicationDate, genre, price } = req.body;
    
    // Check if ID is provided
    if (!id) {
      throw new apiError(400, "Book ID is required.");
    }

    // Define file path to book data
    const filePath = path.join(__dirname, "../bookData.json");

    // Read the existing book data from the JSON file
    const fileContent = await fs.readFile(filePath, "utf-8");
    let bookData = JSON.parse(fileContent);

    // Find the book by ID (assuming ID is ISBN)
    const bookIndex = bookData.findIndex((book: any) => book.isbn === id);

    // If book not found, return a 404 error
    if (bookIndex === -1) {
      throw new apiError(404, "Book not found.");
    }

    // Update the book details if provided, else keep the old values
    const updatedBook = {
      ...bookData[bookIndex],
      title: title || bookData[bookIndex].title,
      author: author || bookData[bookIndex].author,
      publicationDate: publicationDate || bookData[bookIndex].publicationDate,
      genre: genre || bookData[bookIndex].genre,
      price: price || bookData[bookIndex].price,
    };

    // Replace the old book data with the updated one
    bookData[bookIndex] = updatedBook;

    // Write the updated book data back to the file
    await fs.writeFile(filePath, JSON.stringify(bookData, null, 2), "utf-8");

    // Return a success response
    return res.status(200).json(new apiResponse(200, updatedBook, "Book updated successfully"));
  } catch (error) {
    console.error("Error while updating book:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};