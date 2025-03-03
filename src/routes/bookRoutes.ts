import express from "express";
import { logging } from "../middleware/logging";
import { addBook, deleteBook, getAllBooks, updateBook } from "../controllers/bookController";

const router = express.Router();

router.use(logging);

router.get("/books", getAllBooks);
router.post("/books", addBook);
router.put("/books/:id", updateBook);
router.delete("/books/:id", deleteBook);

export default router;
