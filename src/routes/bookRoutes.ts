import express from "express";
import { logging } from "../middleware/logging";
// import { addBook, deleteBook, getAllBooks, updateBook } from "../controllers/bookController.ts";

const router = express.Router();

router.use(logging);

router.get("/", getAllBooks);
router.post('/addbook', addBook);
router.delete('/deletebook/:isbn', deleteBook)
router.put('/updatebook', updateBook)
export default router;
